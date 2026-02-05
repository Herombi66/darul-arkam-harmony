import DashboardSidebar from '@/components/DashboardSidebar';
import { Outlet } from 'react-router-dom';
import DashboardHeader from '@/components/DashboardHeader';
import { useAuth } from '@/contexts/AuthContext';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';

export default function DashboardLayout({ userType }) {
  const { user } = useAuth();
  return (
    <SidebarProvider>
      <DashboardSidebar userType={userType} />
      <SidebarInset>
        <DashboardHeader user={user} />
        <div className="flex-1 overflow-auto p-4 md:p-6">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
