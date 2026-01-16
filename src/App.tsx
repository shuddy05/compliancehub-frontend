import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { SupportChat } from "@/components/SupportChat";
import Landing from "./pages/Landing";
import Pricing from "./pages/Pricing";
import Demo from "./pages/Demo";
import Welcome from "./pages/Welcome";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import VerifyEmail from "./pages/VerifyEmail";
import VerifyEmailSent from "./pages/VerifyEmailSent";
import ResendVerification from "./pages/ResendVerification";
import ForgotPassword from "./pages/ForgotPassword";
import RoleSelection from "./pages/RoleSelection";
import CompanySetup from "./pages/CompanySetup";
import PlanSelection from "./pages/PlanSelection";
import OnboardingComplete from "./pages/OnboardingComplete";
import Dashboard from "./pages/Dashboard";
import Notifications from "./pages/Notifications";
import SettingsHub from "./pages/SettingsHub";
import ComplianceHome from "./pages/ComplianceHome";
import EmployeeList from "./pages/EmployeeList";
import AddEmployee from "./pages/AddEmployee";
import EmployeeDetail from "./pages/EmployeeDetail";
import EditEmployee from "./pages/EditEmployee";
import BulkImportEmployees from "./pages/BulkImportEmployees";
import EmployeeSelfService from "./pages/EmployeeSelfService";
import PayrollHome from "./pages/PayrollHome";
import RunPayrollConfig from "./pages/RunPayrollConfig";
import RunPayrollReview from "./pages/RunPayrollReview";
import RunPayrollApproval from "./pages/RunPayrollApproval";
import RunPayrollPayment from "./pages/RunPayrollPayment";
import PayslipView from "./pages/PayslipView";
import PayrollReports from "./pages/PayrollReports";
import ComplianceCalendar from "./pages/ComplianceCalendar";
import ObligationDetail from "./pages/ObligationDetail";
import FileCompliance from "./pages/FileCompliance";
import ManualFiling from "./pages/ManualFiling";
import UploadReceipt from "./pages/UploadReceipt";
import ComplianceReports from "./pages/ComplianceReports";
import PenaltiesOverdue from "./pages/PenaltiesOverdue";
import TaxReliefClaims from "./pages/TaxReliefClaims";
import DocumentsLibrary from "./pages/DocumentsLibrary";
import UploadDocument from "./pages/UploadDocument";
import DocumentViewer from "./pages/DocumentViewer";
import LearningHub from "./pages/LearningHub";
import ContentDetail from "./pages/ContentDetail";
import HelpCenter from "./pages/HelpCenter";
import ContactSupport from "./pages/ContactSupport";
import SubscriptionOverview from "./pages/SubscriptionOverview";
import ChangePlan from "./pages/ChangePlan";
import PaymentMethod from "./pages/PaymentMethod";
import InvoiceDetail from "./pages/InvoiceDetail";
import SecuritySettings from "./pages/SecuritySettings";
import UserManagement from "./pages/UserManagement";
import CompanyManagement from "./pages/CompanyManagement";
import CompanyDetails from "./pages/CompanyDetails";
import AddCompany from "./pages/AddCompany";
import SupportTickets from "./pages/SupportTickets";

import ManageTickets from "./pages/SupportTickets/ManageTickets";
import MyTickets from "./pages/MyTickets";
import EditProfile from "./pages/EditProfile";
import Checkout from "./pages/Checkout";
import PaymentSuccess from "./pages/PaymentSuccess";
import About from "./pages/About";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/demo" element={<Demo />} />
              <Route path="/about" element={<About />} />
              <Route path="/welcome" element={<Welcome />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/verify-email" element={<VerifyEmail />} />
              <Route path="/verify-email-sent" element={<VerifyEmailSent />} />
              <Route path="/resend-verification" element={<ResendVerification />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              
              {/* Onboarding routes - protected but available to all authenticated users */}
              <Route path="/role-selection" element={
                <ProtectedRoute>
                  <RoleSelection />
                </ProtectedRoute>
              } />
              <Route path="/company-setup" element={
                <ProtectedRoute>
                  <CompanySetup />
                </ProtectedRoute>
              } />
              <Route path="/plan-selection" element={
                <ProtectedRoute>
                  <PlanSelection />
                </ProtectedRoute>
              } />
              <Route path="/checkout" element={
                <ProtectedRoute>
                  <Checkout />
                </ProtectedRoute>
              } />
              <Route path="/onboarding-complete" element={
                <ProtectedRoute>
                  <OnboardingComplete />
                </ProtectedRoute>
              } />
              <Route path="/payment-success" element={
                <ProtectedRoute>
                  <PaymentSuccess />
                </ProtectedRoute>
              } />
              <Route path="/subscriptions/complete" element={
                <ProtectedRoute>
                  <PaymentSuccess />
                </ProtectedRoute>
              } />
              
              {/* Core Dashboard - protected but available to all authenticated users */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/notifications" element={
                <ProtectedRoute>
                  <Notifications />
                </ProtectedRoute>
              } />
              <Route path="/my-tickets" element={
                <ProtectedRoute>
                  <MyTickets />
                </ProtectedRoute>
              } />
              <Route path="/settings" element={
                <ProtectedRoute>
                  <SettingsHub />
                </ProtectedRoute>
              } />
              <Route path="/settings/security" element={
                <ProtectedRoute>
                  <SecuritySettings />
                </ProtectedRoute>
              } />
              <Route path="/settings/subscription" element={
                <ProtectedRoute>
                  <SubscriptionOverview />
                </ProtectedRoute>
              } />
              <Route path="/settings/subscription/plans" element={
                <ProtectedRoute>
                  <ChangePlan />
                </ProtectedRoute>
              } />
              <Route path="/settings/subscription/payment" element={
                <ProtectedRoute>
                  <PaymentMethod />
                </ProtectedRoute>
              } />
              <Route path="/settings/subscription/invoices/:id" element={
                <ProtectedRoute>
                  <InvoiceDetail />
                </ProtectedRoute>
              } />
              
              {/* Super Admin Routes */}
              <Route path="/companies" element={
                <ProtectedRoute allowedRoles={["super_admin"]}>
                  <CompanyManagement />
                </ProtectedRoute>
              } />
              <Route path="/companies/add" element={
                <ProtectedRoute allowedRoles={["super_admin"]}>
                  <AddCompany />
                </ProtectedRoute>
              } />
              <Route path="/companies/:id" element={
                <ProtectedRoute allowedRoles={["super_admin"]}>
                  <CompanyDetails />
                </ProtectedRoute>
              } />
              <Route path="/support" element={
                <ProtectedRoute allowedRoles={["super_admin"]}>
                  <SupportTickets />
                </ProtectedRoute>
              } />
              <Route path="/support/manage-tickets" element={
                <ProtectedRoute allowedRoles={["super_admin"]}>
                  <ManageTickets />
                </ProtectedRoute>
              } />
              
              {/* Company Admin Routes */}
              <Route path="/user-management" element={
                <ProtectedRoute allowedRoles={["super_admin", "company_admin"]}>
                  <UserManagement />
                </ProtectedRoute>
              } />
              
              {/* Employee Management - Company Admin & Accountant */}
              <Route path="/employees" element={
                <ProtectedRoute allowedRoles={["super_admin", "company_admin", "accountant"]}>
                  <EmployeeList />
                </ProtectedRoute>
              } />
              <Route path="/employees/add" element={
                <ProtectedRoute allowedRoles={["super_admin", "company_admin", "accountant"]}>
                  <AddEmployee />
                </ProtectedRoute>
              } />
              <Route path="/employees/import" element={
                <ProtectedRoute allowedRoles={["super_admin", "company_admin", "accountant"]}>
                  <BulkImportEmployees />
                </ProtectedRoute>
              } />
              <Route path="/employees/:id" element={
                <ProtectedRoute allowedRoles={["super_admin", "company_admin", "accountant", "staff", "read_only"]}>
                  <EmployeeDetail />
                </ProtectedRoute>
              } />
              <Route path="/employees/:id/edit" element={
                <ProtectedRoute allowedRoles={["super_admin", "company_admin", "accountant"]}>
                  <EditEmployee />
                </ProtectedRoute>
              } />
              <Route path="/self-service" element={
                <ProtectedRoute allowedRoles={["super_admin", "company_admin", "accountant", "staff", "read_only"]}>
                  <EmployeeSelfService />
                </ProtectedRoute>
              } />
              
              {/* Payroll Module - Company Admin, Accountant, and above */}
              <Route path="/payroll" element={
                <ProtectedRoute allowedRoles={["super_admin", "company_admin", "accountant"]}>
                  <PayrollHome />
                </ProtectedRoute>
              } />
              <Route path="/payroll/run" element={
                <ProtectedRoute allowedRoles={["super_admin", "company_admin", "accountant"]}>
                  <RunPayrollConfig />
                </ProtectedRoute>
              } />
              <Route path="/payroll/run/review" element={
                <ProtectedRoute allowedRoles={["super_admin", "company_admin", "accountant"]}>
                  <RunPayrollReview />
                </ProtectedRoute>
              } />
              <Route path="/payroll/run/approval" element={
                <ProtectedRoute allowedRoles={["super_admin", "company_admin"]}>
                  <RunPayrollApproval />
                </ProtectedRoute>
              } />
              <Route path="/payroll/run/payment" element={
                <ProtectedRoute allowedRoles={["super_admin", "company_admin", "accountant"]}>
                  <RunPayrollPayment />
                </ProtectedRoute>
              } />
              <Route path="/payroll/:id/payslip" element={
                <ProtectedRoute allowedRoles={["super_admin", "company_admin", "accountant", "staff", "read_only"]}>
                  <PayslipView />
                </ProtectedRoute>
              } />
              <Route path="/payroll/reports" element={
                <ProtectedRoute allowedRoles={["super_admin", "company_admin", "accountant"]}>
                  <PayrollReports />
                </ProtectedRoute>
              } />
              
              {/* Compliance Module - Company Admin, Accountant, and above */}
              <Route path="/compliance" element={
                <ProtectedRoute allowedRoles={["super_admin", "company_admin", "accountant"]}>
                  <ComplianceHome />
                </ProtectedRoute>
              } />
              <Route path="/compliance/calendar" element={
                <ProtectedRoute allowedRoles={["super_admin", "company_admin", "accountant", "staff", "read_only"]}>
                  <ComplianceCalendar />
                </ProtectedRoute>
              } />
              <Route path="/compliance/:type/:period" element={
                <ProtectedRoute allowedRoles={["super_admin", "company_admin", "accountant", "staff", "read_only"]}>
                  <ObligationDetail />
                </ProtectedRoute>
              } />
              <Route path="/compliance/file/:type/:period" element={
                <ProtectedRoute allowedRoles={["super_admin", "company_admin", "accountant"]}>
                  <FileCompliance />
                </ProtectedRoute>
              } />
              <Route path="/compliance/manual/:type/:period" element={
                <ProtectedRoute allowedRoles={["super_admin", "company_admin", "accountant"]}>
                  <ManualFiling />
                </ProtectedRoute>
              } />
              <Route path="/compliance/upload-receipt/:type/:period" element={
                <ProtectedRoute allowedRoles={["super_admin", "company_admin", "accountant"]}>
                  <UploadReceipt />
                </ProtectedRoute>
              } />
              <Route path="/compliance/reports" element={
                <ProtectedRoute allowedRoles={["super_admin", "company_admin", "accountant"]}>
                  <ComplianceReports />
                </ProtectedRoute>
              } />
              <Route path="/compliance/penalties" element={
                <ProtectedRoute allowedRoles={["super_admin", "company_admin", "accountant", "read_only"]}>
                  <PenaltiesOverdue />
                </ProtectedRoute>
              } />
              <Route path="/compliance/tax-relief" element={
                <ProtectedRoute allowedRoles={["super_admin", "company_admin", "accountant"]}>
                  <TaxReliefClaims />
                </ProtectedRoute>
              } />
              
              {/* Document Management - Company Admin, Accountant, and above */}
              <Route path="/documents" element={
                <ProtectedRoute allowedRoles={["super_admin", "company_admin", "accountant", "staff", "read_only"]}>
                  <DocumentsLibrary />
                </ProtectedRoute>
              } />
              <Route path="/documents/upload" element={
                <ProtectedRoute allowedRoles={["super_admin", "company_admin", "accountant"]}>
                  <UploadDocument />
                </ProtectedRoute>
              } />
              <Route path="/documents/:id" element={
                <ProtectedRoute allowedRoles={["super_admin", "company_admin", "accountant", "staff", "read_only"]}>
                  <DocumentViewer />
                </ProtectedRoute>
              } />
              
              {/* Learning & Support - Available to all authenticated users */}
              <Route path="/learning" element={
                <ProtectedRoute>
                  <LearningHub />
                </ProtectedRoute>
              } />
              <Route path="/learning/:id" element={
                <ProtectedRoute>
                  <ContentDetail />
                </ProtectedRoute>
              } />
              <Route path="/learning/help-centre" element={
                <ProtectedRoute>
                  <HelpCenter />
                </ProtectedRoute>
              } />
              <Route path="/learning/contact-support" element={
                <ProtectedRoute>
                  <ContactSupport />
                </ProtectedRoute>
              } />
              <Route path="/help" element={
                <ProtectedRoute>
                  <HelpCenter />
                </ProtectedRoute>
              } />
              <Route path="/support/contact" element={
                <ProtectedRoute>
                  <ContactSupport />
                </ProtectedRoute>
              } />
              <Route path="/settings/profile" element={
                <ProtectedRoute>
                  <EditProfile />
                </ProtectedRoute>
              } />
              
              {/* 404 - Keep last */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <SupportChat />
        </BrowserRouter>
      </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
