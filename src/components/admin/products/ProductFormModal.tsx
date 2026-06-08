'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Upload, Star, ImageIcon } from 'lucide-react';
import AvailabilityToggle from './AvailabilityToggle';
import type { AdminProduct, AdminProductCategory } from '@/types/admin.types';

interface ProductFormModalProps {
  product?: AdminProduct | null;    // null = Add mode
  onSave: (product: Omit<AdminProduct, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}

const EMPTY_FORM = {
  name: '',
  description: '',
  price: '',
  category: 'coffee' as AdminProductCategory,
  imageUrl: '',
  isAvailable: true,
  isFeatured: false,
};

export default function ProductFormModal({ product, onSave, onCancel }: ProductFormModalProps) {
  const isEdit = Boolean(product);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [previewUrl, setPreviewUrl] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isDragging, setIsDragging] = useState(false);

  // Populate form when editing
  useEffect(() => {
    if (product) {
      setForm({
        name: product.name,
        description: product.description,
        price: String(product.price),
        category: product.category,
        imageUrl: product.imageUrl,
        isAvailable: product.isAvailable,
        isFeatured: product.isFeatured,
      });
      setPreviewUrl(product.imageUrl);
    } else {
      setForm({ ...EMPTY_FORM });
      setPreviewUrl('');
    }
  }, [product]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = 'Product name is required.';
    if (!form.description.trim()) errs.description = 'Description is required.';
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0)
      errs.price = 'Enter a valid price.';
    return errs;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    onSave({
      name: form.name.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      category: form.category,
      imageUrl: previewUrl || form.imageUrl || '/images/placeholder.png',
      isAvailable: form.isAvailable,
      isFeatured: form.isFeatured,
    });
  };

  const handleImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setForm((f) => ({ ...f, imageUrl: file.name }));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleImageFile(file);
  };

  const set = (key: keyof typeof EMPTY_FORM) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setErrors((er) => { const n = { ...er }; delete n[key]; return n; });
  };

  // Shared input style
  const inputStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(184,149,106,0.2)',
    color: '#EDE3D0',
    fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
    borderRadius: '0.75rem',
    padding: '0.75rem 1rem',
    width: '100%',
    fontSize: '0.875rem',
    outline: 'none',
    transition: 'border-color 0.2s, background 0.2s',
  };
  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '0.6875rem',
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    color: 'rgba(237,227,208,0.5)',
    fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
    marginBottom: '0.5rem',
  };
  const errorStyle: React.CSSProperties = {
    fontSize: '0.75rem',
    color: '#f87171',
    fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
    marginTop: '0.375rem',
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-end sm:items-center sm:justify-center px-0 sm:px-4 py-0 sm:py-6 overflow-y-auto"
      style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(6px)' }}
      onClick={onCancel}
    >
      <div
        className="w-full sm:max-w-xl rounded-none sm:rounded-2xl relative flex flex-col"
        style={{
          background: '#1a1410',
          border: '1px solid rgba(184,149,106,0.2)',
          boxShadow: '0 32px 80px rgba(0,0,0,0.7)',
          animation: 'scaleIn 0.2s ease',
          maxHeight: '100dvh',
          overflowY: 'auto',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-5 sticky top-0 z-10 border-b"
          style={{ background: '#1a1410', borderColor: 'rgba(184,149,106,0.15)' }}
        >
          <div>
            <h2
              className="text-lg font-semibold"
              style={{ color: '#EDE3D0', fontFamily: 'Georgia, serif' }}
            >
              {isEdit ? 'Edit Product' : 'Add New Product'}
            </h2>
            <p
              className="text-xs mt-0.5"
              style={{ color: 'rgba(237,227,208,0.35)', fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
            >
              {isEdit ? 'Update product details below.' : 'Fill in the details to add a new product.'}
            </p>
          </div>
          <button
            onClick={onCancel}
            className="p-2 rounded-lg transition-colors flex-shrink-0"
            style={{ color: 'rgba(237,227,208,0.4)' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = '#EDE3D0'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'rgba(237,227,208,0.4)'; }}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-6 space-y-5">
          {/* Image upload */}
          <div>
            <label style={labelStyle}>Product Image</label>
            <div
              className="relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed cursor-pointer transition-all duration-200"
              style={{
                minHeight: '140px',
                borderColor: isDragging ? '#B8956A' : 'rgba(184,149,106,0.25)',
                background: isDragging ? 'rgba(184,149,106,0.06)' : 'rgba(255,255,255,0.02)',
              }}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              {previewUrl ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-36 object-cover rounded-xl"
                    onError={() => setPreviewUrl('')}
                  />
                  <div
                    className="absolute inset-0 flex items-center justify-center rounded-xl opacity-0 hover:opacity-100 transition-opacity"
                    style={{ background: 'rgba(0,0,0,0.5)' }}
                  >
                    <p className="text-xs text-white font-medium">Click to change</p>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center gap-2 py-8 pointer-events-none">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ background: 'rgba(184,149,106,0.1)', color: '#B8956A' }}
                  >
                    {isDragging ? <Upload size={20} /> : <ImageIcon size={20} />}
                  </div>
                  <p
                    className="text-sm font-medium"
                    style={{ color: 'rgba(237,227,208,0.6)', fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
                  >
                    {isDragging ? 'Drop to upload' : 'Click or drag image here'}
                  </p>
                  <p
                    className="text-xs"
                    style={{ color: 'rgba(237,227,208,0.25)', fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
                  >
                    PNG, JPG, WebP
                  </p>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImageFile(f); }}
              />
            </div>
          </div>

          {/* Name */}
          <div>
            <label htmlFor="pf-name" style={labelStyle}>Product Name *</label>
            <input
              id="pf-name"
              type="text"
              value={form.name}
              onChange={set('name')}
              placeholder="e.g. Noir Latte"
              style={inputStyle}
              onFocus={(e) => { e.target.style.borderColor = 'rgba(184,149,106,0.6)'; }}
              onBlur={(e) => { e.target.style.borderColor = 'rgba(184,149,106,0.2)'; }}
            />
            {errors.name && <p style={errorStyle}>{errors.name}</p>}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="pf-desc" style={labelStyle}>Description *</label>
            <textarea
              id="pf-desc"
              value={form.description}
              onChange={set('description')}
              placeholder="A short, compelling product description…"
              rows={3}
              style={{ ...inputStyle, resize: 'none' }}
              onFocus={(e) => { e.target.style.borderColor = 'rgba(184,149,106,0.6)'; }}
              onBlur={(e) => { e.target.style.borderColor = 'rgba(184,149,106,0.2)'; }}
            />
            {errors.description && <p style={errorStyle}>{errors.description}</p>}
          </div>

          {/* Category + Price */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="pf-category" style={labelStyle}>Category</label>
              <select
                id="pf-category"
                value={form.category}
                onChange={set('category')}
                style={{ ...inputStyle, cursor: 'pointer' }}
                onFocus={(e) => { e.target.style.borderColor = 'rgba(184,149,106,0.6)'; }}
                onBlur={(e) => { e.target.style.borderColor = 'rgba(184,149,106,0.2)'; }}
              >
                <option value="coffee" style={{ background: '#1a1410' }}>☕ Coffee</option>
                <option value="dessert" style={{ background: '#1a1410' }}>🍰 Dessert</option>
              </select>
            </div>
            <div>
              <label htmlFor="pf-price" style={labelStyle}>Price (₹) *</label>
              <input
                id="pf-price"
                type="number"
                min="0"
                step="10"
                value={form.price}
                onChange={set('price')}
                placeholder="380"
                style={inputStyle}
                onFocus={(e) => { e.target.style.borderColor = 'rgba(184,149,106,0.6)'; }}
                onBlur={(e) => { e.target.style.borderColor = 'rgba(184,149,106,0.2)'; }}
              />
              {errors.price && <p style={errorStyle}>{errors.price}</p>}
            </div>
          </div>

          {/* Toggles */}
          <div
            className="grid grid-cols-2 gap-4 p-4 rounded-xl"
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(184,149,106,0.12)' }}
          >
            <div>
              <label style={{ ...labelStyle, marginBottom: '0.5rem' }}>Availability</label>
              <AvailabilityToggle
                checked={form.isAvailable}
                onChange={(v) => setForm((f) => ({ ...f, isAvailable: v }))}
              />
            </div>
            <div>
              <label style={{ ...labelStyle, marginBottom: '0.5rem' }}>Featured</label>
              <button
                type="button"
                onClick={() => setForm((f) => ({ ...f, isFeatured: !f.isFeatured }))}
                className="flex items-center gap-2"
              >
                <Star
                  size={18}
                  fill={form.isFeatured ? '#B8956A' : 'none'}
                  style={{ color: form.isFeatured ? '#B8956A' : 'rgba(237,227,208,0.3)', transition: 'all 0.2s' }}
                />
                <span
                  className="text-xs font-medium"
                  style={{
                    color: form.isFeatured ? '#B8956A' : 'rgba(237,227,208,0.4)',
                    fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
                    transition: 'color 0.2s',
                  }}
                >
                  {form.isFeatured ? 'Featured' : 'Not Featured'}
                </span>
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-3 rounded-xl text-sm font-medium transition-all duration-200"
              style={{
                background: 'rgba(237,227,208,0.06)',
                border: '1px solid rgba(237,227,208,0.12)',
                color: 'rgba(237,227,208,0.7)',
                fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = 'rgba(237,227,208,0.1)';
                (e.currentTarget as HTMLElement).style.color = '#EDE3D0';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = 'rgba(237,227,208,0.06)';
                (e.currentTarget as HTMLElement).style.color = 'rgba(237,227,208,0.7)';
              }}
            >
              Cancel
            </button>
            <button
              id="product-form-save"
              type="submit"
              className="flex-1 py-3 rounded-xl text-sm font-semibold tracking-[0.08em] transition-all duration-200"
              style={{
                background: '#B8956A',
                color: '#15110D',
                fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = '#EDE3D0'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = '#B8956A'; }}
            >
              {isEdit ? 'Update Product' : 'Save Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
