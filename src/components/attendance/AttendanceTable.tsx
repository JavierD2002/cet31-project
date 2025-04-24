
import { Check, X, Clock, Calendar, User } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";

interface Student {
  id: number;
  nombre: string;
  curso: string;
}

interface AttendanceStatus {
  status: 'presente' | 'ausente' | 'tardanza' | 'retirado';
  timestamp?: Date;
  observacion?: string;
}

interface AttendanceTableProps {
  students: Student[];
  attendanceData: {[key: number]: AttendanceStatus};
  observations: {[key: number]: string};
  onAttendanceChange: (studentId: number, status: 'presente' | 'ausente' | 'tardanza' | 'retirado') => void;
  onObservationChange: (studentId: number, value: string) => void;
  formatTime: (date: Date) => string;
}

const AttendanceTable = ({
  students,
  attendanceData,
  observations,
  onAttendanceChange,
  onObservationChange,
  formatTime
}: AttendanceTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-8">#</TableHead>
          <TableHead>Alumno</TableHead>
          <TableHead className="w-20 text-center">Presente</TableHead>
          <TableHead className="w-20 text-center">Ausente</TableHead>
          <TableHead className="w-20 text-center">Tardanza</TableHead>
          <TableHead className="w-20 text-center">Retirado</TableHead>
          <TableHead className="w-32">Estado</TableHead>
          <TableHead>Observaciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {students.map((student, index) => (
          <TableRow key={student.id}>
            <TableCell>{index + 1}</TableCell>
            <TableCell>
              <div className="font-medium flex items-center">
                <User className="h-4 w-4 mr-2 text-gray-500" />
                {student.nombre}
              </div>
            </TableCell>
            <TableCell className="text-center">
              <button 
                className={`rounded-full p-1 ${attendanceData[student.id]?.status === 'presente' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}
                onClick={() => onAttendanceChange(student.id, 'presente')}
                title="Presente"
              >
                <Check className="h-5 w-5" />
              </button>
            </TableCell>
            <TableCell className="text-center">
              <button 
                className={`rounded-full p-1 ${attendanceData[student.id]?.status === 'ausente' ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-400'}`}
                onClick={() => onAttendanceChange(student.id, 'ausente')}
                title="Ausente"
              >
                <X className="h-5 w-5" />
              </button>
            </TableCell>
            <TableCell className="text-center">
              <button 
                className={`rounded-full p-1 ${attendanceData[student.id]?.status === 'tardanza' ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100 text-gray-400'}`}
                onClick={() => onAttendanceChange(student.id, 'tardanza')}
                title="Tardanza"
              >
                <Clock className="h-5 w-5" />
              </button>
            </TableCell>
            <TableCell className="text-center">
              <button 
                className={`rounded-full p-1 ${attendanceData[student.id]?.status === 'retirado' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'}`}
                onClick={() => onAttendanceChange(student.id, 'retirado')}
                title="Retirado"
              >
                <Calendar className="h-5 w-5" />
              </button>
            </TableCell>
            <TableCell>
              {attendanceData[student.id]?.status === 'retirado' && attendanceData[student.id]?.timestamp && (
                <span className="text-xs text-blue-600">
                  Retirado a las {formatTime(attendanceData[student.id].timestamp!)}
                </span>
              )}
              {attendanceData[student.id]?.status && attendanceData[student.id]?.status !== 'retirado' && (
                <span className={`text-xs rounded-full px-2 py-0.5 ${
                  attendanceData[student.id]?.status === 'presente' ? 'bg-green-100 text-green-600' : 
                  attendanceData[student.id]?.status === 'ausente' ? 'bg-red-100 text-red-600' : 
                  'bg-yellow-100 text-yellow-600'
                }`}>
                  {attendanceData[student.id]?.status.charAt(0).toUpperCase() + attendanceData[student.id]?.status.slice(1)}
                </span>
              )}
            </TableCell>
            <TableCell>
              <Input 
                placeholder="Observaciones"
                className="text-sm"
                value={observations[student.id] || ''}
                onChange={(e) => onObservationChange(student.id, e.target.value)}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default AttendanceTable;
