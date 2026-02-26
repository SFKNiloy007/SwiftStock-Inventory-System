import { Download } from 'lucide-react';
import { mkConfig, generateCsv, download } from 'export-to-csv';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Product, UserRole } from './types';

type ProductTableProps = {
  products: Product[];
  userRole: UserRole;
  canExportCsv: boolean;
};

function getStockBadgeColor(stock: number) {
  if (stock < 15) return 'bg-red-100 text-red-700 border-red-200';
  if (stock < 50) return 'bg-yellow-100 text-yellow-700 border-yellow-200';
  return 'bg-green-100 text-green-700 border-green-200';
}

export function ProductTable({ products, userRole, canExportCsv }: ProductTableProps) {
  const handleExportCsv = () => {
    const csvConfig = mkConfig({ useKeysAsHeaders: true, filename: 'swiftstock-products' });

    const rows = products.map((product) => ({
      id: product.id,
      name: product.name,
      category: product.category,
      stockLevel: product.stockLevel,
      costPrice: product.costPrice,
      retailPrice: product.retailPrice,
    }));

    const csv = generateCsv(csvConfig)(rows);
    download(csvConfig)(csv);
  };

  return (
    <div className="overflow-hidden rounded-[12px] border border-[#f1f5f9] bg-white shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#f1f5f9] px-6 py-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Products</h2>
          <p className="mt-1 text-sm text-gray-500">
            {products.length} {products.length === 1 ? 'item' : 'items'} in inventory
          </p>
        </div>

        {canExportCsv && (
          <Button variant="outline" className="gap-2" onClick={handleExportCsv}>
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-[#f1f5f9] bg-[#f8fafc]">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Image</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Product Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Stock Level</th>
              {userRole === 'Admin' && (
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Cost Price</th>
              )}
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Retail Price</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f1f5f9] bg-white">
            {products.map((product, index) => (
              <tr
                key={product.id}
                className={`transition-colors hover:bg-blue-50/50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/40'}`}
              >
                <td className="whitespace-nowrap px-6 py-4">
                  <ImageWithFallback src={product.image} alt={product.name} className="h-12 w-12 rounded-md object-cover" />
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">{product.name}</td>
                <td className="whitespace-nowrap px-6 py-4">
                  <Badge variant="secondary" className="border-blue-200 bg-blue-50 text-blue-700">
                    {product.category}
                  </Badge>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={getStockBadgeColor(product.stockLevel)}>
                      {product.stockLevel} units
                    </Badge>
                    {product.stockLevel < 15 && (
                      <Badge variant="outline" className="border-red-300 bg-red-100 text-red-700">
                        Low Stock
                      </Badge>
                    )}
                  </div>
                </td>
                {userRole === 'Admin' && (
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                    ${product.costPrice.toFixed(2)}
                  </td>
                )}
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                  ${product.retailPrice.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {products.length === 0 && (
        <div className="px-6 py-12 text-center text-gray-500">No products found matching your search.</div>
      )}
    </div>
  );
}
