import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Camera, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSession } from "@/features/auth/hooks/useSession";
import { useUpdateProfile } from "@/features/auth/hooks/useUpdateProfile";
import { profileSchema, type ProfileFormValues } from "@/features/auth/schemas";
import { uploadImage } from "@/features/uploads/api";
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
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [avatarProgress, setAvatarProgress] = useState<number | null>(null);

  if (!user) return null;

  /** Picked image -> signed direct upload to Cloudinary -> save its URL on the profile. */
  const changeAvatar = async (file: File) => {
    setAvatarProgress(0);
    try {
      const avatarUrl = await uploadImage(file, "avatar", setAvatarProgress);
      mutate({ id: user.id, avatarUrl });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't upload that photo.");
    } finally {
      setAvatarProgress(null);
    }
  };

  return (
    <div className="max-w-xl space-y-6">
      <Card className="p-5">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => avatarInputRef.current?.click()}
            disabled={avatarProgress !== null}
            className="group relative rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
            aria-label="Change profile photo"
          >
            <Avatar className="h-16 w-16">
              <AvatarImage src={user.avatarUrl} alt={user.name} />
              <AvatarFallback>{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 text-white opacity-0 transition-opacity group-hover:opacity-100 group-disabled:opacity-100">
              {avatarProgress !== null ? (
                <span className="flex flex-col items-center text-[10px] font-medium">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {avatarProgress}%
                </span>
              ) : (
                <Camera className="h-5 w-5" />
              )}
            </span>
          </button>
          <input
            ref={avatarInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void changeAvatar(file);
              e.target.value = "";
            }}
          />
          <div>
            <p className="text-lg font-semibold text-white">{user.name}</p>
            <p className="text-sm text-navy-400">{ROLE_LABELS[user.role]}</p>
            <p className="mt-0.5 text-xs text-navy-500">Click the photo to change it.</p>
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
