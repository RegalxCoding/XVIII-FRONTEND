// ─────────────────────────────────────────
// Product Types
// ─────────────────────────────────────────

export type ProductCategory = 'coffee' | 'dessert' | 'signature';

export interface Product {
  $id: string;
  name: string;
  description: string;
  price: number;
  category: ProductCategory;
  imageUrl: string;
  isAvailable: boolean;
  isBestSeller: boolean;
  tags: string[];
  createdAt: string;
}

export interface ProductFilters {
  category?: ProductCategory;
  isBestSeller?: boolean;
  isAvailable?: boolean;
  limit?: number;
}
