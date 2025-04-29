
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { FileText, Calendar, User } from 'lucide-react';

const EstudianteDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Bienvenido, {user?.nombre}</h1>
          <p className="text-gray-600">Panel de estudiante - Accede rápidamente a tus datos académicos</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="bg-blue-50">
              <CardTitle className="text-blue-700">Mi Perfil</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="mb-4">Visualiza y actualiza tu información personal</p>
            </CardContent>
            <CardFooter>
              <Button asChild>
                <Link to={`/estudiantes/${user?.id}/perfil`}>
                  <User className="h-4 w-4 mr-2" />
                  Ver perfil
                </Link>
              </Button>
            </CardFooter>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="bg-green-50">
              <CardTitle className="text-green-700">Mis Calificaciones</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="mb-4">Consulta tus calificaciones por asignatura</p>
            </CardContent>
            <CardFooter>
              <Button asChild>
                <Link to={`/estudiantes/${user?.id}/calificaciones`}>
                  <FileText className="h-4 w-4 mr-2" />
                  Ver calificaciones
                </Link>
              </Button>
            </CardFooter>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="bg-amber-50">
              <CardTitle className="text-amber-700">Mi Asistencia</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="mb-4">Revisa tu historial de asistencia</p>
            </CardContent>
            <CardFooter>
              <Button asChild>
                <Link to={`/estudiantes/${user?.id}/asistencia`}>
                  <Calendar className="h-4 w-4 mr-2" />
                  Ver asistencia
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default EstudianteDashboard;
