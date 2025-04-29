
// Mock users for development without Supabase
export const getMockUsers = async () => {
  return [
    { 
      id: 1, 
      dni: "11111111", 
      nombre: "Admin", 
      apellido: "Sistema", 
      email: "admin@escuela.edu", 
      rol: "administrador" 
    },
    { 
      id: 2, 
      dni: "22222222", 
      nombre: "Director", 
      apellido: "Escuela", 
      email: "director@escuela.edu", 
      rol: "directivo" 
    },
    { 
      id: 101, 
      dni: "25789456", 
      nombre: "Ana", 
      apellido: "García", 
      email: "ana.garcia@escuela.edu", 
      rol: "docente" 
    },
    { 
      id: 201, 
      dni: "45789123", 
      nombre: "María", 
      apellido: "Acosta", 
      email: "maria.acosta@estudiante.edu", 
      rol: "estudiante" 
    }
  ]
}
