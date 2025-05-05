
import { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Home, Users, FileText, Database, PieChart } from 'lucide-react';

const Layout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="hidden md:flex flex-col w-64 bg-white shadow-lg">
        <div className="p-4 border-b">
          <h1 className="text-2xl font-bold text-blue-600">Electricity Bill</h1>
        </div>
        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-2">
            <li>
              <Link to="/" className="flex items-center p-2 text-gray-700 rounded hover:bg-blue-100">
                <Home className="w-5 h-5 mr-3" />
                <span>Dashboard</span>
              </Link>
            </li>
            <li>
              <Link to="/customers" className="flex items-center p-2 text-gray-700 rounded hover:bg-blue-100">
                <Users className="w-5 h-5 mr-3" />
                <span>Customers</span>
              </Link>
            </li>
            <li>
              <Link to="/accounts" className="flex items-center p-2 text-gray-700 rounded hover:bg-blue-100">
                <Database className="w-5 h-5 mr-3" />
                <span>Accounts</span>
              </Link>
            </li>
            <li>
              <Link to="/billings" className="flex items-center p-2 text-gray-700 rounded hover:bg-blue-100">
                <FileText className="w-5 h-5 mr-3" />
                <span>Billings</span>
              </Link>
            </li>
            <li>
              <Link to="/invoices" className="flex items-center p-2 text-gray-700 rounded hover:bg-blue-100">
                <PieChart className="w-5 h-5 mr-3" />
                <span>Invoices</span>
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Mobile menu */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white shadow-md p-4">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold text-blue-600">Electricity Bill</h1>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-gray-700 focus:outline-none"
          >
            {isMobileMenuOpen ? 'Close' : 'Menu'}
          </button>
        </div>
        {isMobileMenuOpen && (
          <nav className="mt-4">
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/" 
                  className="flex items-center p-2 text-gray-700 rounded hover:bg-blue-100"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Home className="w-5 h-5 mr-3" />
                  <span>Dashboard</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/customers" 
                  className="flex items-center p-2 text-gray-700 rounded hover:bg-blue-100"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Users className="w-5 h-5 mr-3" />
                  <span>Customers</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/accounts" 
                  className="flex items-center p-2 text-gray-700 rounded hover:bg-blue-100"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Database className="w-5 h-5 mr-3" />
                  <span>Accounts</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/billings" 
                  className="flex items-center p-2 text-gray-700 rounded hover:bg-blue-100"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <FileText className="w-5 h-5 mr-3" />
                  <span>Billings</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/invoices" 
                  className="flex items-center p-2 text-gray-700 rounded hover:bg-blue-100"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <PieChart className="w-5 h-5 mr-3" />
                  <span>Invoices</span>
                </Link>
              </li>
            </ul>
          </nav>
        )}
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4 md:p-6 mt-16 md:mt-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
