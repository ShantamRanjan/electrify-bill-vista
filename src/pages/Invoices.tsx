
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus } from 'lucide-react';

interface Invoice {
  invoice_id: number;
  board_id: number;
  tariff_id: number;
  account_no: number;
  meter_number: number;
  reading_date: string;
  board_name: string;
  tariff_type: string;
  account_name: string;
  amount: number;
  cust_name: string;
}

interface Board {
  board_id: number;
  board_name: string;
}

interface Tariff {
  tariff_id: number;
  tariff_type: string;
}

interface Account {
  acc_id: number;
  account_name: string;
}

interface Billing {
  meter_number: number;
  account_name: string;
}

const Invoices = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [boards, setBoards] = useState<Board[]>([]);
  const [tariffs, setTariffs] = useState<Tariff[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [billings, setBillings] = useState<Billing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [formData, setFormData] = useState({
    board_id: '',
    tariff_id: '',
    account_no: '',
    meter_number: '',
    reading_date: new Date().toISOString().slice(0, 10)
  });

  const fetchInvoices = () => {
    setIsLoading(true);
    fetch('http://localhost:3001/api/invoices')
      .then(response => response.json())
      .then(data => {
        setInvoices(data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error fetching invoices:', error);
        setIsLoading(false);
      });
  };

  const fetchDropdownData = () => {
    // Fetch boards
    fetch('http://localhost:3001/api/boards')
      .then(response => response.json())
      .then(data => {
        setBoards(data);
      })
      .catch(error => {
        console.error('Error fetching boards:', error);
      });
    
    // Fetch tariffs
    fetch('http://localhost:3001/api/tariffs')
      .then(response => response.json())
      .then(data => {
        setTariffs(data);
      })
      .catch(error => {
        console.error('Error fetching tariffs:', error);
      });
    
    // Fetch accounts
    fetch('http://localhost:3001/api/accounts')
      .then(response => response.json())
      .then(data => {
        setAccounts(data);
      })
      .catch(error => {
        console.error('Error fetching accounts:', error);
      });
    
    // Fetch billings
    fetch('http://localhost:3001/api/billings')
      .then(response => response.json())
      .then(data => {
        setBillings(data);
      })
      .catch(error => {
        console.error('Error fetching billings:', error);
      });
  };

  useEffect(() => {
    fetchInvoices();
    fetchDropdownData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    fetch('http://localhost:3001/api/invoices', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        board_id: parseInt(formData.board_id),
        tariff_id: parseInt(formData.tariff_id),
        account_no: parseInt(formData.account_no),
        meter_number: parseInt(formData.meter_number),
        reading_date: formData.reading_date
      }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          fetchInvoices();
          setIsFormVisible(false);
          setFormData({
            board_id: '',
            tariff_id: '',
            account_no: '',
            meter_number: '',
            reading_date: new Date().toISOString().slice(0, 10)
          });
        }
      })
      .catch(error => {
        console.error('Error creating invoice:', error);
      });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Invoices</h1>
        <Button onClick={() => setIsFormVisible(!isFormVisible)}>
          <Plus className="h-4 w-4 mr-2" />
          Generate Invoice
        </Button>
      </div>

      {isFormVisible && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Generate New Invoice</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="board_id">Electricity Board</Label>
                  <select
                    id="board_id"
                    name="board_id"
                    value={formData.board_id}
                    onChange={handleInputChange}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                    required
                  >
                    <option value="">Select a board</option>
                    {boards.map(board => (
                      <option key={board.board_id} value={board.board_id}>
                        {board.board_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tariff_id">Tariff Type</Label>
                  <select
                    id="tariff_id"
                    name="tariff_id"
                    value={formData.tariff_id}
                    onChange={handleInputChange}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                    required
                  >
                    <option value="">Select a tariff</option>
                    {tariffs.map(tariff => (
                      <option key={tariff.tariff_id} value={tariff.tariff_id}>
                        {tariff.tariff_type}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="account_no">Account</Label>
                  <select
                    id="account_no"
                    name="account_no"
                    value={formData.account_no}
                    onChange={handleInputChange}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                    required
                  >
                    <option value="">Select an account</option>
                    {accounts.map(account => (
                      <option key={account.acc_id} value={account.acc_id}>
                        {account.account_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="meter_number">Meter Number</Label>
                  <select
                    id="meter_number"
                    name="meter_number"
                    value={formData.meter_number}
                    onChange={handleInputChange}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                    required
                  >
                    <option value="">Select a meter</option>
                    {billings.map(billing => (
                      <option key={billing.meter_number} value={billing.meter_number}>
                        Meter #{billing.meter_number} - {billing.account_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reading_date">Reading Date</Label>
                  <Input
                    id="reading_date"
                    name="reading_date"
                    type="date"
                    value={formData.reading_date}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsFormVisible(false)}>
                  Cancel
                </Button>
                <Button type="submit">Generate Invoice</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <div className="flex justify-center">
          <p className="text-gray-500">Loading invoices...</p>
        </div>
      ) : invoices.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500">No invoices found. Generate your first invoice!</p>
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Account</TableHead>
                  <TableHead>Board</TableHead>
                  <TableHead>Tariff</TableHead>
                  <TableHead>Meter #</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map(invoice => (
                  <TableRow key={invoice.invoice_id}>
                    <TableCell>{invoice.invoice_id}</TableCell>
                    <TableCell>{invoice.cust_name}</TableCell>
                    <TableCell>{invoice.account_name}</TableCell>
                    <TableCell>{invoice.board_name}</TableCell>
                    <TableCell>{invoice.tariff_type}</TableCell>
                    <TableCell>{invoice.meter_number}</TableCell>
                    <TableCell>₹{invoice.amount.toFixed(2)}</TableCell>
                    <TableCell>{new Date(invoice.reading_date).toLocaleDateString()}</TableCell>
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

export default Invoices;
