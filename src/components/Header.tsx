
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-blue-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <img 
            src="/lovable-uploads/23fe776b-bfc4-4d5b-91a2-a06fdf2c43d1.png" 
            alt="Logo CET31" 
            className="h-10 mr-3" 
          />
          <h1 className="text-2xl font-bold">Sistema de Gestión Escolar - CET31</h1>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm">Admin</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
