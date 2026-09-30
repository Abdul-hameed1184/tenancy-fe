import { useEffect } from "react";
import { UserMinus } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSession } from "@/features/auth/hooks/useSession";
import { useAgents } from "@/features/agents/hooks/useAgents";
import { useDashboardDialogStore } from "@/stores/dashboardDialogStore";
import { useAssignAgent } from "../hooks/useAssignAgent";
import { useProperties } from "../hooks/useProperties";
import { useUnassignAgent } from "../hooks/useUnassignAgent";

interface AssignFormValues {
  selectedId: string;
}

export function AssignAgentDialog() {
  const user = useSession();
  const openDialogId = useDashboardDialogStore((s) => s.openDialogId);
  const assignAgentContext = useDashboardDialogStore((s) => s.assignAgentContext);
  const closeDialog = useDashboardDialogStore((s) => s.closeDialog);
  const open = openDialogId === "assign-agent";

  const { propertyId, agentId } = assignAgentContext ?? {};
  const pickingAgent = Boolean(propertyId);
  const { data: myProperties } = useProperties({ landlordId: user?.id });
  const currentAgentId = propertyId
    ? (myProperties?.find((p) => p.id === propertyId)?.agentId ?? undefined)
    : undefined;

  const { control, handleSubmit, reset, setValue } = useForm<AssignFormValues>({
    defaultValues: { selectedId: currentAgentId ?? "" },
  });
  const { mutate, isPending } = useAssignAgent();
  const { mutate: unassign, isPending: isUnassigning } = useUnassignAgent();

  const { data: agents } = useAgents({ verificationStatus: "verified" });
  const assignableProperties = pickingAgent
    ? myProperties
    : myProperties?.filter((p) => p.agentId !== agentId);

  useEffect(() => {
    if (open) setValue("selectedId", currentAgentId ?? "");
  }, [open, currentAgentId, setValue]);

  const onSubmit = (values: AssignFormValues) => {
    if (!values.selectedId) return;
    const payload = propertyId
      ? { propertyId, agentId: values.selectedId }
      : { propertyId: values.selectedId, agentId: agentId as string };
    mutate(payload, {
      onSuccess: () => {
        closeDialog();
        reset();
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && closeDialog()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{pickingAgent ? "Assign an agent" : "Assign to a property"}</DialogTitle>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-1.5">
            <Label htmlFor="selectedId">{pickingAgent ? "Agent" : "Property"}</Label>
            <Controller
              control={control}
              name="selectedId"
              rules={{ required: true }}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="selectedId">
                    <SelectValue placeholder={pickingAgent ? "Select an agent" : "Select a property"} />
                  </SelectTrigger>
                  <SelectContent>
                    {pickingAgent
                      ? agents?.map((agent) => (
                          <SelectItem key={agent.id} value={agent.id}>
                            {agent.name} — {agent.agency}
                            {agent.id === currentAgentId ? " (current)" : ""}
                          </SelectItem>
                        ))
                      : assignableProperties?.map((property) => (
                          <SelectItem key={property.id} value={property.id}>
                            {property.title}
                          </SelectItem>
                        ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <DialogFooter className={pickingAgent && currentAgentId ? "sm:justify-between" : undefined}>
            {pickingAgent && currentAgentId && (
              <Button
                type="button"
                variant="ghost"
                disabled={isUnassigning}
                onClick={() =>
                  unassign(propertyId as string, {
                    onSuccess: () => closeDialog(),
                  })
                }
              >
                <UserMinus className="h-4 w-4" /> {isUnassigning ? "Unassigning..." : "Unassign"}
              </Button>
            )}
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
