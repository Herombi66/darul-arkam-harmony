import DashboardSidebar from "@/components/DashboardSidebar";

export default function AdmissionProfile() {
  return (
    <div className="flex min-h-screen bg-muted/30">
      <DashboardSidebar userType="admission" />
      <main className="flex-1 p-6">
        <h1 className="text-3xl font-bold text-primary mb-6">Profile</h1>
        {/* Add profile content here */}
      </main>
    </div>
  );
}