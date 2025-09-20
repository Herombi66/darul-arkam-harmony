import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  User,
  BookOpen,
  CreditCard,
  Calendar,
  MessageSquare,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  LogOut,
  GraduationCap,
  Users,
  FileText,
  Clock,
  CalendarDays,
  Grid3X3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import schoolLogo from '@/assets/school-logo.png';
import { useAuth } from '@/contexts/AuthContext';

interface SidebarItem {
  icon: any;
  label: string;
  href: string;
  children?: SidebarItem[];
}

interface DashboardSidebarProps {
  userType: 'student' | 'teacher' | 'parent' | 'admin' | 'exams' | 'admission' | 'finance' | 'media';
}

const sidebarItems = {
  student: [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard/student' },
    { icon: User, label: 'Profile', href: '/dashboard/student/profile' },
    { 
      icon: BookOpen, 
      label: 'Academics', 
      href: '/dashboard/student/academics',
      children: [
        { icon: BookOpen, label: 'Subjects', href: '/dashboard/student/academics/subjects' },
        { icon: FileText, label: 'Assignments', href: '/dashboard/student/academics/assignments' },
        { icon: GraduationCap, label: 'Results', href: '/dashboard/student/academics/results' },
      ]
    },
    { 
      icon: CreditCard, 
      label: 'Payments', 
      href: '/dashboard/student/payments',
      children: [
        { icon: CreditCard, label: 'Pay Fees', href: '/dashboard/student/payments/pay' },
        { icon: FileText, label: 'History', href: '/dashboard/student/payments/history' },
      ]
    },
    { 
      icon: Clock, 
      label: 'Attendance', 
      href: '/dashboard/student/attendance',
      children: [
        { icon: Clock, label: 'Records', href: '/dashboard/student/attendance/records' },
        { icon: FileText, label: 'Request Leave', href: '/dashboard/student/attendance/leave' },
      ]
    },
    { icon: CalendarDays, label: 'Events', href: '/dashboard/student/events' },
    { icon: MessageSquare, label: 'Messages', href: '/dashboard/student/messages' },
    { icon: HelpCircle, label: 'Support', href: '/dashboard/student/support' },
  ],
  teacher: [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard/teacher' },
    { icon: User, label: 'Profile', href: '/dashboard/teacher/profile' },
    {
      icon: BookOpen,
      label: 'Academics',
      href: '/dashboard/teacher/academics',
      children: [
        { icon: BookOpen, label: 'Subjects', href: '/dashboard/teacher/subjects' },
        { icon: Users, label: 'Classes', href: '/dashboard/teacher/classes' },
        { icon: FileText, label: 'Assignments', href: '/dashboard/teacher/assignments' },
        { icon: Clock, label: 'Attendance', href: '/dashboard/teacher/attendance' },
        { icon: FileText, label: 'Record Sheet', href: '/dashboard/teacher/record-sheet' },
      ]
    },
    { icon: CalendarDays, label: 'Events', href: '/dashboard/teacher/events' },
    { icon: MessageSquare, label: 'Messages', href: '/dashboard/teacher/messages' },
    { icon: HelpCircle, label: 'Support', href: '/dashboard/teacher/support' },
  ],
  parent: [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard/parent' },
    { icon: User, label: 'Profile', href: '/dashboard/parent/profile' },
    { icon: Users, label: 'Children', href: '/dashboard/parent/children' },
    { icon: CreditCard, label: 'Payments', href: '/dashboard/parent/payments' },
    { icon: CalendarDays, label: 'Events', href: '/dashboard/parent/events' },
    { icon: MessageSquare, label: 'Messages', href: '/dashboard/parent/messages' },
    { icon: HelpCircle, label: 'Support', href: '/dashboard/parent/support' },
  ],
  admin: [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard/admin' },
    { icon: User, label: 'Profile', href: '/dashboard/admin/profile' },
    { icon: Users, label: 'User Management', href: '/dashboard/admin/users' },
    { icon: BookOpen, label: 'Academic Management', href: '/dashboard/admin/academics' },
    { icon: CreditCard, label: 'Financial Reports', href: '/dashboard/admin/finance' },
    { icon: CalendarDays, label: 'Events', href: '/dashboard/admin/events' },
    { icon: MessageSquare, label: 'Messages', href: '/dashboard/admin/messages' },
    { icon: HelpCircle, label: 'Support', href: '/dashboard/admin/support' },
  ],
  exams: [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard/exams' },
    { icon: User, label: 'Profile', href: '/dashboard/exams/profile' },
    { icon: Users, label: 'Classes', href: '/dashboard/exams/classes' },
    { icon: Calendar, label: 'Exam Timetable', href: '/dashboard/exams/timetable' },
    { icon: FileText, label: 'Exam Cards', href: '/dashboard/exams/cards' },
    { icon: GraduationCap, label: 'Result Compiler', href: '/dashboard/exams/compiler' },
    { icon: FileText, label: 'Student Results', href: '/dashboard/exams/results' },
    { icon: CalendarDays, label: 'Events', href: '/dashboard/exams/events' },
    { icon: MessageSquare, label: 'Messages', href: '/dashboard/exams/messages' },
    { icon: HelpCircle, label: 'Support', href: '/dashboard/exams/support' },
  ],
  admission: [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard/admission' },
    { icon: User, label: 'Profile', href: '/dashboard/admission/profile' },
    { icon: FileText, label: 'Applications', href: '/dashboard/admission/applications' },
    { icon: Users, label: 'Student Enrollment', href: '/dashboard/admission/enrollment' },
    { icon: CalendarDays, label: 'Events', href: '/dashboard/admission/events' },
    { icon: MessageSquare, label: 'Messages', href: '/dashboard/admission/messages' },
    { icon: HelpCircle, label: 'Support', href: '/dashboard/admission/support' },
  ],
  finance: [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard/finance' },
    { icon: User, label: 'Profile', href: '/dashboard/finance/profile' },
    { icon: CreditCard, label: 'Fee Management', href: '/dashboard/finance/fees' },
    { icon: FileText, label: 'Expenses', href: '/dashboard/finance/expenses' },
    { icon: FileText, label: 'Reports', href: '/dashboard/finance/reports' },
    { icon: CalendarDays, label: 'Events', href: '/dashboard/finance/events' },
    { icon: MessageSquare, label: 'Messages', href: '/dashboard/finance/messages' },
    { icon: HelpCircle, label: 'Support', href: '/dashboard/finance/support' },
  ],
  media: [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard/media' },
    { icon: User, label: 'Profile', href: '/dashboard/media/profile' },
    { icon: FileText, label: 'Gallery Management', href: '/dashboard/media/gallery' },
    { icon: FileText, label: 'Articles', href: '/dashboard/media/articles' },
    { icon: CalendarDays, label: 'Event Management', href: '/dashboard/media/events' },
    { icon: MessageSquare, label: 'Messages', href: '/dashboard/media/messages' },
    { icon: HelpCircle, label: 'Support', href: '/dashboard/media/support' },
  ],
};

export default function DashboardSidebar({ userType }: DashboardSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const items = sidebarItems[userType] || sidebarItems.student;

  const toggleExpanded = (href: string) => {
    setExpandedItems(prev => 
      prev.includes(href) 
        ? prev.filter(item => item !== href)
        : [...prev, href]
    );
  };

  const isActive = (href: string) => {
    return location.pathname === href || location.pathname.startsWith(href + '/');
  };

  const isExpanded = (href: string) => {
    return expandedItems.includes(href) || location.pathname.startsWith(href);
  };

  return (
    <>
      <div className={cn(
        "bg-primary text-primary-foreground transition-all duration-300 flex flex-col relative",
        isCollapsed ? "w-0 overflow-hidden" : "w-64"
      )}>
        {/* Header */}
        <div className="p-4 border-b border-primary-foreground/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img src={schoolLogo} alt="School Logo" className="h-8 w-8" />
              <div>
                <h2 className="font-bold text-sm">Darul Arqam Academy</h2>
                <p className="text-xs text-primary-foreground/70">Gombe State</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="text-primary-foreground hover:bg-primary-foreground/10"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          <div className="space-y-1 px-2">
            {items.map((item, index) => {
              const hasChildren = 'children' in item && item.children;
              return (
                <div key={index}>
                  {hasChildren ? (
                    <button
                      onClick={() => toggleExpanded(item.href)}
                      className={cn(
                        "flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors w-full",
                        "hover:bg-primary-foreground/10",
                        isActive(item.href) && "bg-primary-foreground/20 text-white"
                      )}
                    >
                      <item.icon className="h-5 w-5 mr-3" />
                      <span className="flex-1 text-left">{item.label}</span>
                      <ChevronRight className={cn(
                        "h-4 w-4 transition-transform",
                        isExpanded(item.href) && "rotate-90"
                      )} />
                    </button>
                  ) : (
                    <Link
                      to={item.href}
                      className={cn(
                        "flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                        "hover:bg-primary-foreground/10",
                        isActive(item.href) && "bg-primary-foreground/20 text-white"
                      )}
                    >
                      <item.icon className="h-5 w-5 mr-3" />
                      <span className="flex-1">{item.label}</span>
                    </Link>
                  )}

                  {/* Sub-items */}
                  {hasChildren && isExpanded(item.href) && (
                    <div className="ml-6 mt-1 space-y-1">
                      {(item as SidebarItem & { children: SidebarItem[] }).children.map((child, childIndex) => (
                        <Link
                          key={childIndex}
                          to={child.href}
                          className={cn(
                            "flex items-center px-3 py-2 rounded-lg text-sm transition-colors",
                            "hover:bg-primary-foreground/10",
                            isActive(child.href) && "bg-primary-foreground/20 text-white"
                          )}
                        >
                          <child.icon className="h-4 w-4 mr-3" />
                          <span>{child.label}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </nav>

        {/* Quick Stats & Actions for Admin */}
        {userType === 'admin' && (
          <div className="p-4 border-t border-primary-foreground/20 space-y-4">
            {/* Quick Stats */}
            <div className="space-y-2">
              <p className="text-xs text-primary-foreground/70 font-medium">System Overview</p>
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="bg-primary-foreground/10 rounded p-2">
                  <div className="text-lg font-bold text-primary-foreground">1.2K</div>
                  <div className="text-xs text-primary-foreground/70">Users</div>
                </div>
                <div className="bg-primary-foreground/10 rounded p-2">
                  <div className="text-lg font-bold text-primary-foreground">99.8%</div>
                  <div className="text-xs text-primary-foreground/70">Uptime</div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-2">
              <p className="text-xs text-primary-foreground/70 font-medium">Quick Access</p>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-primary-foreground hover:bg-primary-foreground/10 h-8 text-xs"
                  asChild
                >
                  <Link to="/dashboard/admin/profile">
                    <User className="h-3 w-3 mr-1" />
                    Profile
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-primary-foreground hover:bg-primary-foreground/10 h-8 text-xs"
                  asChild
                >
                  <Link to="/dashboard/admin/users">
                    <Users className="h-3 w-3 mr-1" />
                    Users
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Logout */}
        <div className="p-4 border-t border-primary-foreground/20">
          <Button
            variant="ghost"
            className="w-full text-primary-foreground hover:bg-primary-foreground/10"
            onClick={() => {
              logout();
              navigate('/login');
            }}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
      
      {/* Floating toggle button when collapsed */}
      {isCollapsed && (
        <Button
          variant="default"
          size="icon"
          onClick={() => setIsCollapsed(false)}
          className="fixed top-4 left-4 z-50 bg-primary hover:bg-primary/90 shadow-lg"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}
    </>
  );
}