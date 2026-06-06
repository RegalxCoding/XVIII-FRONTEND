import { databases, APPWRITE_CONFIG, Query } from '@/lib/appwrite';
import type { Product, ProductFilters } from '@/types/product.types';

// ─────────────────────────────────────────
// Products Service
// ─────────────────────────────────────────

export const productsService = {
  /**
   * Get all products with optional filters
   */
  async getProducts(filters: ProductFilters = {}): Promise<Product[]> {
    const queries: string[] = [];

    if (filters.category) {
      queries.push(Query.equal('category', filters.category));
    }
    if (filters.isBestSeller !== undefined) {
      queries.push(Query.equal('isBestSeller', filters.isBestSeller));
    }
    if (filters.isAvailable !== undefined) {
      queries.push(Query.equal('isAvailable', filters.isAvailable));
    }
    if (filters.limit) {
      queries.push(Query.limit(filters.limit));
    }

    const response = await databases.listDocuments(
      APPWRITE_CONFIG.databaseId,
      APPWRITE_CONFIG.collections.products,
      queries,
    );

    return response.documents as unknown as Product[];
  },

  /**
   * Get a single product by ID
   */
  async getProduct(id: string): Promise<Product> {
    const response = await databases.getDocument(
      APPWRITE_CONFIG.databaseId,
      APPWRITE_CONFIG.collections.products,
      id,
    );
    return response as unknown as Product;
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
