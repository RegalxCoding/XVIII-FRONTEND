import { MENU_PRODUCTS, type MenuProduct } from '@/data/menuData';
import type { Product, ProductFilters } from '@/types/product.types';

// Helper to map MenuProduct to Product type
const mapMenuProductToProduct = (p: MenuProduct): Product => ({
  $id: p.id,
  name: p.name,
  description: p.description,
  price: p.price,
  category: p.category as Product['category'],
  imageUrl: p.image,
  isAvailable: p.available,
  isBestSeller: p.featured,
  tags: [],
  createdAt: new Date().toISOString(),
});

// ─────────────────────────────────────────
// Products Service (Mock/Local fallback)
// ─────────────────────────────────────────

export const productsService = {
  /**
   * Get all products with optional filters
   */
  async getProducts(filters: ProductFilters = {}): Promise<Product[]> {
    let list = MENU_PRODUCTS.map(mapMenuProductToProduct);

    if (filters.category) {
      list = list.filter((p) => p.category === filters.category);
    }
    if (filters.isBestSeller !== undefined) {
      list = list.filter((p) => p.isBestSeller === filters.isBestSeller);
    }
    if (filters.isAvailable !== undefined) {
      list = list.filter((p) => p.isAvailable === filters.isAvailable);
    }
    if (filters.limit) {
      list = list.slice(0, filters.limit);
    }

    return list;
  },

  /**
   * Get a single product by ID
   */
  async getProduct(id: string): Promise<Product> {
    const found = MENU_PRODUCTS.find((p) => p.id === id);
    if (!found) {
      throw new Error('Product not found');
    }
    return mapMenuProductToProduct(found);
  },

  /**
   * Get best sellers
   */
  async getBestSellers(limit = 6): Promise<Product[]> {
    return this.getProducts({ isBestSeller: true, isAvailable: true, limit });
  },

  /**
   * Get products by category
   */
  async getByCategory(category: Product['category']): Promise<Product[]> {
    return this.getProducts({ category, isAvailable: true });
  },
};
