
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Calendar, Clock, User, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getStudentAttendanceStats } from '@/services/supabase';

interface StudentAttendanceTabProps {
  studentId: number;
}

const StudentAttendanceTab = ({ studentId }: StudentAttendanceTabProps) => {
  const { data: estadisticas, isLoading } = useQuery({
    queryKey: ['studentAttendance', studentId],
    queryFn: () => getStudentAttendanceStats(studentId)
  });

  const totalClases = estadisticas ? 
    estadisticas.presente + estadisticas.ausente + estadisticas.tardanza + estadisticas.retirado : 
    0;

  const porcentajeAsistencia = totalClases > 0 ? 
    ((estadisticas?.presente || 0) / totalClases * 100).toFixed(1) : 
    '0.0';

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Estadísticas de Asistencia</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600 mr-3" />
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {estadisticas?.presente || 0}
                </div>
                <div className="text-sm text-gray-600">Presente</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 flex items-center">
              <XCircle className="h-8 w-8 text-red-600 mr-3" />
              <div>
                <div className="text-2xl font-bold text-red-600">
                  {estadisticas?.ausente || 0}
                </div>
                <div className="text-sm text-gray-600">Ausente</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 flex items-center">
              <Clock className="h-8 w-8 text-yellow-600 mr-3" />
              <div>
                <div className="text-2xl font-bold text-yellow-600">
                  {estadisticas?.tardanza || 0}
                </div>
                <div className="text-sm text-gray-600">Tardanza</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 flex items-center">
              <AlertCircle className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {porcentajeAsistencia}%
                </div>
                <div className="text-sm text-gray-600">Asistencia</div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5" />
              Resumen de Asistencia
            </CardTitle>
            <CardDescription>
              Estadísticas generales del período académico actual
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Total de clases:</span>
                <span className="font-bold">{totalClases}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Porcentaje de asistencia:</span>
                <span className={`font-bold ${
                  parseFloat(porcentajeAsistencia) >= 85 ? 'text-green-600' :
                  parseFloat(porcentajeAsistencia) >= 75 ? 'text-yellow-600' :
                  'text-red-600'
                }`}>
                  {porcentajeAsistencia}%
                </span>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    parseFloat(porcentajeAsistencia) >= 85 ? 'bg-green-600' :
                    parseFloat(porcentajeAsistencia) >= 75 ? 'bg-yellow-600' :
                    'bg-red-600'
                  }`}
                  style={{ width: `${porcentajeAsistencia}%` }}
                ></div>
              </div>

              {parseFloat(porcentajeAsistencia) < 75 && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                  <div className="flex items-center">
                    <AlertCircle className="h-4 w-4 text-red-600 mr-2" />
                    <span className="text-sm text-red-700">
                      El porcentaje de asistencia está por debajo del mínimo requerido (75%)
                    </span>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentAttendanceTab;
