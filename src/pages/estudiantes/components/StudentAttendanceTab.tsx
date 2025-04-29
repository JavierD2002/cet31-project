
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type EstadisticaAsistencia = {
  presente: number;
  ausente: number;
  tardanza: number;
  retirado: number;
};

const StudentAttendanceTab = ({ asistencia }: { asistencia?: EstadisticaAsistencia }) => {
  if (!asistencia) return null;
  
  const total = Object.values(asistencia).reduce((a, b) => a + b, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resumen de Asistencia</CardTitle>
        <CardDescription>Ciclo lectivo 2025</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-green-50 p-4 rounded-md border border-green-200">
            <p className="text-sm font-medium text-green-700">Presente</p>
            <p className="text-3xl font-bold text-green-600">{asistencia.presente}</p>
          </div>
          <div className="bg-red-50 p-4 rounded-md border border-red-200">
            <p className="text-sm font-medium text-red-700">Ausente</p>
            <p className="text-3xl font-bold text-red-600">{asistencia.ausente}</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200">
            <p className="text-sm font-medium text-yellow-700">Tardanza</p>
            <p className="text-3xl font-bold text-yellow-600">{asistencia.tardanza}</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-md border border-blue-200">
            <p className="text-sm font-medium text-blue-700">Retirado</p>
            <p className="text-3xl font-bold text-blue-600">{asistencia.retirado}</p>
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-md border">
          <p className="font-medium mb-2">Total de días: {total}</p>
          <div className="w-full h-6 bg-gray-200 rounded-full overflow-hidden">
            <div className="flex h-full">
              <div 
                className="bg-green-500 h-full" 
                style={{ width: `${(asistencia.presente / total) * 100}%` }}
              ></div>
              <div 
                className="bg-red-500 h-full" 
                style={{ width: `${(asistencia.ausente / total) * 100}%` }}
              ></div>
              <div 
                className="bg-yellow-500 h-full" 
                style={{ width: `${(asistencia.tardanza / total) * 100}%` }}
              ></div>
              <div 
                className="bg-blue-500 h-full" 
                style={{ width: `${(asistencia.retirado / total) * 100}%` }}
              ></div>
            </div>
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <span>Presente: {Math.round((asistencia.presente / total) * 100)}%</span>
            <span>Ausente: {Math.round((asistencia.ausente / total) * 100)}%</span>
            <span>Tardanza: {Math.round((asistencia.tardanza / total) * 100)}%</span>
            <span>Retirado: {Math.round((asistencia.retirado / total) * 100)}%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StudentAttendanceTab;
