import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import About from "./pages/About";
import Gallery from "./pages/Gallery";
import Contact from "./pages/Contact";
import Admission from "./pages/Admission";
import StudentDashboard from "./pages/dashboards/StudentDashboard";
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
import StudentMessages from "./pages/dashboards/student/Messages";
import StudentSupport from "./pages/dashboards/student/Support";
import TeacherDashboard from "./pages/dashboards/TeacherDashboard";
import TeacherProfile from "./pages/dashboards/TeacherProfile";
import TeacherSubjects from "./pages/dashboards/TeacherSubjects";
import TeacherSubjectDetails from "./pages/dashboards/TeacherSubjectDetails";
import TeacherRecordSheet from "./pages/dashboards/TeacherRecordSheet";
import TeacherClasses from "./pages/dashboards/TeacherClasses";
import TeacherAssignments from "./pages/dashboards/TeacherAssignments";
import TeacherAttendance from "./pages/dashboards/TeacherAttendance";
import TeacherEvents from "./pages/dashboards/TeacherEvents";
import TeacherMessages from "./pages/dashboards/TeacherMessages";
import TeacherSupport from "./pages/dashboards/TeacherSupport";
import ParentDashboard from "./pages/dashboards/ParentDashboard";
import Profile from "./pages/dashboards/parent/Profile";
import Children from "./pages/dashboards/parent/Children";
import Payments from "./pages/dashboards/parent/Payments";
import Events from "./pages/dashboards/parent/Events";
import Messages from "./pages/dashboards/parent/Messages";
import Support from "./pages/dashboards/parent/Support";
import ExamsOfficerDashboard from "./pages/dashboards/ExamsOfficerDashboard";
import AdmissionOfficerDashboard from "./pages/dashboards/AdmissionOfficerDashboard";
import FinanceOfficerDashboard from "./pages/dashboards/FinanceOfficerDashboard";
import MediaOfficerDashboard from "./pages/dashboards/MediaOfficerDashboard";
import AdminDashboard from "./pages/dashboards/AdminDashboard";
import AdminProfile from "./pages/dashboards/AdminProfile";
import AdminUsers from "./pages/dashboards/AdminUsers";
import AdminAcademics from "./pages/dashboards/AdminAcademics";
import AdminFinance from "./pages/dashboards/AdminFinance";
import AdminEvents from "./pages/dashboards/AdminEvents";
import AdminMessages from "./pages/dashboards/AdminMessages";
import AdminSupport from "./pages/dashboards/AdminSupport";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
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
            <Route path="/dashboard/teacher" element={<ProtectedRoute allowedRoles={['teacher']}><TeacherDashboard /></ProtectedRoute>} />
            <Route path="/dashboard/teacher/profile" element={<ProtectedRoute allowedRoles={['teacher']}><TeacherProfile /></ProtectedRoute>} />
            <Route path="/dashboard/teacher/subjects" element={<ProtectedRoute allowedRoles={['teacher']}><TeacherSubjects /></ProtectedRoute>} />
            <Route path="/dashboard/teacher/subjects/:subject" element={<ProtectedRoute allowedRoles={['teacher']}><TeacherSubjectDetails /></ProtectedRoute>} />
            <Route path="/dashboard/teacher/classes" element={<ProtectedRoute allowedRoles={['teacher']}><TeacherClasses /></ProtectedRoute>} />
            <Route path="/dashboard/teacher/assignments" element={<ProtectedRoute allowedRoles={['teacher']}><TeacherAssignments /></ProtectedRoute>} />
            <Route path="/dashboard/teacher/attendance" element={<ProtectedRoute allowedRoles={['teacher']}><TeacherAttendance /></ProtectedRoute>} />
            <Route path="/dashboard/teacher/record-sheet" element={<ProtectedRoute allowedRoles={['teacher']}><TeacherRecordSheet /></ProtectedRoute>} />
            <Route path="/dashboard/teacher/events" element={<ProtectedRoute allowedRoles={['teacher']}><TeacherEvents /></ProtectedRoute>} />
            <Route path="/dashboard/teacher/messages" element={<ProtectedRoute allowedRoles={['teacher']}><TeacherMessages /></ProtectedRoute>} />
            <Route path="/dashboard/teacher/support" element={<ProtectedRoute allowedRoles={['teacher']}><TeacherSupport /></ProtectedRoute>} />
            <Route path="/dashboard/parent" element={<ParentDashboard />} />
            <Route path="/dashboard/parent/profile" element={<Profile />} />
            <Route path="/dashboard/parent/children" element={<Children />} />
            <Route path="/dashboard/parent/payments" element={<Payments />} />
            <Route path="/dashboard/parent/events" element={<Events />} />
            <Route path="/dashboard/parent/messages" element={<Messages />} />
            <Route path="/dashboard/parent/support" element={<Support />} />
            <Route path="/dashboard/exams-officer" element={<ExamsOfficerDashboard />} />
            <Route path="/dashboard/admission-officer" element={<AdmissionOfficerDashboard />} />
            <Route path="/dashboard/finance-officer" element={<FinanceOfficerDashboard />} />
            <Route path="/dashboard/media-officer" element={<MediaOfficerDashboard />} />
            <Route path="/dashboard/admin" element={<AdminDashboard />} />
            <Route path="/dashboard/admin/profile" element={<AdminProfile />} />
            <Route path="/dashboard/admin/users" element={<AdminUsers />} />
            <Route path="/dashboard/admin/academics" element={<AdminAcademics />} />
            <Route path="/dashboard/admin/finance" element={<AdminFinance />} />
            <Route path="/dashboard/admin/events" element={<AdminEvents />} />
            <Route path="/dashboard/admin/messages" element={<AdminMessages />} />
            <Route path="/dashboard/admin/support" element={<AdminSupport />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
