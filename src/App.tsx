
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Index from "./pages/Index";
import Login from "./pages/Login";
import AccessDenied from "./pages/AccessDenied";
import NotFound from "./pages/NotFound";
import Asistencia from "./pages/Asistencia";
import Informes from "./pages/Informes";
import Calificaciones from "./pages/Calificaciones";
import LibroDeTema from "./pages/LibroDeTema";
import Aulas from "./pages/Aulas";
import Estudiantes from "./pages/Estudiantes";
import Docentes from "./pages/Docentes";
import Asignaturas from "./pages/Asignaturas";
import Configuracion from "./pages/Configuracion";
import AttendanceHistory from "./pages/attendance/AttendanceHistory";
import AttendanceDetails from "./pages/attendance/AttendanceDetails";
import EstudiantePerfil from "./pages/estudiantes/EstudiantePerfil";
import DocentePerfil from "./pages/docentes/DocentePerfil";
import EstudianteDashboard from "./pages/estudiante/Dashboard";
import DocenteDashboard from "./pages/docente/Dashboard";
import DirectivoDashboard from "./pages/directivo/Dashboard";
import AdminDashboard from "./pages/admin/Dashboard";
import UserManagement from "./pages/admin/users/UserManagement";
import UserForm from "./pages/admin/UserForm";
import Panol from "./pages/Panol";
import Auditoria from "./pages/Auditoria";
import PasswordRecovery from "./pages/PasswordRecovery";

const Home = () => {
  const { user, homePath } = useAuth();
  return user?.rol === "administrador" || user?.rol === "directivo" ? <Index /> : <Navigate to={homePath} replace />;
};

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <Routes>
            {/* Rutas públicas */}
            <Route path="/login" element={<Login />} />
            <Route path="/auth/callback" element={<Login />} />
            <Route path="/olvide-contrasena" element={<PasswordRecovery />} />
            <Route path="/reset-password" element={<PasswordRecovery reset />} />
            <Route path="/acceso-denegado" element={<AccessDenied />} />

            {/* Rutas de estudiante */}
            <Route 
              path="/estudiante/dashboard" 
              element={
                <ProtectedRoute allowedRoles={['estudiante']}>
                  <EstudianteDashboard />
                </ProtectedRoute>
              } 
            />

            {/* Rutas de docente */}
            <Route 
              path="/docente/dashboard" 
              element={
                <ProtectedRoute allowedRoles={['docente']}>
                  <DocenteDashboard />
                </ProtectedRoute>
              } 
            />

            {/* Rutas de directivo */}
            <Route 
              path="/directivo/dashboard" 
              element={
                <ProtectedRoute allowedRoles={['directivo']}>
                  <DirectivoDashboard />
                </ProtectedRoute>
              } 
            />

            {/* Rutas de administrador */}
            <Route 
              path="/admin/dashboard" 
              element={
                <ProtectedRoute allowedRoles={['administrador']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />

            {/* Rutas protegidas para administradores y directivos */}
            <Route 
              path="/" 
              element={
                <ProtectedRoute allowedRoles={['administrador', 'directivo', 'docente', 'estudiante', 'panolero']}>
                  <Home />
                </ProtectedRoute>
              } 
            />

            {/* Rutas de administración */}
            <Route 
              path="/estudiantes" 
              element={
                <ProtectedRoute allowedRoles={['administrador', 'directivo']}>
                  <Estudiantes />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/docentes" 
              element={
                <ProtectedRoute allowedRoles={['administrador', 'directivo']}>
                  <Docentes />
                </ProtectedRoute>
              } 
            />
            
            {/* Rutas de administración exclusivas para administradores */}
            <Route 
              path="/admin/usuarios" 
              element={
                <ProtectedRoute allowedRoles={['administrador']}>
                  <UserManagement />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/usuarios/nuevo" 
              element={
                <ProtectedRoute allowedRoles={['administrador']}>
                  <UserForm />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/usuarios/:id/editar" 
              element={
                <ProtectedRoute allowedRoles={['administrador']}>
                  <UserForm isEdit={true} />
                </ProtectedRoute>
              } 
            />

            {/* Configuración - Solo administradores */}
            <Route 
              path="/configuracion" 
              element={
                <ProtectedRoute allowedRoles={['administrador']}>
                  <Configuracion />
                </ProtectedRoute>
              } 
            />

            {/* Rutas para aulas y asignaturas (solo admin y directivos) */}
            <Route 
              path="/aulas" 
              element={
                <ProtectedRoute allowedRoles={['administrador', 'directivo']}>
                  <Aulas />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/asignaturas" 
              element={
                <ProtectedRoute allowedRoles={['administrador', 'directivo']}>
                  <Asignaturas />
                </ProtectedRoute>
              } 
            />

            {/* Rutas compartidas por varios roles */}
            <Route 
              path="/asistencia" 
              element={
                <ProtectedRoute allowedRoles={['administrador', 'directivo', 'docente']}>
                  <Asistencia />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/asistencia/historial" 
              element={
                <ProtectedRoute allowedRoles={['administrador', 'directivo', 'docente']}>
                  <AttendanceHistory />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/asistencia/detalle/:id" 
              element={
                <ProtectedRoute allowedRoles={['administrador', 'directivo', 'docente']}>
                  <AttendanceDetails />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/calificaciones" 
              element={
                <ProtectedRoute allowedRoles={['administrador', 'directivo', 'docente']}>
                  <Calificaciones />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/informes" 
              element={
                <ProtectedRoute allowedRoles={['administrador', 'directivo', 'docente']}>
                  <Informes />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/libro-de-tema" 
              element={
                <ProtectedRoute allowedRoles={['administrador', 'directivo', 'docente']}>
                  <LibroDeTema />
                </ProtectedRoute>
              } 
            />

            {/* Perfiles y detalles */}
            <Route 
              path="/estudiantes/:id/perfil" 
              element={
                <ProtectedRoute allowedRoles={['administrador', 'directivo', 'docente', 'estudiante']}>
                  <EstudiantePerfil />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/docentes/:id/perfil" 
              element={
                <ProtectedRoute allowedRoles={['administrador', 'directivo', 'docente']}>
                  <DocentePerfil />
                </ProtectedRoute>
              } 
            />

            <Route path="/panol" element={<ProtectedRoute allowedRoles={['administrador', 'directivo', 'panolero']}><Panol /></ProtectedRoute>} />
            <Route path="/auditoria" element={<ProtectedRoute allowedRoles={['administrador', 'directivo']}><Auditoria /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
