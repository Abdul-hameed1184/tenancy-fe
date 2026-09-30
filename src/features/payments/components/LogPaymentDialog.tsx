import { Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSession } from "@/features/auth/hooks/useSession";
import { useLogPayment } from "../hooks/useLogPayment";

export function LogPaymentDialog({ tenancyId }: { tenancyId: string }) {
  const user = useSession();
  const logPayment = useLogPayment(tenancyId);
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="h-4 w-4" /> Log Payment
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Log a payment</DialogTitle>
        </DialogHeader>
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (!user) return;
            logPayment.mutate(
              {
                amount: Number(amount),
                dueDate: new Date(dueDate).toISOString(),
                paidDate: new Date().toISOString(),
                method: "bank_transfer",
                status: "paid",
                loggedByAgentId: user.id,
              },
              {
                onSuccess: () => {
                  setOpen(false);
                  setAmount("");
                  setDueDate("");
                },
              },
            );
          }}
        >
          <div className="space-y-1.5">
            <Label htmlFor="amount">Amount (NGN)</Label>
            <Input
              id="amount"
              type="number"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="dueDate">Due date</Label>
            <Input
              id="dueDate"
              type="date"
              required
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={logPayment.isPending}>
              {logPayment.isPending ? "Logging..." : "Log Payment"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
