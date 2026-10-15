import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Bell, Check, CheckCheck, X } from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/features/auth/authStore";
import { decideTenantChangeRequest } from "@/features/tenants/tenantRequests";
import { markNotificationRead } from "@/features/notifications/api";
import { useNotifications } from "@/features/notifications/hooks/useNotifications";
import { queryKeys } from "@/lib/queryKeys";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function NotificationsBell() {
  const user = useAuthStore((state) => state.user);
  const queryClient = useQueryClient();
  const { data: items = [], isLoading } = useNotifications();
  const decide = useMutation({
    mutationFn: ({
      requestId,
      decision,
    }: {
      requestId: string;
      decision: "approve" | "reject";
    }) => decideTenantChangeRequest(requestId, decision),
    onSuccess: async (_, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: queryKeys.notifications.all,
        }),
        queryClient.invalidateQueries({ queryKey: queryKeys.tenants.all }),
        queryClient.invalidateQueries({ queryKey: queryKeys.properties.all }),
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
  const markRead = useMutation({
    mutationFn: markNotificationRead,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all }),
  });
  const unreadCount = items.filter((item) => !item.isRead).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="relative flex h-10 w-10 items-center justify-center rounded-md text-navy-300 outline-none transition-colors hover:bg-navy-800 hover:text-white">
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-500 px-1 text-[10px] font-bold text-navy-950">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="max-h-[min(70vh,34rem)] w-[min(22rem,calc(100vw-2rem))] overflow-y-auto"
      >
        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {isLoading ? (
          <p className="px-2 py-4 text-center text-sm text-navy-400">
            Loading notifications...
          </p>
        ) : items.length === 0 ? (
          <p className="px-2 py-4 text-center text-sm text-navy-400">
            No notifications.
          </p>
        ) : (
          items.map((item) => {
            const requestId = item.data.tenantAssignmentRequestId;
            const requestStatus = item.data.requestStatus;
            const canDecide =
              user?.role === "landlord" &&
              item.type === "tenant_assignment_request" &&
              typeof requestId === "string" &&
              requestStatus !== "approved" &&
              requestStatus !== "rejected";
            return (
              <div
                key={item.id}
                className={`border-b border-navy-700/50 px-2 py-3 last:border-0 ${item.isRead ? "opacity-70" : ""}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {item.title}
                    </p>
                    <p className="mt-1 text-xs leading-5 text-navy-300">
                      {item.message}
                    </p>
                  </div>
                  {!item.isRead && !canDecide && (
                    <button
                      type="button"
                      aria-label="Mark notification as read"
                      title="Mark as read"
                      onClick={() => markRead.mutate(item.id)}
                      className="rounded p-1 text-navy-400 hover:bg-navy-800 hover:text-white"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                  )}
                </div>
                {canDecide && (
                  <div className="mt-3 flex gap-2">
                    <Button
                      size="sm"
                      disabled={decide.isPending}
                      onClick={() =>
                        decide.mutate({ requestId, decision: "approve" })
                      }
                    >
                      <CheckCheck /> Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      disabled={decide.isPending}
                      onClick={() =>
                        decide.mutate({ requestId, decision: "reject" })
                      }
                    >
                      <X /> Reject
                    </Button>
                  </div>
                )}
                {item.type === "tenant_assignment_request" &&
                  (requestStatus === "approved" ||
                    requestStatus === "rejected") && (
                    <p className="mt-2 text-xs font-medium text-navy-300">
                      Request {requestStatus}.
                    </p>
                  )}
              </div>
            );
          })
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
