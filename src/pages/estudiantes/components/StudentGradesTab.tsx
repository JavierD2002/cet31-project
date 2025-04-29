
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type CalificacionesPorMateria = {
  asignatura: string;
  trimestre1: number | null;
  trimestre2: number | null;
  trimestre3: number | null;
};

const StudentGradesTab = ({ calificaciones }: { calificaciones?: CalificacionesPorMateria[] }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Calificaciones</CardTitle>
        <CardDescription>Ciclo lectivo 2025</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="border rounded-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left font-medium text-gray-500">Asignatura</th>
                <th className="px-4 py-2 text-center font-medium text-gray-500">1° Trimestre</th>
                <th className="px-4 py-2 text-center font-medium text-gray-500">2° Trimestre</th>
                <th className="px-4 py-2 text-center font-medium text-gray-500">3° Trimestre</th>
                <th className="px-4 py-2 text-center font-medium text-gray-500">Promedio</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {calificaciones?.map((calificacion, index) => {
                const notas = [calificacion.trimestre1, calificacion.trimestre2, calificacion.trimestre3].filter(nota => nota !== null) as number[];
                const promedio = notas.length > 0 ? (notas.reduce((a, b) => a + b, 0) / notas.length).toFixed(1) : "-";
                
                return (
                  <tr key={index}>
                    <td className="px-4 py-3 font-medium">{calificacion.asignatura}</td>
                    <td className="px-4 py-3 text-center">{calificacion.trimestre1 ?? "-"}</td>
                    <td className="px-4 py-3 text-center">{calificacion.trimestre2 ?? "-"}</td>
                    <td className="px-4 py-3 text-center">{calificacion.trimestre3 ?? "-"}</td>
                    <td className="px-4 py-3 text-center font-medium">{promedio}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default StudentGradesTab;
