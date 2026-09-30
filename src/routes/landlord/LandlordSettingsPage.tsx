import { ProfileSettingsView } from "@/components/shared/ProfileSettingsView";

export default function LandlordSettingsPage() {
  return (
    <div>
      <h1 className="text-display-sm text-white sm:text-display-md">Settings</h1>
      <p className="mt-1 text-navy-300">Manage your landlord profile.</p>
      <div className="mt-6">
        <ProfileSettingsView />
      </div>
    </div>
  );
}
