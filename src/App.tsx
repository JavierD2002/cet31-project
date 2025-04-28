import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Asistencia from "./pages/Asistencia";
import Informes from "./pages/Informes";
import Calificaciones from "./pages/Calificaciones";
import LibroDeTema from "./pages/LibroDeTema";
import Aulas from "./pages/Aulas";
import Estudiantes from "./pages/Estudiantes";
import Docentes from "./pages/Docentes";
import Asignaturas from "./pages/Asignaturas";
import AttendanceHistory from "./pages/attendance/AttendanceHistory";
import AttendanceDetails from "./pages/attendance/AttendanceDetails";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/asistencia" element={<Asistencia />} />
          <Route path="/asistencia/historial" element={<AttendanceHistory />} />
          <Route path="/asistencia/detalle/:id" element={<AttendanceDetails />} />
          <Route path="/informes" element={<Informes />} />
          <Route path="/calificaciones" element={<Calificaciones />} />
          <Route path="/libro-de-tema" element={<LibroDeTema />} />
          <Route path="/aulas" element={<Aulas />} />
          <Route path="/estudiantes" element={<Estudiantes />} />
          <Route path="/docentes" element={<Docentes />} />
          <Route path="/asignaturas" element={<Asignaturas />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
