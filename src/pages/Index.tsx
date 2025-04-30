
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  UserIcon, 
  GraduationCap, 
  Users, 
  BookOpen, 
  Calendar, 
  FileText, 
  Bell,
  LayoutDashboard,
  BookUser,
  User,
  Settings
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Index = () => {
  const { hasRole } = useAuth();
  const isAdmin = hasRole('administrador');

  const menuItems = [
    {
      title: "Estudiantes",
      icon: <GraduationCap className="h-6 w-6" />,
      description: "Gestión de estudiantes",
      link: "/estudiantes",
      color: "bg-blue-500"
    },
    {
      title: "Docentes",
      icon: <Users className="h-6 w-6" />,
      description: "Gestión de docentes",
      link: "/docentes",
      color: "bg-purple-500"
    },
    {
      title: "Asignaturas",
      icon: <BookOpen className="h-6 w-6" />,
      description: "Gestión de asignaturas",
      link: "/asignaturas",
      color: "bg-green-500"
    },
    {
      title: "Asistencia",
      icon: <Calendar className="h-6 w-6" />,
      description: "Control de asistencia",
      link: "/asistencia",
      color: "bg-amber-500"
    },
    {
      title: "Calificaciones",
      icon: <FileText className="h-6 w-6" />,
      description: "Gestión de calificaciones",
      link: "/calificaciones",
      color: "bg-red-500"
    },
    {
      title: "Informes",
      icon: <Bell className="h-6 w-6" />,
      description: "Informes pedagógicos",
      link: "/informes",
      color: "bg-indigo-500"
    },
    {
      title: "Libro de Tema",
      icon: <BookUser className="h-6 w-6" />,
      description: "Registro de clases",
      link: "/libro-de-tema",
      color: "bg-teal-500"
    }
  ];

  // Módulos exclusivos para administradores
  const adminModules = [
    {
      title: "Gestión de Usuarios",
      icon: <User className="h-6 w-6" />,
      description: "Administración de todos los usuarios",
      link: "/admin/usuarios",
      color: "bg-orange-500"
    },
    {
      title: "Configuración",
      icon: <Settings className="h-6 w-6" />,
      description: "Configuración del sistema",
      link: "/configuracion",
      color: "bg-gray-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-2">Panel de Control</h1>
        <p className="text-gray-500 mb-8">Bienvenido al Sistema de Gestión Escolar</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item, index) => (
            <Link to={item.link} key={index}>
              <Card className="hover:shadow-md transition-shadow duration-200 h-full">
                <CardContent className="p-6 flex items-start space-x-4">
                  <div className={`${item.color} text-white p-3 rounded-lg`}>
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">{item.title}</h3>
                    <p className="text-gray-500 text-sm">{item.description}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}

          {/* Módulos exclusivos para administradores */}
          {isAdmin && adminModules.map((item, index) => (
            <Link to={item.link} key={`admin-${index}`}>
              <Card className="hover:shadow-md transition-shadow duration-200 h-full border-orange-200">
                <CardContent className="p-6 flex items-start space-x-4">
                  <div className={`${item.color} text-white p-3 rounded-lg`}>
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">{item.title}</h3>
                    <p className="text-gray-500 text-sm">{item.description}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
