
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus } from 'lucide-react';

interface Billing {
  meter_number: number;
  acc_id: number;
  cust_id: number;
  monthly_units: number;
  per_unit: number;
  amount: number;
  cust_name: string;
  account_name: string;
}

interface Customer {
  cust_id: number;
  cust_name: string;
}

interface Account {
  acc_id: number;
  cust_id: number;
  account_name: string;
}

const Billings = () => {
  const [billings, setBillings] = useState<Billing[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [formData, setFormData] = useState({
    cust_id: '',
    acc_id: '',
    monthly_units: '',
    per_unit: ''
  });
  const [filteredAccounts, setFilteredAccounts] = useState<Account[]>([]);

  const fetchBillings = () => {
    setIsLoading(true);
    fetch('http://localhost:3001/api/billings')
      .then(response => response.json())
      .then(data => {
        setBillings(data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error fetching billings:', error);
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

  const fetchAccounts = () => {
    fetch('http://localhost:3001/api/accounts')
      .then(response => response.json())
      .then(data => {
        setAccounts(data);
      })
      .catch(error => {
        console.error('Error fetching accounts:', error);
      });
  };

  useEffect(() => {
    fetchBillings();
    fetchCustomers();
    fetchAccounts();
  }, []);

  useEffect(() => {
    if (formData.cust_id) {
      const filtered = accounts.filter(
        account => account.cust_id === parseInt(formData.cust_id)
      );
      setFilteredAccounts(filtered);
    } else {
      setFilteredAccounts([]);
    }
  }, [formData.cust_id, accounts]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    fetch('http://localhost:3001/api/billings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        cust_id: parseInt(formData.cust_id),
        acc_id: parseInt(formData.acc_id),
        monthly_units: parseInt(formData.monthly_units),
        per_unit: parseFloat(formData.per_unit)
      }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          fetchBillings();
          setIsFormVisible(false);
          setFormData({
            cust_id: '',
            acc_id: '',
            monthly_units: '',
            per_unit: ''
          });
        }
      })
      .catch(error => {
        console.error('Error creating billing:', error);
      });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Billings</h1>
        <Button onClick={() => setIsFormVisible(!isFormVisible)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Billing
        </Button>
      </div>

      {isFormVisible && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Add New Billing</CardTitle>
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
                        {customer.cust_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="acc_id">Account</Label>
                  <select
                    id="acc_id"
                    name="acc_id"
                    value={formData.acc_id}
                    onChange={handleInputChange}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                    required
                    disabled={!formData.cust_id}
                  >
                    <option value="">Select an account</option>
                    {filteredAccounts.map(account => (
                      <option key={account.acc_id} value={account.acc_id}>
                        {account.account_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="monthly_units">Monthly Units</Label>
                  <Input
                    id="monthly_units"
                    name="monthly_units"
                    type="number"
                    min="0"
                    value={formData.monthly_units}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="per_unit">Per Unit Rate</Label>
                  <Input
                    id="per_unit"
                    name="per_unit"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.per_unit}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsFormVisible(false)}>
                  Cancel
                </Button>
                <Button type="submit">Save Billing</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <div className="flex justify-center">
          <p className="text-gray-500">Loading billings...</p>
        </div>
      ) : billings.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500">No billings found. Add your first billing!</p>
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Meter Number</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Account</TableHead>
                  <TableHead>Monthly Units</TableHead>
                  <TableHead>Per Unit Rate</TableHead>
                  <TableHead>Total Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {billings.map(billing => (
                  <TableRow key={billing.meter_number}>
                    <TableCell>{billing.meter_number}</TableCell>
                    <TableCell>{billing.cust_name}</TableCell>
                    <TableCell>{billing.account_name}</TableCell>
                    <TableCell>{billing.monthly_units}</TableCell>
                    <TableCell>₹{billing.per_unit.toFixed(2)}</TableCell>
                    <TableCell>₹{billing.amount.toFixed(2)}</TableCell>
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

export default Billings;
