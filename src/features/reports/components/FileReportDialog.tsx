import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useSession } from "@/features/auth/hooks/useSession";
import { useAgents } from "@/features/agents/hooks/useAgents";
import { useProperties } from "@/features/properties/hooks/useProperties";
import { useDashboardDialogStore } from "@/stores/dashboardDialogStore";
import { useCreateReport } from "../hooks/useCreateReport";
import { fileReportSchema, type FileReportFormValues } from "../schemas";

export function FileReportDialog() {
  const user = useSession();
  const openDialogId = useDashboardDialogStore((s) => s.openDialogId);
  const closeDialog = useDashboardDialogStore((s) => s.closeDialog);
  const open = openDialogId === "file-report";
  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors },
  } = useForm<FileReportFormValues>({
    resolver: zodResolver(fileReportSchema),
    defaultValues: { type: "listing", targetId: "", reason: "" },
  });
  const { mutate, isPending, isError, error } = useCreateReport();

  const { data: properties } = useProperties({ landlordId: user?.id });
  const { data: agents } = useAgents({ verificationStatus: "verified" });
  const myAgentIds = new Set(
    (properties ?? []).map((p) => p.agentId).filter((id): id is string => Boolean(id)),
  );
  const myAgents = (agents ?? []).filter((a) => myAgentIds.has(a.id));

  const type = watch("type");

  const onSubmit = (values: FileReportFormValues) => {
    if (!user) return;
    mutate(
      { ...values, reportedById: user.id },
      {
        onSuccess: () => {
          closeDialog();
          reset();
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && closeDialog()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>File a report</DialogTitle>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-1.5">
            <Label htmlFor="type">What are you reporting?</Label>
            <Controller
              control={control}
              name="type"
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={(v) => {
                    field.onChange(v);
                  }}
                >
                  <SelectTrigger id="type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="listing">A listing</SelectItem>
                    <SelectItem value="user">A user</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="targetId">{type === "listing" ? "Property" : "Agent"}</Label>
            <Controller
              control={control}
              name="targetId"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="targetId">
                    <SelectValue placeholder={type === "listing" ? "Select a property" : "Select an agent"} />
                  </SelectTrigger>
                  <SelectContent>
                    {type === "listing"
                      ? properties?.map((p) => (
                          <SelectItem key={p.id} value={p.id}>
                            {p.title}
                          </SelectItem>
                        ))
                      : myAgents.map((a) => (
                          <SelectItem key={a.id} value={a.id}>
                            {a.name}
                          </SelectItem>
                        ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.targetId && <p className="text-xs text-red-400">{errors.targetId.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="reason">Reason</Label>
            <Textarea id="reason" placeholder="Describe the issue…" {...register("reason")} />
            {errors.reason && <p className="text-xs text-red-400">{errors.reason.message}</p>}
          </div>

          {isError && <p className="text-sm text-red-400">{error.message}</p>}

          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Filing..." : "File Report"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
