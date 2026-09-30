import { ProfileSettingsView } from "@/components/shared/ProfileSettingsView";

export default function AdminSettingsPage() {
  return (
    <div>
      <h1 className="text-display-sm text-white sm:text-display-md">Settings</h1>
      <p className="mt-1 text-navy-300">Manage your admin profile.</p>
      <div className="mt-6">
        <ProfileSettingsView />
      </div>
    </div>
  );
}
