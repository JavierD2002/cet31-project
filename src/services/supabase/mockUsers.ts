
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
    }
  ]
}
