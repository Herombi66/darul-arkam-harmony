import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import About from "./pages/About";
import Gallery from "./pages/Gallery";
import Contact from "./pages/Contact";
import Admission from "./pages/dashboards/admin/Admission";
import StudentDashboard from "./pages/dashboards/student/StudentDashboard";
import StudentProfile from "./pages/dashboards/student/StudentProfile";
import StudentAcademics from "./pages/dashboards/student/StudentAcademics";
import StudentSubjects from "./pages/dashboards/student/StudentSubjects";
import StudentAssignments from "./pages/dashboards/student/StudentAssignments";
import StudentResults from "./pages/dashboards/student/StudentResults";
import PaySchoolFees from "./pages/dashboards/student/PaySchoolFees";
import PaymentHistory from "./pages/dashboards/student/PaymentHistory";
import AttendanceRecords from "./pages/dashboards/student/AttendanceRecords";
import RequestLeave from "./pages/dashboards/student/RequestLeave";
import StudentEvents from "./pages/dashboards/student/Events";
import StudentMessages from "./pages/dashboards/student/StudentMessages";
import StudentSupport from "./pages/dashboards/student/Support";
import TeacherDashboard from "./pages/dashboards/teacher/TeacherDashboard";
import TeacherProfile from "./pages/dashboards/teacher/TeacherProfile";
import TeacherSubjects from "./pages/dashboards/teacher/TeacherSubjects";
import TeacherSubjectDetails from "./pages/dashboards/teacher/TeacherSubjectDetails";
import TeacherRecordSheet from "./pages/dashboards/teacher/TeacherRecordSheet";
import TeacherClasses from "./pages/dashboards/teacher/TeacherClasses";
import TeacherAssignments from "./pages/dashboards/teacher/TeacherAssignments";
import TeacherAttendance from "./pages/dashboards/teacher/TeacherAttendance";
import TeacherEvents from "./pages/dashboards/teacher/TeacherEvents";
import TeacherMessages from "./pages/dashboards/teacher/TeacherMessages";
import TeacherSupport from "./pages/dashboards/teacher/TeacherSupport";
import ParentDashboard from "./pages/dashboards/parent/ParentDashboard";
import Profile from "./pages/dashboards/parent/Profile";
import Children from "./pages/dashboards/parent/Children";
import Payments from "./pages/dashboards/parent/Payments";
import Events from "./pages/dashboards/parent/Events";
import Messages from "./pages/dashboards/parent/Messages";
import Support from "./pages/dashboards/parent/Support";
import ExamsOfficerDashboard from "./pages/dashboards/examOffice/ExamsOfficerDashboard";
import AdmissionOfficerDashboard from "./pages/dashboards/admission/AdmissionOfficerDashboard";
import AdmissionDashboard from "./pages/dashboards/admission/AdmissionDashboard";
import AdmissionApplications from "./pages/dashboards/admission/Applications";
import AdmissionEnrollment from "./pages/dashboards/admission/Enrollment";
import AdmissionEvents from "./pages/dashboards/admission/Events";
import AdmissionMessages from "./pages/dashboards/admission/Messages";
import AdmissionProfile from "./pages/dashboards/admission/Profile";
import AdmissionSupport from "./pages/dashboards/admission/Support";
import FinanceOfficerDashboard from "./pages/dashboards/finance/FinanceOfficerDashboard";
import MediaOfficerDashboard from "./pages/dashboards/MediaOfficerDashboard";
import AdminDashboard from "./pages/dashboards/admin/AdminDashboard";
import AdminProfile from "./pages/dashboards/admin/AdminProfile";
import AdminUsers from "./pages/dashboards/admin/AdminUsers";
import AdminAcademics from "./pages/dashboards/admin/AdminAcademics";
import AdminFinance from "./pages/dashboards/admin/AdminFinance";
import AdminEvents from "./pages/dashboards/admin/AdminEvents";
import AdminMessages from "./pages/dashboards/admin/AdminMessages";
import AdminSupport from "./pages/dashboards/admin/AdminSupport";
import NotFound from "./pages/NotFound";
import { useEffect } from "react";
import { io } from "socket.io-client";
import { useToast } from "@/hooks/use-toast";
import { ThemeProvider } from "next-themes";
import NetworkGate from "@/components/NetworkGate";
import ErrorBoundary from "@/components/ErrorBoundary";
import AdminLayout from "./layouts/AdminLayout";
import DashboardLayout from "./layouts/DashboardLayout";

const queryClient = new QueryClient();

const SocketInitializer: React.FC = () => {
  const { toast } = useToast();
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    const socket = io(import.meta.env.VITE_BACKEND_URL || "http://localhost:5001", {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });

    socket.on("connect", () => {
      console.log("Socket connected", socket.id);
      if (isAuthenticated && user?.id) {
        socket.emit("joinUser", user.id);
      }
    });

    socket.on("notification", (payload: { type: string; message: string; timestamp: string }) => {
      toast({
        title: payload.type === "system" ? "System" : "Notification",
        description: payload.message,
      });
    });

    socket.on("message", (payload: { threadId: string; message: any }) => {
      toast({ title: "New Message", description: payload.message?.content || "You have a new message" });
      try { socket.emit("message:ack", { messageId: payload?.message?.id }); } catch {}
    });

    socket.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason);
    });

    return () => {
      socket.disconnect();
    };
  }, [toast, isAuthenticated, user?.id]);

  return null;
};

const App = () => {
  const DevThrow: React.FC = () => { throw new Error('Test render error') };
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <ErrorBoundary>
              <NetworkGate>
                <BrowserRouter>
                  <SocketInitializer />
                  <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/about" element={<About />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/admission" element={<Admission />} />
                <Route path="/dashboard/student" element={<DashboardLayout userType="student" />}>
                  <Route index element={<StudentDashboard />} />
                  <Route path="profile" element={<StudentProfile />} />
                  <Route path="academics" element={<StudentAcademics />} />
                  <Route path="academics/subjects" element={<StudentSubjects />} />
                  <Route path="academics/assignments" element={<StudentAssignments />} />
                  <Route path="academics/results" element={<StudentResults />} />
                  <Route path="payments/pay" element={<PaySchoolFees />} />
                  <Route path="payments/history" element={<PaymentHistory />} />
                  <Route path="attendance/records" element={<AttendanceRecords />} />
                  <Route path="attendance/request-leave" element={<RequestLeave />} />
                  <Route path="events" element={<StudentEvents />} />
                  <Route path="messages" element={<StudentMessages />} />
                  <Route path="support" element={<StudentSupport />} />
                </Route>
                <Route path="/dashboard/teacher" element={<ProtectedRoute allowedRoles={["teacher"]}><DashboardLayout userType="teacher" /></ProtectedRoute>}>
                  <Route index element={<TeacherDashboard />} />
                  <Route path="profile" element={<TeacherProfile />} />
                  <Route path="subjects" element={<TeacherSubjects />} />
                  <Route path="subjects/:subject" element={<TeacherSubjectDetails />} />
                  <Route path="classes" element={<TeacherClasses />} />
                  <Route path="assignments" element={<TeacherAssignments />} />
                  <Route path="attendance" element={<TeacherAttendance />} />
                  <Route path="record-sheet" element={<TeacherRecordSheet />} />
                  <Route path="events" element={<TeacherEvents />} />
                  <Route path="messages" element={<TeacherMessages />} />
                  <Route path="support" element={<TeacherSupport />} />
                </Route>
                <Route path="/dashboard/parent" element={<DashboardLayout userType="parent" />}>
                  <Route index element={<ParentDashboard />} />
                  <Route path="profile" element={<Profile />} />
                  <Route path="children" element={<Children />} />
                  <Route path="payments" element={<Payments />} />
                  <Route path="events" element={<Events />} />
                  <Route path="messages" element={<Messages />} />
                  <Route path="support" element={<Support />} />
                </Route>
                <Route path="/dashboard/exams-officer" element={<DashboardLayout userType="exams-officer" />}>
                  <Route index element={<ExamsOfficerDashboard />} />
                </Route>
                <Route path="/dashboard/admission-officer" element={<DashboardLayout userType="admission-officer" />}>
                  <Route index element={<AdmissionOfficerDashboard />} />
                </Route>
                <Route path="/dashboard/admission" element={<DashboardLayout userType="admission" />}>
                  <Route index element={<AdmissionDashboard />} />
                  <Route path="profile" element={<AdmissionProfile />} />
                  <Route path="applications" element={<AdmissionApplications />} />
                  <Route path="enrollment" element={<AdmissionEnrollment />} />
                  <Route path="events" element={<AdmissionEvents />} />
                  <Route path="messages" element={<AdmissionMessages />} />
                  <Route path="support" element={<AdmissionSupport />} />
                </Route>
                <Route path="/dashboard/finance-officer" element={<DashboardLayout userType="finance-officer" />}>
                  <Route index element={<FinanceOfficerDashboard />} />
                </Route>
                <Route path="/dashboard/media-officer" element={<DashboardLayout userType="media-officer" />}>
                  <Route index element={<MediaOfficerDashboard />} />
                </Route>
                <Route path="/dashboard/admin" element={<DashboardLayout userType="admin" />}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="profile" element={<AdminProfile />} />
                  <Route path="users" element={<AdminUsers />} />
                  <Route path="academics" element={<AdminAcademics />} />
                  <Route path="finance" element={<AdminFinance />} />
                  <Route path="events" element={<AdminEvents />} />
                  <Route path="messages" element={<AdminMessages />} />
                  <Route path="support" element={<AdminSupport />} />
                </Route>
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
                  </Routes>
                  <Routes>
                    <Route path="/__throw" element={<DevThrow />} />
                  </Routes>
                </BrowserRouter>
              </NetworkGate>
            </ErrorBoundary>
          </TooltipProvider>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;