'use client';

import { useState } from 'react';
import { Pencil, Trash2, Plus, Coffee, Cake, Search } from 'lucide-react';
import Image from 'next/image';
import AvailabilityToggle from './AvailabilityToggle';
import ProductFormModal from './ProductFormModal';
import DeleteConfirmModal from './DeleteConfirmModal';
import type { AdminProduct } from '@/types/admin.types';

interface ProductsTableProps {
  initialProducts: AdminProduct[];
}

type FilterCategory = 'all' | 'coffee' | 'dessert';

export default function ProductsTable({ initialProducts }: ProductsTableProps) {
  const [products, setProducts] = useState<AdminProduct[]>(initialProducts);
  const [filter, setFilter] = useState<FilterCategory>('all');
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editProduct, setEditProduct] = useState<AdminProduct | null>(null);
  const [deleteProduct, setDeleteProduct] = useState<AdminProduct | null>(null);

  // Filtered + searched products
  const filtered = products.filter((p) => {
    const matchCat = filter === 'all' || p.category === filter;
    const matchSearch =
      !search || p.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleSave = (data: Omit<AdminProduct, 'id' | 'createdAt'>) => {
    if (editProduct) {
      setProducts((prev) =>
        prev.map((p) => (p.id === editProduct.id ? { ...p, ...data } : p))
      );
      setEditProduct(null);
    } else {
      const newProduct: AdminProduct = {
        ...data,
        id: `product-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      setProducts((prev) => [newProduct, ...prev]);
      setShowAddModal(false);
    }
  };

  const handleDelete = () => {
    if (!deleteProduct) return;
    setProducts((prev) => prev.filter((p) => p.id !== deleteProduct.id));
    setDeleteProduct(null);
  };

  const handleToggleAvailability = (id: string, val: boolean) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, isAvailable: val } : p)));
  };

  const filterTabs: { key: FilterCategory; label: string; icon: React.ReactNode }[] = [
    { key: 'all', label: 'All', icon: null },
    { key: 'coffee', label: 'Coffee', icon: <Coffee size={13} /> },
    { key: 'dessert', label: 'Desserts', icon: <Cake size={13} /> },
  ];

  return (
    <>
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
        {/* Filter tabs */}
        <div
          className="flex gap-1 p-1 rounded-xl flex-shrink-0"
          style={{ background: 'rgba(26,20,14,0.8)', border: '1px solid rgba(184,149,106,0.15)' }}
        >
          {filterTabs.map((tab) => {
            const active = filter === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium tracking-[0.05em] transition-all duration-200"
                style={{
                  background: active ? '#B8956A' : 'transparent',
                  color: active ? '#15110D' : 'rgba(237,227,208,0.5)',
                  fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
                }}
              >
                {tab.icon}
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative flex-1">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'rgba(184,149,106,0.5)' }}>
            <Search size={15} />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products…"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none transition-all duration-200"
            style={{
              background: 'rgba(26,20,14,0.8)',
              border: '1px solid rgba(184,149,106,0.15)',
              color: '#EDE3D0',
              fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
            }}
            onFocus={(e) => { e.target.style.borderColor = 'rgba(184,149,106,0.5)'; }}
            onBlur={(e) => { e.target.style.borderColor = 'rgba(184,149,106,0.15)'; }}
          />
        </div>

        {/* Add button */}
        <button
          id="add-product-btn"
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 flex-shrink-0"
          style={{
            background: '#B8956A',
            color: '#15110D',
            fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = '#EDE3D0'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = '#B8956A'; }}
        >
          <Plus size={16} strokeWidth={2.5} />
          Add Product
        </button>
      </div>

      {/* Table */}
      <div
        className="rounded-2xl border overflow-hidden"
        style={{ borderColor: 'rgba(184,149,106,0.15)', background: 'rgba(26,20,14,0.6)' }}
      >
        {/* Header row */}
        <div
          className="hidden md:grid px-6 py-3.5 border-b text-[10px] tracking-[0.2em] uppercase"
          style={{
            gridTemplateColumns: '56px 1fr 120px 100px 160px 120px',
            color: 'rgba(237,227,208,0.3)',
            fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
            borderColor: 'rgba(184,149,106,0.1)',
          }}
        >
          <span>Image</span>
          <span>Name</span>
          <span>Category</span>
          <span>Price</span>
          <span>Availability</span>
          <span className="text-right">Actions</span>
        </div>

        {/* Rows */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
              style={{ background: 'rgba(184,149,106,0.08)', color: 'rgba(184,149,106,0.4)' }}
            >
              <Coffee size={24} />
            </div>
            <p
              className="text-sm"
              style={{ color: 'rgba(237,227,208,0.35)', fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
            >
              No products found.
            </p>
          </div>
        ) : (
          filtered.map((product, idx) => (
            <div
              key={product.id}
              className="flex flex-col md:grid px-6 py-4 items-start md:items-center gap-3 md:gap-0 transition-colors duration-150"
              style={{
                gridTemplateColumns: '56px 1fr 120px 100px 160px 120px',
                borderBottom: idx < filtered.length - 1 ? '1px solid rgba(184,149,106,0.08)' : 'none',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(184,149,106,0.03)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
            >
              {/* Image */}
              <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0" style={{ background: 'rgba(184,149,106,0.1)' }}>
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  width={48}
                  height={48}
                  className="w-full h-full object-cover"
                  onError={() => {}}
                  unoptimized
                />
              </div>

              {/* Name + desc */}
              <div className="min-w-0 md:pr-4">
                <div className="flex items-center gap-2">
                  <p
                    className="text-sm font-semibold truncate"
                    style={{ color: '#EDE3D0', fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
                  >
                    {product.name}
                  </p>
                  {product.isFeatured && (
                    <span
                      className="flex-shrink-0 text-[9px] px-1.5 py-0.5 rounded-full font-semibold tracking-[0.1em] uppercase"
                      style={{ background: 'rgba(184,149,106,0.15)', color: '#B8956A' }}
                    >
                      Featured
                    </span>
                  )}
                </div>
                <p
                  className="text-xs mt-0.5 truncate"
                  style={{ color: 'rgba(237,227,208,0.35)', fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif', maxWidth: '280px' }}
                >
                  {product.description}
                </p>
              </div>

              {/* Category */}
              <div>
                <span
                  className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full"
                  style={{
                    background: product.category === 'coffee' ? 'rgba(184,149,106,0.12)' : 'rgba(192,132,252,0.12)',
                    color: product.category === 'coffee' ? '#B8956A' : '#c084fc',
                    fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
                  }}
                >
                  {product.category === 'coffee' ? <Coffee size={11} /> : <Cake size={11} />}
                  {product.category === 'coffee' ? 'Coffee' : 'Dessert'}
                </span>
              </div>

              {/* Price */}
              <p
                className="text-sm font-semibold"
                style={{ color: '#EDE3D0', fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
              >
                ₹{product.price}
              </p>

              {/* Availability toggle */}
              <div>
                <AvailabilityToggle
                  checked={product.isAvailable}
                  onChange={(v) => handleToggleAvailability(product.id, v)}
                  size="sm"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-start md:justify-end gap-2">
                <button
                  onClick={() => setEditProduct(product)}
                  className="p-2 rounded-lg transition-all duration-200"
                  style={{ color: 'rgba(237,227,208,0.4)', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(184,149,106,0.15)' }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.color = '#B8956A';
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(184,149,106,0.4)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.color = 'rgba(237,227,208,0.4)';
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(184,149,106,0.15)';
                  }}
                  aria-label={`Edit ${product.name}`}
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={() => setDeleteProduct(product)}
                  className="p-2 rounded-lg transition-all duration-200"
                  style={{ color: 'rgba(248,113,113,0.5)', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(248,113,113,0.15)' }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.color = '#f87171';
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(248,113,113,0.4)';
                    (e.currentTarget as HTMLElement).style.background = 'rgba(248,113,113,0.08)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.color = 'rgba(248,113,113,0.5)';
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(248,113,113,0.15)';
                    (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)';
                  }}
                  aria-label={`Delete ${product.name}`}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Count */}
      <p
        className="mt-3 text-xs"
        style={{ color: 'rgba(237,227,208,0.25)', fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
      >
        Showing {filtered.length} of {products.length} products
      </p>

      {/* Modals */}
      {(showAddModal || editProduct) && (
        <ProductFormModal
          product={editProduct}
          onSave={handleSave}
          onCancel={() => { setShowAddModal(false); setEditProduct(null); }}
        />
      )}
      {deleteProduct && (
        <DeleteConfirmModal
          productName={deleteProduct.name}
          onConfirm={handleDelete}
          onCancel={() => setDeleteProduct(null)}
        />
      )}
    </>
  );
}
