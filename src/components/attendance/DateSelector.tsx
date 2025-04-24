
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

interface DateSelectorProps {
  selectedDate: Date;
  onPreviousDay: () => void;
  onNextDay: () => void;
  formatDate: (date: Date) => string;
}

const DateSelector = ({ selectedDate, onPreviousDay, onNextDay, formatDate }: DateSelectorProps) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Fecha</label>
      <div className="flex items-center border rounded-md">
        <button onClick={onPreviousDay} className="p-2 hover:bg-gray-100 rounded-l-md">
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="px-3 py-2 flex items-center">
          <Calendar className="h-4 w-4 mr-2 text-gray-500" />
          {formatDate(selectedDate)}
        </span>
        <button onClick={onNextDay} className="p-2 hover:bg-gray-100 rounded-r-md">
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default DateSelector;
