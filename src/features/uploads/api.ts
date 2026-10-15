import { USE_MOCKS } from "@/lib/api/config";
import { http } from "@/lib/api/http";

export type UploadPurpose = "property_photo" | "property_video" | "avatar";

/** What POST /uploads/signature returns: a one-off, server-signed Cloudinary upload. */
export interface UploadSignature {
  uploadUrl: string;
  /** Send every entry as-is in the multipart form, alongside `file`. */
  fields: Record<string, string>;
  maxBytes: number;
  allowedFormats: string[];
  /** Unix seconds; Cloudinary rejects the signature after this. */
  expiresAt: number;
}

const MIME_BY_FORMAT: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  mp4: "video/mp4",
  mov: "video/quicktime",
  webm: "video/webm",
};

export class UploadError extends Error {}

export const requestUploadSignature = (purpose: UploadPurpose) =>
  http.post<UploadSignature>("/uploads/signature", { purpose });

function assertAcceptable(
  file: File,
  signature: UploadSignature,
  purpose: UploadPurpose,
) {
  const allowedMimes = new Set(
    signature.allowedFormats.map((f) => MIME_BY_FORMAT[f]),
  );
  if (!allowedMimes.has(file.type)) {
    throw new UploadError(
      `${file.name}: only ${signature.allowedFormats.join(", ").toUpperCase()} ${purpose === "property_video" ? "videos" : "images"} are allowed.`,
    );
  }
  if (file.size > signature.maxBytes) {
    const mb = Math.round(signature.maxBytes / (1024 * 1024));
    throw new UploadError(`${file.name} is larger than ${mb} MB.`);
  }
}

/**
 * Uploads straight from the browser to Cloudinary; the file never passes through our API.
 * XMLHttpRequest (not fetch) because only XHR reports upload progress.
 */
function postToCloudinary(
  file: File,
  signature: UploadSignature,
  onProgress?: (percent: number) => void,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const form = new FormData();
    Object.entries(signature.fields).forEach(([key, value]) =>
      form.append(key, value),
    );
    form.append("file", file);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", signature.uploadUrl);
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable)
        onProgress?.(Math.round((event.loaded / event.total) * 100));
    };
    xhr.onload = () => {
      let body: { secure_url?: string; error?: { message?: string } } = {};
      try {
        body = JSON.parse(xhr.responseText);
      } catch {
        /* non-JSON error page */
      }
      if (xhr.status >= 200 && xhr.status < 300 && body.secure_url) {
        resolve(body.secure_url);
      } else {
        reject(
          new UploadError(
            body.error?.message ?? `Upload failed (${xhr.status}).`,
          ),
        );
      }
    };
    xhr.onerror = () =>
      reject(new UploadError("Upload failed — check your connection."));
    xhr.send(form);
  });
}

/** Returns the permanent https URL to store (property photo, avatarUrl, ...). */
export async function uploadAsset(
  file: File,
  purpose: UploadPurpose,
  onProgress?: (percent: number) => void,
): Promise<string> {
  if (USE_MOCKS) {
    // No backend to sign uploads in mock mode: keep a local preview URL, as before.
    onProgress?.(100);
    return URL.createObjectURL(file);
  }
  const signature = await requestUploadSignature(purpose);
  assertAcceptable(file, signature, purpose);
  return postToCloudinary(file, signature, onProgress);
}

export const uploadImage = uploadAsset;
