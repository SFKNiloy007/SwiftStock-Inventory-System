import { useEffect, useState } from 'react';
import { Building2, Plus } from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { apiClient } from '../lib/api';

type Supplier = {
  id: string;
  name: string;
  category: string;
  contact: string;
  status: 'Active' | 'Pending';
};

export function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [contact, setContact] = useState('');

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const loadSuppliers = async () => {
    setLoading(true);

    try {
      const response = await apiClient.get('/suppliers', { params: { search: query } });
      setSuppliers(response.data.suppliers ?? []);
      setErrorMessage('');
    } catch (error: any) {
      setErrorMessage(error?.response?.data?.message ?? 'Failed to load suppliers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSuppliers();
  }, [query]);

  const addSupplier = async () => {
    if (!name.trim() || !category.trim() || !contact.trim()) {
      setErrorMessage('Name, category and contact email are required');
      return;
    }

    if (!emailRegex.test(contact.trim())) {
      setErrorMessage('Please enter a valid contact email');
      return;
    }

    try {
      await apiClient.post('/suppliers', {
        name: name.trim(),
        category: category.trim(),
        contact: contact.trim(),
        status: 'Pending',
      });

      setName('');
      setCategory('');
      setContact('');
      setIsDialogOpen(false);
      setErrorMessage('');
      await loadSuppliers();
    } catch (error: any) {
      setErrorMessage(error?.response?.data?.message ?? 'Failed to create supplier');
    }
  };

  return (
    <section className="space-y-6 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Suppliers</h1>
          <p className="mt-1 text-sm text-gray-500">Manage supplier records and sourcing status.</p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Supplier
        </Button>
      </div>

      {loading && <p className="text-sm text-gray-500">Loading suppliers...</p>}
      {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}

      <Card>
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Supplier Directory
          </CardTitle>
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search supplier"
            className="max-w-xs"
          />
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {suppliers.map((supplier) => (
                <TableRow key={supplier.id}>
                  <TableCell className="font-mono text-xs">{supplier.id}</TableCell>
                  <TableCell>{supplier.name}</TableCell>
                  <TableCell>{supplier.category}</TableCell>
                  <TableCell>{supplier.contact}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        supplier.status === 'Active'
                          ? 'border-green-200 bg-green-50 text-green-700'
                          : 'border-yellow-200 bg-yellow-50 text-yellow-700'
                      }
                    >
                      {supplier.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Supplier</DialogTitle>
            <DialogDescription>Create a supplier record in the database.</DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <div className="space-y-1">
              <Label htmlFor="supplier-name">Name</Label>
              <Input id="supplier-name" value={name} onChange={(event) => setName(event.target.value)} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="supplier-category">Category</Label>
              <Input id="supplier-category" value={category} onChange={(event) => setCategory(event.target.value)} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="supplier-contact">Contact Email</Label>
              <Input
                id="supplier-contact"
                type="email"
                value={contact}
                onChange={(event) => setContact(event.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={addSupplier}>Save Supplier</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
