import { useEffect, useMemo, useRef, useState } from 'react';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { Header } from './Header';
import { ProductTable } from './ProductTable';
import { apiClient } from '../lib/api';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Product, UserRole } from './types';

type InventoryPageProps = {
  userRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  canChangeRole: boolean;
  canUseAdminFeatures: boolean;
};

type ProductApiResponse = {
  products: Product[];
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
};

type CachedProductsPage = {
  products: Product[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
};

type AddProductForm = {
  name: string;
  category: string;
  stockLevel: string;
  retailPrice: string;
  costPrice: string;
  image: string;
};

export function InventoryPage({
  userRole,
  onRoleChange,
  canChangeRole,
  canUseAdminFeatures,
}: InventoryPageProps) {
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [debouncedCategoryFilter, setDebouncedCategoryFilter] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(20);
  const [totalProductsCount, setTotalProductsCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [productError, setProductError] = useState('');
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [addProductError, setAddProductError] = useState('');
  const [isFlushOpen, setIsFlushOpen] = useState(false);
  const [flushPassword, setFlushPassword] = useState('');
  const [flushError, setFlushError] = useState('');
  const [addProductForm, setAddProductForm] = useState<AddProductForm>({
    name: '',
    category: '',
    stockLevel: '',
    retailPrice: '',
    costPrice: '',
    image: '',
  });

  const productCacheRef = useRef<Map<string, CachedProductsPage>>(new Map());

  const getCacheKey = (nameValue: string, categoryValue: string, pageValue: number, pageSizeValue: number) =>
    `${nameValue.trim().toLowerCase()}|${categoryValue.trim().toLowerCase()}|${pageValue}|${pageSizeValue}`;

  const writeCache = (key: string, value: CachedProductsPage) => {
    const cache = productCacheRef.current;
    if (cache.has(key)) {
      cache.delete(key);
    }

    cache.set(key, value);

    if (cache.size > 25) {
      const oldestKey = cache.keys().next().value;
      if (oldestKey) {
        cache.delete(oldestKey);
      }
    }
  };

  const loadProducts = async (
    nameValue = debouncedSearchQuery,
    categoryValue = debouncedCategoryFilter,
    pageValue = currentPage,
    pageSizeValue = pageSize
  ) => {
    const cacheKey = getCacheKey(nameValue, categoryValue, pageValue, pageSizeValue);
    const cachedPage = productCacheRef.current.get(cacheKey);

    if (cachedPage) {
      setProducts(cachedPage.products);
      setTotalProductsCount(cachedPage.pagination.total);
      setTotalPages(cachedPage.pagination.totalPages);
      return;
    }

    setLoadingProducts(true);
    setProductError('');

    try {
      const response = await apiClient.get<ProductApiResponse>('/products/search', {
        params: {
          name: nameValue.trim(),
          category: categoryValue.trim(),
          page: pageValue,
          pageSize: pageSizeValue,
        },
      });

      const pagination = response.data.pagination ?? {
        page: pageValue,
        pageSize: pageSizeValue,
        total: response.data.products.length,
        totalPages: 1,
      };

      setProducts(response.data.products);
      setTotalProductsCount(pagination.total);
      setTotalPages(pagination.totalPages);
      writeCache(cacheKey, { products: response.data.products, pagination });
    } catch (error: any) {
      const message = error?.response?.data?.message ?? 'Failed to load products';
      setProductError(message);
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
    const timer = window.setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      setDebouncedCategoryFilter(categoryFilter);
    }, 400);

    return () => window.clearTimeout(timer);
  }, [searchQuery, categoryFilter]);

  useEffect(() => {
    loadProducts(debouncedSearchQuery, debouncedCategoryFilter, currentPage, pageSize);
  }, [debouncedSearchQuery, debouncedCategoryFilter, currentPage, pageSize]);

  const totalStock = useMemo(
    () => products.reduce((sum, product) => sum + product.stockLevel, 0),
    [products]
  );

  const inventoryValue = useMemo(
    () => products.reduce((sum, product) => sum + product.retailPrice * product.stockLevel, 0),
    [products]
  );

  const dailyProfit = useMemo(
    () => products.reduce((sum, product) => sum + (product.retailPrice - product.costPrice) * 2, 0),
    [products]
  );

  const handleAddProductChange = (field: keyof AddProductForm, value: string) => {
    setAddProductForm((current) => ({ ...current, [field]: value }));
  };

  const resetAddProductForm = () => {
    setAddProductForm({
      name: '',
      category: '',
      stockLevel: '',
      retailPrice: '',
      costPrice: '',
      image: '',
    });
  };

  const handleAddProduct = async () => {
    if (
      !addProductForm.name.trim() ||
      !addProductForm.category.trim() ||
      !addProductForm.stockLevel.trim() ||
      !addProductForm.retailPrice.trim() ||
      !addProductForm.costPrice.trim()
    ) {
      setAddProductError('All required fields must be filled');
      return;
    }

    const stockLevel = Number(addProductForm.stockLevel);
    const retailPrice = Number(addProductForm.retailPrice);
    const costPrice = Number(addProductForm.costPrice);

    if (
      Number.isNaN(stockLevel) ||
      Number.isNaN(retailPrice) ||
      Number.isNaN(costPrice) ||
      stockLevel < 0 ||
      retailPrice <= 0 ||
      costPrice <= 0
    ) {
      setAddProductError('Stock/price values are invalid');
      return;
    }

    try {
      setAddProductError('');

      await apiClient.post('/products', {
        name: addProductForm.name.trim(),
        category: addProductForm.category.trim(),
        stockLevel,
        retailPrice,
        costPrice,
        image: addProductForm.image.trim() || undefined,
      });

      toast.success(`Product "${addProductForm.name}" added successfully!`);
      setIsAddProductOpen(false);
      resetAddProductForm();
      setCurrentPage(1);
      productCacheRef.current.clear();
      await loadProducts(debouncedSearchQuery, debouncedCategoryFilter, 1, pageSize);
    } catch (error: any) {
      const message = error?.response?.data?.message ?? 'Failed to add product';
      setAddProductError(message);
      toast.error(message);
    }
  };

  const handleFlushProducts = async () => {
    try {
      setFlushError('');

      await apiClient.delete('/products/flush', {
        data: {
          password: flushPassword,
        },
      });

      toast.success('All products have been deleted successfully!');
      setFlushPassword('');
      setIsFlushOpen(false);
      setCurrentPage(1);
      productCacheRef.current.clear();
      await loadProducts(debouncedSearchQuery, debouncedCategoryFilter, 1, pageSize);
    } catch (error: any) {
      const message = error?.response?.data?.message ?? 'Failed to flush products';
      setFlushError(message);
      toast.error(message);
    }
  };

  return (
    <>
      <Header
        userRole={userRole}
        onRoleChange={onRoleChange}
        canChangeRole={canChangeRole}
        searchExpanded={searchExpanded}
        onSearchExpandedChange={setSearchExpanded}
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
      />

      <section className="space-y-6 p-6">
        <div className="flex flex-wrap items-center gap-3">
          <Input
            placeholder="Filter by category"
            value={categoryFilter}
            onChange={(event) => setCategoryFilter(event.target.value)}
            className="max-w-xs"
          />

          <Button onClick={() => setIsAddProductOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Product
          </Button>

          {canUseAdminFeatures && (
            <Button
              variant="outline"
              onClick={() => setIsFlushOpen(true)}
              className="border-red-200 text-red-600 hover:bg-red-50"
            >
              Flush All Products
            </Button>
          )}

          {loadingProducts && <p className="text-sm text-gray-500">Loading products...</p>}
          {productError && <p className="text-sm text-red-600">{productError}</p>}
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-[12px] border border-[#f1f5f9] bg-white p-4 shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
            <p className="text-sm text-gray-500">Total Products</p>
            <p className="mt-1 text-2xl font-semibold text-gray-900">{totalProductsCount}</p>
          </div>
          <div className="rounded-[12px] border border-[#f1f5f9] bg-white p-4 shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
            <p className="text-sm text-gray-500">Total Stock</p>
            <p className="mt-1 text-2xl font-semibold text-gray-900">{totalStock}</p>
          </div>
          {userRole === 'Admin' && (
            <div className="rounded-[12px] border border-[#f1f5f9] bg-white p-4 shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
              <p className="text-sm text-gray-500">Daily Profit</p>
              <p className="mt-1 text-2xl font-semibold text-gray-900">${dailyProfit.toFixed(2)}</p>
            </div>
          )}
        </div>

        {canUseAdminFeatures && (
          <div className="rounded-[12px] border border-[#f1f5f9] bg-white p-4 shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
            <p className="text-sm text-gray-500">Inventory Retail Value</p>
            <p className="mt-1 text-2xl font-semibold text-gray-900">${inventoryValue.toFixed(2)}</p>
          </div>
        )}

        <ProductTable products={products} userRole={userRole} canExportCsv={canUseAdminFeatures} />

        <div className="flex flex-wrap items-center justify-between gap-3 rounded-[12px] border border-[#f1f5f9] bg-white px-4 py-3 shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
          <p className="text-sm text-gray-600">
            Showing{' '}
            {totalProductsCount === 0 ? 0 : (currentPage - 1) * pageSize + 1}
            {' '}-{' '}
            {Math.min(currentPage * pageSize, totalProductsCount)} of {totalProductsCount}
          </p>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              disabled={currentPage === 1 || loadingProducts}
            >
              Previous
            </Button>
            <span className="text-sm text-gray-600">
              Page {currentPage} / {totalPages}
            </span>
            <Button
              variant="outline"
              onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
              disabled={currentPage >= totalPages || loadingProducts}
            >
              Next
            </Button>
          </div>
        </div>
      </section>

      <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Product</DialogTitle>
            <DialogDescription>Create a new product in inventory.</DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <div className="space-y-1">
              <Label htmlFor="product-name">Product Name</Label>
              <Input
                id="product-name"
                value={addProductForm.name}
                onChange={(event) => handleAddProductChange('name', event.target.value)}
                placeholder="Product name"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="product-category">Category</Label>
              <Input
                id="product-category"
                value={addProductForm.category}
                onChange={(event) => handleAddProductChange('category', event.target.value)}
                placeholder="Category"
              />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="space-y-1">
                <Label htmlFor="product-stock">Stock</Label>
                <Input
                  id="product-stock"
                  type="number"
                  min={0}
                  value={addProductForm.stockLevel}
                  onChange={(event) => handleAddProductChange('stockLevel', event.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="product-retail">Retail Price</Label>
                <Input
                  id="product-retail"
                  type="number"
                  min={0}
                  step="0.01"
                  value={addProductForm.retailPrice}
                  onChange={(event) => handleAddProductChange('retailPrice', event.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="product-cost">Cost Price</Label>
                <Input
                  id="product-cost"
                  type="number"
                  min={0}
                  step="0.01"
                  value={addProductForm.costPrice}
                  onChange={(event) => handleAddProductChange('costPrice', event.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="product-image">Image URL (optional)</Label>
              <Input
                id="product-image"
                value={addProductForm.image}
                onChange={(event) => handleAddProductChange('image', event.target.value)}
                placeholder="https://..."
              />
            </div>

            {addProductError && <p className="text-sm text-red-600">{addProductError}</p>}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddProductOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddProduct}>Save Product</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isFlushOpen} onOpenChange={setIsFlushOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Flush Product Data</DialogTitle>
            <DialogDescription>
              This will permanently delete all product items. Enter admin flush password.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <Label htmlFor="flush-password">Password</Label>
            <Input
              id="flush-password"
              type="password"
              value={flushPassword}
              onChange={(event) => setFlushPassword(event.target.value)}
              placeholder="Enter flush password"
            />
            {flushError && <p className="text-sm text-red-600">{flushError}</p>}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsFlushOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-red-600 hover:bg-red-700" onClick={handleFlushProducts}>
              Delete All
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
