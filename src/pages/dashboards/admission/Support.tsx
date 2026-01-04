import DashboardSidebar from "@/components/DashboardSidebar";

export default function AdmissionSupport() {
  return (
    <div className="flex min-h-screen bg-muted/30">
      <DashboardSidebar userType="admission" />
      <main className="flex-1 p-6">
        <h1 className="text-3xl font-bold text-primary mb-6">Support</h1>
        {/* Add support content here */}
      </main>
    </div>
  );
}