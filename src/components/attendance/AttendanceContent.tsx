
import { User } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import DateSelector from './DateSelector';
import AttendanceSelectors from './AttendanceSelectors';
import AttendanceTable from './AttendanceTable';
import { Student, Teacher, Subject, AttendanceStatus } from '@/types/attendance';

interface AttendanceContentProps {
  teachers: Teacher[];
  teacherSubjects: Subject[];
  subjectCourses: string[];
  filteredStudents: Student[];
  selectedDate: Date;
  selectedTeacher: number | null;
  selectedSubject: number | null;
  selectedCourse: string | null;
  attendanceData: {[key: number]: AttendanceStatus};
  observations: {[key: number]: string};
  formatDate: (date: Date) => string;
  formatTime: (date: Date) => string;
  onPreviousDay: () => void;
  onNextDay: () => void;
  onTeacherChange: (value: string) => void;
  onSubjectChange: (value: string) => void;
  onCourseChange: (value: string) => void;
  onAttendanceChange: (studentId: number, status: 'presente' | 'ausente' | 'tardanza' | 'retirado') => void;
  onObservationChange: (studentId: number, value: string) => void;
  onSave: () => void;
}

const AttendanceContent = ({
  teachers,
  teacherSubjects,
  subjectCourses,
  filteredStudents,
  selectedDate,
  selectedTeacher,
  selectedSubject,
  selectedCourse,
  attendanceData,
  observations,
  formatDate,
  formatTime,
  onPreviousDay,
  onNextDay,
  onTeacherChange,
  onSubjectChange,
  onCourseChange,
  onAttendanceChange,
  onObservationChange,
  onSave
}: AttendanceContentProps) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Registro de Asistencia</CardTitle>
        <CardDescription>
          Seleccione un profesor, asignatura y curso para registrar la asistencia
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <DateSelector 
            selectedDate={selectedDate}
            onPreviousDay={onPreviousDay}
            onNextDay={onNextDay}
            formatDate={formatDate}
          />
          
          <AttendanceSelectors 
            teachers={teachers}
            teacherSubjects={teacherSubjects}
            subjectCourses={subjectCourses}
            selectedTeacher={selectedTeacher}
            selectedSubject={selectedSubject}
            onTeacherChange={onTeacherChange}
            onSubjectChange={onSubjectChange}
            onCourseChange={onCourseChange}
          />
        </div>
        
        {selectedCourse ? (
          <div className="border rounded-md overflow-hidden">
            <AttendanceTable 
              students={filteredStudents}
              attendanceData={attendanceData}
              observations={observations}
              onAttendanceChange={onAttendanceChange}
              onObservationChange={onObservationChange}
              formatTime={formatTime}
            />
          </div>
        ) : (
          <div className="text-center p-6 bg-gray-50 rounded-md border border-dashed">
            <User className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">Seleccione un profesor, asignatura y curso para ver la lista de estudiantes</p>
          </div>
        )}
        
        {selectedCourse && filteredStudents.length > 0 && (
          <div className="mt-6 flex justify-end">
            <Button 
              variant="default"
              onClick={onSave}
              disabled={Object.keys(attendanceData).length === 0}
            >
              Guardar Asistencia
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AttendanceContent;
