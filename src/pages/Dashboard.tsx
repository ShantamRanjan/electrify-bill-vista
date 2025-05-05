
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, FileText, PieChart, Database } from 'lucide-react';

interface DashboardData {
  customerCount: number;
  totalBillingAmount: number;
  invoiceCount: number;
  totalUnits: number;
}

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    customerCount: 0,
    totalBillingAmount: 0,
    invoiceCount: 0,
    totalUnits: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3001/api/dashboard')
      .then(response => response.json())
      .then(data => {
        setDashboardData(data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error fetching dashboard data:', error);
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      
      {isLoading ? (
        <div className="flex justify-center">
          <p className="text-gray-500">Loading dashboard data...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.customerCount}</div>
              <p className="text-xs text-gray-500">Registered customers</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Billing Amount</CardTitle>
              <Database className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{dashboardData.totalBillingAmount.toFixed(2)}</div>
              <p className="text-xs text-gray-500">Across all customers</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Invoices</CardTitle>
              <FileText className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.invoiceCount}</div>
              <p className="text-xs text-gray-500">Generated invoices</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Units Consumed</CardTitle>
              <PieChart className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.totalUnits}</div>
              <p className="text-xs text-gray-500">Electricity units</p>
            </CardContent>
          </Card>
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Electricity Billing System</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500">
              Welcome to the Electricity Billing Management System. This dashboard provides an overview 
              of customers, billing information, and invoices. Use the sidebar to navigate to different 
              sections of the application.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li>
                <a href="/customers" className="text-blue-600 hover:underline">Add a new customer</a>
              </li>
              <li>
                <a href="/billings" className="text-blue-600 hover:underline">Create a new billing record</a>
              </li>
              <li>
                <a href="/invoices" className="text-blue-600 hover:underline">Generate an invoice</a>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
