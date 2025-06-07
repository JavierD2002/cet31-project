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
  getAttendanceDetails,
  getStudentAttendanceStats,
  getAttendanceReport,
  getAbsentStudentsNotifications
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

// Grades
export {
  getGradesByCourseAndSubject,
  saveGrade,
  getStudentGrades,
  getStudentReport,
  type GradePeriod,
  type Grade,
  type GradeWithDetails,
  type StudentGrades
} from './grades';

// Topics (Libro de Tema)
export {
  getTopics,
  createTopic,
  updateTopic,
  deleteTopic
} from './topics';

// Reports (Sistema de Informes)
export {
  getReports,
  getReportTemplates,
  createReport,
  updateReport,
  deleteReport,
  getReportById
} from './reports';
