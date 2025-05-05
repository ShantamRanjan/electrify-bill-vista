
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import Billings from './pages/Billings';
import Invoices from './pages/Invoices';
import Accounts from './pages/Accounts';
import Layout from './components/Layout';
import './index.css';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/accounts" element={<Accounts />} />
          <Route path="/billings" element={<Billings />} />
          <Route path="/invoices" element={<Invoices />} />
        </Route>
      </Routes>
    </Router>
  );
}
