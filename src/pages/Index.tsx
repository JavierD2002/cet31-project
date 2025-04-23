import { Link } from 'react-router-dom';
import { Book, Calendar, GraduationCap, Home, Users, FileText, BookText } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
const Index = () => {
  return <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Sistema de Gestión Escolar - CET31</h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm">Admin</span>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto">
          <NavigationMenu className="py-2 bg-lime-300 rounded-md">
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link to="/">
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    <Home className="h-4 w-4 mr-2" />
                    Inicio
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>
                  <Users className="h-4 w-4 mr-2" />
                  Alumnos
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    <li>
                      <NavigationMenuLink asChild>
                        <Link to="/alumnos" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          <div className="text-sm font-medium leading-none">Listado</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Ver todos los alumnos registrados
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link to="/alumnos/nuevo" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          <div className="text-sm font-medium leading-none">Nuevo alumno</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Registrar un nuevo alumno
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>
                  <Calendar className="h-4 w-4 mr-2" />
                  Asistencia
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    <li>
                      <NavigationMenuLink asChild>
                        <Link to="/asistencia" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          <div className="text-sm font-medium leading-none">Registro diario</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Tomar asistencia del día
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link to="/asistencia/historial" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          <div className="text-sm font-medium leading-none">Historial</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Ver registro histórico de asistencias
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>
                  <FileText className="h-4 w-4 mr-2" />
                  Informes
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    <li>
                      <NavigationMenuLink asChild>
                        <Link to="/informes" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          <div className="text-sm font-medium leading-none">Informes Pedagógicos</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Gestionar informes de alumnos
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link to="/informes/nuevo" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          <div className="text-sm font-medium leading-none">Nuevo informe</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Crear un nuevo informe
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>
                  <GraduationCap className="h-4 w-4 mr-2" />
                  Calificaciones
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    <li>
                      <NavigationMenuLink asChild>
                        <Link to="/calificaciones" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          <div className="text-sm font-medium leading-none">Gestión de notas</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Administrar calificaciones por curso
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link to="/calificaciones/boletines" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          <div className="text-sm font-medium leading-none">Boletines</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Generar boletines de calificaciones
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>
                  <BookText className="h-4 w-4 mr-2" />
                  Libro de Tema
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    <li>
                      <NavigationMenuLink asChild>
                        <Link to="/libro-de-tema" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          <div className="text-sm font-medium leading-none">Registro de temas</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Ver temas dictados por curso
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link to="/libro-de-tema/nuevo" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          <div className="text-sm font-medium leading-none">Nuevo registro</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Asentar nuevo tema dictado
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto py-8 px-4">
        <h2 className="text-2xl font-semibold mb-6">Panel Principal</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Users className="h-5 w-5 mr-2 text-blue-500" />
                Alumnos
              </CardTitle>
              <CardDescription>Gestión de estudiantes</CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/alumnos" className="text-blue-600 hover:underline text-sm">
                Ver listado completo →
              </Link>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-green-500" />
                Asistencia
              </CardTitle>
              <CardDescription>Control de asistencia</CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/asistencia" className="text-blue-600 hover:underline text-sm">
                Registrar asistencia →
              </Link>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <FileText className="h-5 w-5 mr-2 text-yellow-500" />
                Informes
              </CardTitle>
              <CardDescription>Informes pedagógicos</CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/informes" className="text-blue-600 hover:underline text-sm">
                Gestionar informes →
              </Link>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <GraduationCap className="h-5 w-5 mr-2 text-purple-500" />
                Calificaciones
              </CardTitle>
              <CardDescription>Gestión de notas</CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/calificaciones" className="text-blue-600 hover:underline text-sm">
                Ver calificaciones →
              </Link>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <BookText className="h-5 w-5 mr-2 text-purple-700" />
                Libro de Tema
              </CardTitle>
              <CardDescription>Registro de clases</CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/libro-de-tema" className="text-blue-600 hover:underline text-sm">
                Ver registros →
              </Link>
            </CardContent>
          </Card>
        
        {/* New management cards */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Users className="h-5 w-5 mr-2 text-indigo-500" />
              Estudiantes
            </CardTitle>
            <CardDescription>Gestión de estudiantes</CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/estudiantes" className="text-blue-600 hover:underline text-sm">
              Administrar estudiantes →
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Users className="h-5 w-5 mr-2 text-red-500" />
              Docentes
            </CardTitle>
            <CardDescription>Gestión de docentes</CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/docentes" className="text-blue-600 hover:underline text-sm">
              Administrar docentes →
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Book className="h-5 w-5 mr-2 text-green-500" />
              Asignaturas
            </CardTitle>
            <CardDescription>Gestión de materias</CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/asignaturas" className="text-blue-600 hover:underline text-sm">
              Administrar asignaturas →
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Home className="h-5 w-5 mr-2 text-orange-500" />
              Aulas
            </CardTitle>
            <CardDescription>Gestión de espacios</CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/aulas" className="text-blue-600 hover:underline text-sm">
              Administrar aulas →
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Keep the rest of the main content */}
      
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Actividades Recientes</CardTitle>
              <CardDescription>Últimas acciones realizadas en el sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Aquí irían las actividades reales desde la base de datos */}
                <div className="border-b pb-2">
                  <p className="text-sm font-medium">Registro de asistencia - 1° Año A</p>
                  <p className="text-xs text-gray-500">Hoy, 08:30 AM</p>
                </div>
                <div className="border-b pb-2">
                  <p className="text-sm font-medium">Carga de calificaciones - 3° Año B</p>
                  <p className="text-xs text-gray-500">Ayer, 14:45 PM</p>
                </div>
                <div className="border-b pb-2">
                  <p className="text-sm font-medium">Nuevo informe - Alumno Martínez, Juan</p>
                  <p className="text-xs text-gray-500">15/04/2025, 10:20 AM</p>
                </div>
                <div className="border-b pb-2">
                  <p className="text-sm font-medium">Tema dictado - Matemática 3° Año A</p>
                  <p className="text-xs text-gray-500">15/04/2025, 09:15 AM</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Próximos Eventos</CardTitle>
              <CardDescription>Calendario de actividades escolares</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Aquí irían los eventos reales desde la base de datos */}
                <div className="border-b pb-2">
                  <p className="text-sm font-medium">Cierre de trimestre</p>
                  <p className="text-xs text-gray-500">25/04/2025</p>
                </div>
                <div className="border-b pb-2">
                  <p className="text-sm font-medium">Reunión de padres - 2° Año</p>
                  <p className="text-xs text-gray-500">30/04/2025, 18:00 PM</p>
                </div>
                <div className="border-b pb-2">
                  <p className="text-sm font-medium">Feriado Nacional</p>
                  <p className="text-xs text-gray-500">01/05/2025</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      
    </main>

    {/* Footer */}
    <footer className="bg-gray-800 text-white py-4 mt-8">
        <div className="container mx-auto text-center text-sm">
          <p>&copy; 2025 Sistema de Gestión Escolar - Escuela Técnica de Río Negro</p>
        </div>
      </footer>
  </div>;
};

export default Index;
