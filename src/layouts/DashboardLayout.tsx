import DashboardSidebar from '@/components/DashboardSidebar';
import { Outlet } from 'react-router-dom';
import DashboardHeader from '@/components/DashboardHeader';
import { useAuth } from '@/contexts/AuthContext';

export default function DashboardLayout({ userType }) {
  const { user } = useAuth();
  return (
    <div className="flex min-h-screen bg-muted/30">
      <DashboardSidebar userType={userType} />
      <main className="flex-1 overflow-auto">
        <DashboardHeader user={user} />
        <Outlet />
      </main>
    </div>
  );
}