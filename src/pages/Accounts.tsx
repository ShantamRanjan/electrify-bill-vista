
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus } from 'lucide-react';

interface Account {
  acc_id: number;
  cust_id: number;
  account_name: string;
  name: string;
  cust_name: string;
}

interface Customer {
  cust_id: number;
  cust_name: string;
}

const Accounts = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [formData, setFormData] = useState({
    cust_id: '',
    account_name: '',
    name: ''
  });

  const fetchAccounts = () => {
    setIsLoading(true);
    fetch('http://localhost:3001/api/accounts')
      .then(response => response.json())
      .then(data => {
        setAccounts(data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error fetching accounts:', error);
        setIsLoading(false);
      });
  };

  const fetchCustomers = () => {
    fetch('http://localhost:3001/api/customers')
      .then(response => response.json())
      .then(data => {
        setCustomers(data);
      })
      .catch(error => {
        console.error('Error fetching customers:', error);
      });
  };

  useEffect(() => {
    fetchAccounts();
    fetchCustomers();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    fetch('http://localhost:3001/api/accounts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...formData,
        cust_id: parseInt(formData.cust_id)
      }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          fetchAccounts();
          setIsFormVisible(false);
          setFormData({
            cust_id: '',
            account_name: '',
            name: ''
          });
        }
      })
      .catch(error => {
        console.error('Error creating account:', error);
      });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Accounts</h1>
        <Button onClick={() => setIsFormVisible(!isFormVisible)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Account
        </Button>
      </div>

      {isFormVisible && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Add New Account</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cust_id">Customer</Label>
                  <select
                    id="cust_id"
                    name="cust_id"
                    value={formData.cust_id}
                    onChange={handleInputChange}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                    required
                  >
                    <option value="">Select a customer</option>
                    {customers.map(customer => (
                      <option key={customer.cust_id} value={customer.cust_id}>
                        {customer.cust_name} (ID: {customer.cust_id})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="account_name">Account Name</Label>
                  <Input
                    id="account_name"
                    name="account_name"
                    value={formData.account_name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsFormVisible(false)}>
                  Cancel
                </Button>
                <Button type="submit">Save Account</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <div className="flex justify-center">
          <p className="text-gray-500">Loading accounts...</p>
        </div>
      ) : accounts.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500">No accounts found. Add your first account!</p>
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Account ID</TableHead>
                  <TableHead>Customer Name</TableHead>
                  <TableHead>Account Name</TableHead>
                  <TableHead>Name</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {accounts.map(account => (
                  <TableRow key={account.acc_id}>
                    <TableCell>{account.acc_id}</TableCell>
                    <TableCell>{account.cust_name}</TableCell>
                    <TableCell>{account.account_name}</TableCell>
                    <TableCell>{account.name}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Accounts;
