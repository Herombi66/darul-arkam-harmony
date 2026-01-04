import DashboardSidebar from '@/components/DashboardSidebar';
import { Outlet } from 'react-router-dom';

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-muted/30">
      <DashboardSidebar userType="admin" />
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}