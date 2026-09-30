import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSession } from "@/features/auth/hooks/useSession";
import { useUpdateProfile } from "@/features/auth/hooks/useUpdateProfile";
import { profileSchema, type ProfileFormValues } from "@/features/auth/schemas";
import { ROLE_LABELS } from "@/lib/constants";

export function ProfileSettingsView() {
  const user = useSession();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user?.name ?? "", phone: user?.phone ?? "" },
  });
  const { mutate, isPending, isError, error } = useUpdateProfile();

  if (!user) return null;

  return (
    <div className="max-w-xl space-y-6">
      <Card className="p-5">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={user.avatarUrl} alt={user.name} />
            <AvatarFallback>{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-lg font-semibold text-white">{user.name}</p>
            <p className="text-sm text-navy-400">{ROLE_LABELS[user.role]}</p>
          </div>
        </div>
      </Card>

      <Card className="p-5">
        <h2 className="text-base font-semibold text-white">Profile</h2>
        <form
          className="mt-4 space-y-4"
          onSubmit={handleSubmit((values) => mutate({ id: user.id, ...values }))}
        >
          <div className="space-y-1.5">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" {...register("name")} />
            {errors.name && <p className="text-xs text-red-400">{errors.name.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" value={user.email} disabled />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" {...register("phone")} />
            {errors.phone && <p className="text-xs text-red-400">{errors.phone.message}</p>}
          </div>
          {isError && <p className="text-sm text-red-400">{error.message}</p>}
          <Button type="submit" disabled={isPending}>
            {isPending ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
