
// Re-export all functions from their respective files
export { supabase, isSupabaseConfigured } from './client';
export { getMockUsers } from './mockUsers';

// Teachers
export { 
  getTeachers, 
  getTeacherProfile,
  createTeacher,
  updateTeacher,
  deleteTeacher
} from './teachers';

// Students
export { 
  getStudents, 
  getStudentProfile, 
  getStudentAbsences,
  createStudent,
  updateStudent,
  deleteStudent
} from './students';

// Attendance
export { 
  saveAttendance, 
  getAttendanceHistory, 
  getAttendanceDetails 
} from './attendance';

// Subjects
export {
  getSubjects,
  createSubject,
  updateSubject,
  deleteSubject
} from './subjects';

// Classrooms
export {
  getClassrooms,
  createClassroom,
  updateClassroom,
  deleteClassroom
} from './classrooms';
