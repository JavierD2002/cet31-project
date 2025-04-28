
import { Badge } from "@/components/ui/badge";

interface AttendanceStatusBadgeProps {
  status: 'presente' | 'ausente' | 'tardanza' | 'retirado';
}

const AttendanceStatusBadge = ({ status }: AttendanceStatusBadgeProps) => {
  const getStatusColor = () => {
    switch (status) {
      case 'presente':
        return 'bg-green-100 text-green-800';
      case 'ausente':
        return 'bg-red-100 text-red-800';
      case 'tardanza':
        return 'bg-yellow-100 text-yellow-800';
      case 'retirado':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Badge className={getStatusColor()}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};

export default AttendanceStatusBadge;
