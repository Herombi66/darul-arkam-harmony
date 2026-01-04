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
                <Route path="/dashboard/student" element={<StudentDashboard />} />
                <Route path="/dashboard/student/profile" element={<StudentProfile />} />
                <Route path="/dashboard/student/academics" element={<StudentAcademics />} />
                <Route path="/dashboard/student/academics/subjects" element={<StudentSubjects />} />
                <Route path="/dashboard/student/academics/assignments" element={<StudentAssignments />} />
                <Route path="/dashboard/student/academics/results" element={<StudentResults />} />
                <Route path="/dashboard/student/payments/pay" element={<PaySchoolFees />} />
                <Route path="/dashboard/student/payments/history" element={<PaymentHistory />} />
                <Route path="/dashboard/student/attendance/records" element={<AttendanceRecords />} />
                <Route path="/dashboard/student/attendance/request-leave" element={<RequestLeave />} />
                <Route path="/dashboard/student/events" element={<StudentEvents />} />
                <Route path="/dashboard/student/messages" element={<StudentMessages />} />
                <Route path="/dashboard/student/support" element={<StudentSupport />} />
                <Route path="/dashboard/teacher" element={<ProtectedRoute allowedRoles={["teacher"]}><TeacherDashboard /></ProtectedRoute>} />
                <Route path="/dashboard/teacher/profile" element={<ProtectedRoute allowedRoles={["teacher"]}><TeacherProfile /></ProtectedRoute>} />
                <Route path="/dashboard/teacher/subjects" element={<ProtectedRoute allowedRoles={["teacher"]}><TeacherSubjects /></ProtectedRoute>} />
                <Route path="/dashboard/teacher/subjects/:subject" element={<ProtectedRoute allowedRoles={["teacher"]}><TeacherSubjectDetails /></ProtectedRoute>} />
                <Route path="/dashboard/teacher/classes" element={<ProtectedRoute allowedRoles={["teacher"]}><TeacherClasses /></ProtectedRoute>} />
                <Route path="/dashboard/teacher/assignments" element={<ProtectedRoute allowedRoles={["teacher"]}><TeacherAssignments /></ProtectedRoute>} />
                <Route path="/dashboard/teacher/attendance" element={<ProtectedRoute allowedRoles={["teacher"]}><TeacherAttendance /></ProtectedRoute>} />
                <Route path="/dashboard/teacher/record-sheet" element={<ProtectedRoute allowedRoles={["teacher"]}><TeacherRecordSheet /></ProtectedRoute>} />
                <Route path="/dashboard/teacher/events" element={<ProtectedRoute allowedRoles={["teacher"]}><TeacherEvents /></ProtectedRoute>} />
                <Route path="/dashboard/teacher/messages" element={<ProtectedRoute allowedRoles={["teacher"]}><TeacherMessages /></ProtectedRoute>} />
                <Route path="/dashboard/teacher/support" element={<ProtectedRoute allowedRoles={["teacher"]}><TeacherSupport /></ProtectedRoute>} />
                <Route path="/dashboard/parent" element={<ParentDashboard />} />
                <Route path="/dashboard/parent/profile" element={<Profile />} />
                <Route path="/dashboard/parent/children" element={<Children />} />
                <Route path="/dashboard/parent/payments" element={<Payments />} />
                <Route path="/dashboard/parent/events" element={<Events />} />
                <Route path="/dashboard/parent/messages" element={<Messages />} />
                <Route path="/dashboard/parent/support" element={<Support />} />
                <Route path="/dashboard/exams-officer" element={<ExamsOfficerDashboard />} />
                <Route path="/dashboard/admission-officer" element={<AdmissionOfficerDashboard />} />
                <Route path="/dashboard/admission" element={<AdmissionDashboard />} />
                <Route path="/dashboard/admission/profile" element={<AdmissionProfile />} />
                <Route path="/dashboard/admission/applications" element={<AdmissionApplications />} />
                <Route path="/dashboard/admission/enrollment" element={<AdmissionEnrollment />} />
                <Route path="/dashboard/admission/events" element={<AdmissionEvents />} />
                <Route path="/dashboard/admission/messages" element={<AdmissionMessages />} />
                <Route path="/dashboard/admission/support" element={<AdmissionSupport />} />
                <Route path="/dashboard/finance-officer" element={<FinanceOfficerDashboard />} />
                <Route path="/dashboard/media-officer" element={<MediaOfficerDashboard />} />
                <Route path="/dashboard/admin" element={<AdminLayout />}>
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