
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Teacher {
  id: number;
  nombre: string;
}

interface Subject {
  id: number;
  nombre: string;
  profesorId: number;
  cursos: string[];
}

interface AttendanceSelectorsProps {
  teachers: Teacher[];
  teacherSubjects: Subject[];
  subjectCourses: string[];
  selectedTeacher: number | null;
  selectedSubject: number | null;
  onTeacherChange: (value: string) => void;
  onSubjectChange: (value: string) => void;
  onCourseChange: (value: string) => void;
}

const AttendanceSelectors = ({
  teachers,
  teacherSubjects,
  subjectCourses,
  selectedTeacher,
  selectedSubject,
  onTeacherChange,
  onSubjectChange,
  onCourseChange,
}: AttendanceSelectorsProps) => {
  return (
    <>
      <div className="space-y-2">
        <label className="text-sm font-medium">Profesor</label>
        <Select onValueChange={onTeacherChange}>
          <SelectTrigger>
            <SelectValue placeholder="Seleccionar profesor" />
          </SelectTrigger>
          <SelectContent>
            {teachers.map(teacher => (
              <SelectItem key={teacher.id} value={teacher.id.toString()}>
                {teacher.nombre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Asignatura</label>
        <Select 
          onValueChange={onSubjectChange}
          disabled={!selectedTeacher}
        >
          <SelectTrigger>
            <SelectValue placeholder={!selectedTeacher ? "Primero seleccione un profesor" : "Seleccionar asignatura"} />
          </SelectTrigger>
          <SelectContent>
            {teacherSubjects.map(subject => (
              <SelectItem key={subject.id} value={subject.id.toString()}>
                {subject.nombre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Curso</label>
        <Select 
          onValueChange={onCourseChange}
          disabled={!selectedSubject}
        >
          <SelectTrigger>
            <SelectValue placeholder={!selectedSubject ? "Primero seleccione una asignatura" : "Seleccionar curso"} />
          </SelectTrigger>
          <SelectContent>
            {subjectCourses.map(course => (
              <SelectItem key={course} value={course}>
                {course}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </>
  );
};

export default AttendanceSelectors;
