import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { ArrowLeft, Check, Upload, X } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/EmptyState";
import { LoadingSkeletonCard } from "@/components/shared/LoadingSkeletonCard";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { useProperty } from "@/features/properties/hooks/useProperty";
import { useTenancies } from "@/features/tenants/hooks/useTenancies";
import { usePaymentHistory } from "@/features/payments/hooks/usePaymentHistory";
import { useAgent } from "@/features/agents/hooks/useAgent";
import { useTenantChangeRequests } from "@/features/tenants/hooks/useTenantChangeRequests";
import { decideTenantChangeRequest } from "@/features/tenants/tenantRequests";
import { uploadAsset } from "@/features/uploads/api";
import { updateProperty } from "@/features/properties/api";
import { queryKeys } from "@/lib/queryKeys";
import { useDashboardDialogStore } from "@/stores/dashboardDialogStore";
import { formatDate, formatNaira } from "@/lib/utils";

export default function LandlordPropertyDetailPage() {
  const { propertyId } = useParams();
  const openDialog = useDashboardDialogStore((s) => s.openDialog);
  const queryClient = useQueryClient();
  const videoInputRef = useRef<HTMLInputElement>(null);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [videoUploadProgress, setVideoUploadProgress] = useState(0);
  const { data: property, isLoading } = useProperty(propertyId);
  const { data: tenancies } = useTenancies({ propertyId });
  const tenancy = tenancies?.[0];
  const { data: payments } = usePaymentHistory(tenancy?.id);
  const { data: agent } = useAgent(property?.agentId ?? undefined);
  const { data: tenantRequests = [] } = useTenantChangeRequests(propertyId);
  const addVideos = async (files: FileList | null) => {
    if (!files?.length || !property) return;
    const selected = Array.from(files).filter((file) =>
      file.type.startsWith("video/"),
    );
    if (!selected.length) {
      toast.error("Select an MP4, MOV, or WebM video.");
      return;
    }

    setUploadingVideo(true);
    setVideoUploadProgress(0);
    try {
      const uploaded: string[] = [];
      for (const file of selected) {
        uploaded.push(
          await uploadAsset(file, "property_video", setVideoUploadProgress),
        );
      }
      await updateProperty(property.id, {
        videos: [...(property.videos ?? []), ...uploaded],
      });
      await queryClient.invalidateQueries({
        queryKey: queryKeys.properties.detail(property.id),
      });
      toast.success(
        `${uploaded.length} video${uploaded.length === 1 ? "" : "s"} added.`,
      );
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Couldn't upload the video.",
      );
    } finally {
      setUploadingVideo(false);
      setVideoUploadProgress(0);
      if (videoInputRef.current) videoInputRef.current.value = "";
    }
  };
  const decideRequest = useMutation({
    mutationFn: ({
      requestId,
      decision,
    }: {
      requestId: string;
      decision: "approve" | "reject";
    }) => decideTenantChangeRequest(requestId, decision),
    onSuccess: async (_, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.tenants.all }),
        queryClient.invalidateQueries({
          queryKey: ["tenants", "requests", propertyId],
        }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.notifications.all,
        }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.properties.detail(propertyId ?? ""),
        }),
      ]);
      toast.success(
        variables.decision === "approve"
          ? "Tenant request approved."
          : "Tenant request rejected.",
      );
    },
    onError: (error: Error) =>
      toast.error(error.message || "Couldn't decide this request."),
  });

  if (isLoading || !property) {
    return <LoadingSkeletonCard lines={5} />;
  }

  return (
    <div>
      <Link
        to="/landlord/properties"
        className="flex items-center gap-1 text-sm text-navy-400 hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" /> Back to properties
      </Link>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-display-sm text-white">{property.title}</h1>
          <p className="mt-1 text-navy-300">
            {property.neighborhood}, {property.city} &bull; {property.address}
          </p>
        </div>
        <StatusBadge
          status={tenancies?.length ? "occupied" : property.status}
        />
      </div>

      <Card className="mt-6 p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <SectionHeader title="Photos & Videos" />
          <Button
            size="sm"
            variant="secondary"
            disabled={uploadingVideo}
            onClick={() => videoInputRef.current?.click()}
          >
            <Upload className="h-4 w-4" />
            {uploadingVideo
              ? `Uploading ${videoUploadProgress}%`
              : "Upload video"}
          </Button>
          <input
            ref={videoInputRef}
            type="file"
            accept="video/mp4,video/quicktime,video/webm"
            multiple
            className="hidden"
            onChange={(event) => void addVideos(event.target.files)}
          />
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {property.photos.map((photo, index) => (
            <img
              key={`${photo}-${index}`}
              src={photo}
              alt={`${property.title} photo ${index + 1}`}
              className="aspect-video w-full rounded-md object-cover"
              loading="lazy"
            />
          ))}
          {(property.videos ?? []).map((video, index) => (
            <video
              key={`${video}-${index}`}
              src={video}
              controls
              preload="metadata"
              className="aspect-video w-full rounded-md bg-navy-950 object-cover"
              aria-label={`${property.title} video ${index + 1}`}
            />
          ))}
        </div>
        {!property.photos.length && !(property.videos ?? []).length && (
          <p className="text-sm text-navy-400">No photos or videos uploaded.</p>
        )}
      </Card>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card className="p-5">
            <SectionHeader
              title="Payment History"
              description="Read-only — logged by your assigned agent."
            />
            {tenancy && (!payments || payments.length === 0) && (
              <EmptyState message="No payments logged yet." />
            )}
            {!tenancy && (
              <EmptyState message="This property is currently unoccupied." />
            )}
            <div className="divide-y divide-navy-700/40">
              {payments?.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between gap-3 py-3"
                >
                  <div>
                    <p className="text-sm font-medium text-white">
                      {entry.note ?? "Rent payment"}
                    </p>
                    <p className="text-xs text-navy-400">
                      Due {formatDate(entry.dueDate)}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-white">
                    {formatNaira(entry.amount)}
                  </p>
                  <StatusBadge status={entry.status} />
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-5">
            <SectionHeader title="Property Details" />
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-navy-400">Annual Rent</dt>
                <dd className="text-white">
                  {formatNaira(property.priceAnnual)}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-navy-400">Occupancy</dt>
                <dd className="text-white">{property.occupancyRate}%</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-navy-400">Bedrooms</dt>
                <dd className="text-white">{property.bedrooms}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-navy-400">Bathrooms</dt>
                <dd className="text-white">{property.bathrooms}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-navy-400">Size</dt>
                <dd className="text-white">
                  {property.sqft
                    ? `${property.sqft.toLocaleString()} sqft`
                    : "Not provided"}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-navy-400">State</dt>
                <dd className="text-white">{property.state}</dd>
              </div>
            </dl>
          </Card>

          <Card className="p-5">
            <SectionHeader title="Managing Agent" />
            {agent ? (
              <>
                <p className="text-sm font-medium text-white">{agent.name}</p>
                <p className="text-xs text-navy-400">{agent.agency}</p>
                <Badge variant="success" className="mt-3">
                  Trust Score {agent.trustScore}%
                </Badge>
                <div className="mt-4">
                  <button
                    onClick={() =>
                      openDialog("assign-agent", { propertyId: property.id })
                    }
                    className="text-sm font-medium text-brand-400 hover:text-brand-300"
                  >
                    Reassign agent
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="text-sm text-navy-400">
                  No agent assigned to this property yet.
                </p>
                <div className="mt-4">
                  <Button
                    size="sm"
                    onClick={() =>
                      openDialog("assign-agent", { propertyId: property.id })
                    }
                  >
                    Assign agent
                  </Button>
                </div>
              </>
            )}
          </Card>

          {tenantRequests.some((request) => request.status === "pending") && (
            <Card className="p-5">
              <SectionHeader
                title="Tenant Requests"
                description="Agent requests awaiting your decision."
              />
              <div className="divide-y divide-navy-700/50">
                {tenantRequests
                  .filter((request) => request.status === "pending")
                  .map((request) => (
                    <div key={request.id} className="py-3 first:pt-0 last:pb-0">
                      <p className="text-sm font-semibold text-white">
                        {request.action === "assign"
                          ? "Assign tenant"
                          : "Remove tenant"}
                      </p>
                      <p className="mt-1 text-sm text-navy-300">
                        {request.tenantName}
                        {request.unit ? ` · ${request.unit}` : ""}
                      </p>
                      {request.leaseStart && request.nextDueDate && (
                        <p className="mt-1 text-xs text-navy-400">
                          Lease starts {formatDate(request.leaseStart)} · due{" "}
                          {formatDate(request.nextDueDate)}
                        </p>
                      )}
                      <div className="mt-3 flex gap-2">
                        <Button
                          size="sm"
                          disabled={decideRequest.isPending}
                          onClick={() =>
                            decideRequest.mutate({
                              requestId: request.id,
                              decision: "approve",
                            })
                          }
                        >
                          <Check /> Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          disabled={decideRequest.isPending}
                          onClick={() =>
                            decideRequest.mutate({
                              requestId: request.id,
                              decision: "reject",
                            })
                          }
                        >
                          <X /> Reject
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
