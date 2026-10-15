import { useEffect, useRef, useState, type DragEvent } from "react";
import { useQuery } from "@tanstack/react-query";
import { ImagePlus, Link2, Loader2, UploadCloud, Video, X } from "lucide-react";
import {
  Controller,
  useFieldArray,
  useForm,
  useWatch,
  type Control,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { uploadAsset } from "@/features/uploads/api";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSession } from "@/features/auth/hooks/useSession";
import { useDashboardDialogStore } from "@/stores/dashboardDialogStore";
import { cn } from "@/lib/utils";
import { useCreateProperty } from "../hooks/useCreateProperty";
import {
  createPropertySchema,
  NIGERIAN_STATES,
  NIGERIAN_STATES_API,
  type CreatePropertyFormInput,
  type CreatePropertyFormValues,
} from "../schemas";

function FieldGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-navy-400">
        {label}
      </p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">{children}</div>
    </div>
  );
}

function PhotoTile({
  control,
  index,
  progress,
  onRemove,
}: {
  control: Control<CreatePropertyFormInput>;
  index: number;
  /** Upload progress (0-100) while this photo is still going to Cloudinary. */
  progress?: number;
  onRemove: () => void;
}) {
  const url = useWatch({ control, name: `photos.${index}.url` });
  if (!url) return null;

  return (
    <div className="group relative aspect-square overflow-hidden rounded-xl border border-navy-700 bg-navy-900">
      <img
        src={url}
        alt=""
        className={cn(
          "h-full w-full object-cover",
          progress !== undefined && "opacity-50",
        )}
      />
      {progress !== undefined && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 text-white">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span className="text-xs font-medium">{progress}%</span>
          <div className="absolute inset-x-2 bottom-2 h-1 overflow-hidden rounded-full bg-white/20">
            <div
              className="h-full bg-brand-500 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
      <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all group-hover:bg-black/50 group-hover:opacity-100">
        <button
          type="button"
          onClick={onRemove}
          className="rounded-full bg-navy-950/90 p-2 text-white transition-colors hover:bg-red-500/90"
          aria-label="Remove photo"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function VideoTile({
  control,
  index,
  progress,
  onRemove,
}: {
  control: Control<CreatePropertyFormInput>;
  index: number;
  progress?: number;
  onRemove: () => void;
}) {
  const url = useWatch({ control, name: `videos.${index}.url` });
  if (!url) return null;

  return (
    <div className="group relative aspect-square overflow-hidden rounded-xl border border-navy-700 bg-navy-900">
      <video
        src={url}
        className={cn(
          "h-full w-full object-cover",
          progress !== undefined && "opacity-50",
        )}
      />
      {progress !== undefined && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 text-white">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span className="text-xs font-medium">{progress}%</span>
          <div className="absolute inset-x-2 bottom-2 h-1 overflow-hidden rounded-full bg-white/20">
            <div
              className="h-full bg-brand-500 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
      <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all group-hover:bg-black/50 group-hover:opacity-100">
        <button
          type="button"
          onClick={onRemove}
          className="rounded-full bg-navy-950/90 p-2 text-white transition-colors hover:bg-red-500/90"
          aria-label="Remove video"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

const emptyPropertyForm: CreatePropertyFormInput = {
  title: "",
  address: "",
  city: "",
  state: "",
  neighborhood: "",
  bedrooms: undefined,
  bathrooms: undefined,
  sqft: "",
  priceAnnual: undefined,
  photos: [],
  videos: [],
};

export function CreatePropertyDialog() {
  const user = useSession();
  const openDialogId = useDashboardDialogStore((s) => s.openDialogId);
  const closeDialog = useDashboardDialogStore((s) => s.closeDialog);
  const open = openDialogId === "create-property";

  const [isDragging, setIsDragging] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlDraft, setUrlDraft] = useState("");
  // Uploads in flight, keyed by the local preview (blob:) URL shown in the tile.
  const [uploads, setUploads] = useState<Record<string, number>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const uploading = Object.keys(uploads).length > 0;
  const { data: states = NIGERIAN_STATES, isLoading: statesLoading } = useQuery(
    {
      queryKey: ["reference-data", "nigerian-states"],
      queryFn: async () => {
        const response = await fetch(NIGERIAN_STATES_API);
        if (!response.ok) throw new Error("Could not load Nigerian states");
        const payload: unknown = await response.json();
        if (
          !Array.isArray(payload) ||
          !payload.every((state) => typeof state === "string")
        ) {
          throw new Error("Unexpected Nigerian states response");
        }
        return payload
          .map((state) => {
            if (state === "FCT") return "Federal Capital Territory";
            if (state === "AkwaIbom") return "Akwa Ibom";
            if (state === "CrossRiver") return "Cross River";
            return state;
          })
          .sort((a, b) => a.localeCompare(b));
      },
      staleTime: 24 * 60 * 60 * 1000,
      retry: 1,
    },
  );

  const {
    register,
    handleSubmit,
    control,
    reset,
    getValues,
    formState: { errors },
  } = useForm<CreatePropertyFormInput, unknown, CreatePropertyFormValues>({
    resolver: zodResolver(createPropertySchema),
    defaultValues: emptyPropertyForm,
  });
  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "photos",
  });
  const {
    fields: videoFields,
    append: appendVideo,
    remove: removeVideoField,
    update: updateVideo,
  } = useFieldArray({ control, name: "videos" });
  const { mutate, isPending, isError, error } = useCreateProperty();

  const indexOfPhoto = (url: string) =>
    getValues("photos").findIndex((p) => p.url === url);
  const indexOfVideo = (url: string) =>
    (getValues("videos") ?? []).findIndex((video) => video.url === url);
  const setProgress = (preview: string, percent: number | null) =>
    setUploads((current) => {
      const next = { ...current };
      if (percent === null) delete next[preview];
      else next[preview] = percent;
      return next;
    });

  /**
   * Each file shows at once as a local preview, uploads straight to Cloudinary with a
   * server-signed request, then the preview is swapped for the permanent secure_url.
   */
  const uploadFile = async (file: File, kind: "photo" | "video") => {
    const preview = URL.createObjectURL(file);
    if (kind === "photo") append({ url: preview });
    else appendVideo({ url: preview });
    setProgress(preview, 0);
    try {
      const finalUrl = await uploadAsset(
        file,
        kind === "photo" ? "property_photo" : "property_video",
        (pct) => setProgress(preview, pct),
      );
      const index =
        kind === "photo" ? indexOfPhoto(preview) : indexOfVideo(preview);
      if (index !== -1) {
        if (kind === "photo") update(index, { url: finalUrl });
        else updateVideo(index, { url: finalUrl });
      } else if (finalUrl.startsWith("blob:")) {
        URL.revokeObjectURL(finalUrl);
      }
    } catch (err) {
      const index =
        kind === "photo" ? indexOfPhoto(preview) : indexOfVideo(preview);
      if (index !== -1) {
        if (kind === "photo") remove(index);
        else removeVideoField(index);
      }
      toast.error(
        err instanceof Error
          ? err.message
          : `${kind === "photo" ? "Photo" : "Video"} upload failed.`,
      );
    } finally {
      setProgress(preview, null);
      URL.revokeObjectURL(preview);
    }
  };

  const addFiles = (files: FileList | File[], kind: "photo" | "video") => {
    Array.from(files)
      .filter((file) =>
        file.type.startsWith(kind === "photo" ? "image/" : "video/"),
      )
      .forEach((file) => void uploadFile(file, kind));
  };

  const removePhoto = (index: number) => {
    const url = fields[index]?.url;
    if (url?.startsWith("blob:") && !(url in uploads)) URL.revokeObjectURL(url);
    remove(index);
  };

  const removeVideo = (index: number) => {
    const url = videoFields[index]?.url;
    if (url?.startsWith("blob:") && !(url in uploads)) URL.revokeObjectURL(url);
    removeVideoField(index);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files, "photo");
  };

  const handleClose = () => {
    closeDialog();
  };

  useEffect(() => {
    if (open) return;
    [...getValues("photos"), ...(getValues("videos") ?? [])].forEach(
      ({ url }) => {
        if (url.startsWith("blob:") && url in uploads) URL.revokeObjectURL(url);
      },
    );
    reset(emptyPropertyForm);
    setUploads((current) => (Object.keys(current).length ? {} : current));
    setIsDragging(false);
    setShowUrlInput(false);
    setUrlDraft("");
  }, [open, getValues, reset, uploads]);

  const onSubmit = (values: CreatePropertyFormValues) => {
    if (!user) return;
    if (uploading) {
      toast.error("Wait for all media to finish uploading.");
      return;
    }
    mutate(
      {
        title: values.title,
        address: values.address,
        city: values.city,
        state: values.state,
        neighborhood: values.neighborhood,
        bedrooms: values.bedrooms,
        bathrooms: values.bathrooms,
        sqft: values.sqft || undefined,
        priceAnnual: values.priceAnnual,
        photos: values.photos.map((p) => p.url),
        videos: values.videos.map((video) => video.url),
        landlordId: user.id,
      },
      { onSuccess: handleClose },
    );
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>List a new property</DialogTitle>
        </DialogHeader>
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <div className="mb-3 flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wide text-navy-400">
                Photos
              </p>
              <button
                type="button"
                onClick={() => setShowUrlInput((v) => !v)}
                className="flex items-center gap-1 text-xs font-medium text-brand-400 hover:text-brand-300"
              >
                <Link2 className="h-3.5 w-3.5" /> Add via URL
              </button>
            </div>

            {showUrlInput && (
              <div className="mb-3 flex gap-2">
                <Input
                  placeholder="https://…"
                  value={urlDraft}
                  onChange={(e) => setUrlDraft(e.target.value)}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    if (!urlDraft.trim()) return;
                    append({ url: urlDraft.trim() });
                    setUrlDraft("");
                  }}
                >
                  Add
                </Button>
              </div>
            )}

            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
              {fields.map((field, index) => (
                <PhotoTile
                  key={field.id}
                  control={control}
                  index={index}
                  progress={uploads[field.url]}
                  onRemove={() => removePhoto(index)}
                />
              ))}
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={cn(
                  "flex aspect-square cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed text-center transition-colors",
                  isDragging
                    ? "border-brand-500 bg-brand-500/10 text-brand-400"
                    : "border-navy-700 text-navy-400 hover:border-navy-500 hover:text-navy-300",
                )}
              >
                {isDragging ? (
                  <UploadCloud className="h-6 w-6" />
                ) : (
                  <ImagePlus className="h-6 w-6" />
                )}
                <p className="px-2 text-xs font-medium">Add photos</p>
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.length) addFiles(e.target.files, "photo");
                e.target.value = "";
              }}
            />
            {errors.photos?.message && (
              <p className="mt-2 text-xs text-red-400">
                {errors.photos.message}
              </p>
            )}
          </div>

          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-navy-400">
              Videos
            </p>
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
              {videoFields.map((field, index) => (
                <VideoTile
                  key={field.id}
                  control={control}
                  index={index}
                  progress={uploads[field.url]}
                  onRemove={() => removeVideo(index)}
                />
              ))}
              <button
                type="button"
                onClick={() => videoInputRef.current?.click()}
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => {
                  event.preventDefault();
                  if (event.dataTransfer.files?.length)
                    addFiles(event.dataTransfer.files, "video");
                }}
                className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-navy-700 text-center text-navy-400 transition-colors hover:border-navy-500 hover:text-navy-300"
              >
                <Video className="h-6 w-6" />
                <span className="px-2 text-xs font-medium">Add videos</span>
              </button>
            </div>
            <input
              ref={videoInputRef}
              type="file"
              accept="video/mp4,video/quicktime,video/webm"
              multiple
              className="hidden"
              onChange={(event) => {
                if (event.target.files?.length)
                  addFiles(event.target.files, "video");
                event.target.value = "";
              }}
            />
          </div>

          <FieldGroup label="Basic Info">
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="The Eko Sky Terrace"
                {...register("title")}
              />
              {errors.title && (
                <p className="text-xs text-red-400">{errors.title.message}</p>
              )}
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                placeholder="12 Ocean Parade Close"
                {...register("address")}
              />
              {errors.address && (
                <p className="text-xs text-red-400">{errors.address.message}</p>
              )}
            </div>
          </FieldGroup>

          <FieldGroup label="Location">
            <div className="space-y-1.5">
              <Label htmlFor="neighborhood">Neighborhood</Label>
              <Input
                id="neighborhood"
                placeholder="Banana Island"
                {...register("neighborhood")}
              />
              {errors.neighborhood && (
                <p className="text-xs text-red-400">
                  {errors.neighborhood.message}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="city">City</Label>
              <Input id="city" placeholder="Lagos" {...register("city")} />
              {errors.city && (
                <p className="text-xs text-red-400">{errors.city.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="state">State</Label>
              <Controller
                control={control}
                name="state"
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={statesLoading}
                  >
                    <SelectTrigger id="state">
                      <SelectValue
                        placeholder={
                          statesLoading ? "Loading states..." : "Select a state"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {states.map((state) => (
                        <SelectItem key={state} value={state}>
                          {state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.state && (
                <p className="text-xs text-red-400">{errors.state.message}</p>
              )}
            </div>
          </FieldGroup>

          <FieldGroup label="Specs &amp; Pricing">
            <div className="space-y-1.5">
              <Label htmlFor="bedrooms">Bedrooms</Label>
              <Input
                id="bedrooms"
                type="number"
                step="1"
                min="0"
                {...register("bedrooms")}
              />
              {errors.bedrooms && (
                <p className="text-xs text-red-400">
                  {errors.bedrooms.message}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="bathrooms">Bathrooms</Label>
              <Input
                id="bathrooms"
                type="number"
                step="0.5"
                min="0"
                {...register("bathrooms")}
              />
              {errors.bathrooms && (
                <p className="text-xs text-red-400">
                  {errors.bathrooms.message}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="sqft">Square Feet</Label>
              <Input
                id="sqft"
                type="number"
                step="1"
                min="0"
                placeholder="Optional"
                {...register("sqft")}
              />
              {errors.sqft && (
                <p className="text-xs text-red-400">{errors.sqft.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="priceAnnual">Annual Rent (NGN)</Label>
              <Input
                id="priceAnnual"
                type="number"
                step="1"
                min="0"
                {...register("priceAnnual")}
              />
              {errors.priceAnnual && (
                <p className="text-xs text-red-400">
                  {errors.priceAnnual.message}
                </p>
              )}
            </div>
          </FieldGroup>

          {isError && <p className="text-sm text-red-400">{error.message}</p>}

          <DialogFooter>
            <Button type="submit" disabled={isPending || uploading}>
              {uploading
                ? "Uploading media..."
                : isPending
                  ? "Listing..."
                  : "List Property"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
