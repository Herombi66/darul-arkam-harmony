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
  LogOut,
  GraduationCap,
  Users,
  FileText,
  Clock,
  CalendarDays,
  ChevronRight,
  ChevronDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import schoolLogo from '@/assets/school-logo.png';
import { useAuth } from '@/contexts/AuthContext';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

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
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const items = sidebarItems[userType] || sidebarItems.student;

  const isActive = (href: string) => {
    return location.pathname === href || location.pathname.startsWith(href + '/');
  };

  return (
    <Sidebar collapsible="icon" variant="sidebar">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-2">
          <img src={schoolLogo} alt="School Logo" className="h-8 w-8 rounded-full" />
          <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
            <span className="truncate font-semibold">Care and Support</span>
            <span className="truncate text-xs">Academy</span>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item, index) => (
                <div key={index}>
                  {'children' in item && item.children ? (
                    <Collapsible defaultOpen={isActive(item.href)} className="group/collapsible">
                      <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton tooltip={item.label} isActive={isActive(item.href)}>
                            <item.icon className="h-4 w-4" />
                            <span>{item.label}</span>
                            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {Array.isArray(item.children) && item.children.map((child, childIndex) => (
                              <SidebarMenuSubItem key={childIndex}>
                                <SidebarMenuSubButton asChild isActive={isActive(child.href)}>
                                  <Link to={child.href}>
                                    <child.icon className="h-4 w-4 mr-2" />
                                    <span>{child.label}</span>
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </SidebarMenuItem>
                    </Collapsible>
                  ) : (
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild isActive={isActive(item.href)} tooltip={item.label}>
                        <Link to={item.href}>
                          <item.icon className="h-4 w-4" />
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )}
                </div>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {userType === 'admin' && (
          <SidebarGroup className="mt-auto group-data-[collapsible=icon]:hidden">
            <SidebarSeparator className="mb-4" />
            <SidebarGroupLabel>System Overview</SidebarGroupLabel>
            <SidebarGroupContent>
              <div className="grid grid-cols-2 gap-2 p-2">
                <div className="bg-muted/50 rounded p-2 text-center">
                  <div className="text-lg font-bold text-primary">1.2K</div>
                  <div className="text-xs text-muted-foreground">Users</div>
                </div>
                <div className="bg-muted/50 rounded p-2 text-center">
                  <div className="text-lg font-bold text-primary">99.8%</div>
                  <div className="text-xs text-muted-foreground">Uptime</div>
                </div>
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
