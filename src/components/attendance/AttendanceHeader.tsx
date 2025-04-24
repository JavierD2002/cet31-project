
import { ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const AttendanceHeader = () => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-semibold">Control de Asistencia</h2>
      <Link to="/asistencia/historial" className="text-blue-600 hover:underline text-sm">
        Ver historial de asistencia →
      </Link>
    </div>
  );
};

export default AttendanceHeader;
