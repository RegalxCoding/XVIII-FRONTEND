import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  orderBy 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { MenuProduct, MenuCategory } from '@/data/menuData';
import type { Product, ProductFilters } from '@/types/product.types';

// Helper to map Firestore document data to Product type
export const mapFirestoreDocToProduct = (docId: string, data: any): Product => ({
  $id: docId,
  name: data.name || '',
  description: data.description || '',
  price: Number(data.price) || 0,
  category: (data.category || 'coffee') as Product['category'],
  imageUrl: data.imageUrl || '',
  isAvailable: data.isAvailable !== false,
  isBestSeller: !!data.isFeatured, // isFeatured in Firestore maps to isBestSeller
  tags: data.tags || [],
  createdAt: data.createdAt || new Date().toISOString(),
});

// Helper to map Product to MenuProduct type for frontend components compatibility
export const mapProductToMenuProduct = (p: Product): MenuProduct => ({
  id: p.$id,
  name: p.name,
  description: p.description,
  price: p.price,
  image: p.imageUrl,
  category: p.category as MenuCategory,
  available: p.isAvailable,
  featured: p.isBestSeller,
  stampReward: 1, // default reward stamp per item purchased
});

// ─────────────────────────────────────────
// Products Service (Firebase Firestore)
// ─────────────────────────────────────────

export const productsService = {
  /**
   * Get all products with optional filters
   */
  async getProducts(filters: ProductFilters = {}): Promise<Product[]> {
    const productsCol = collection(db, 'products');
    const q = query(productsCol, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    
    let list = snapshot.docs.map(doc => mapFirestoreDocToProduct(doc.id, doc.data()));

    // Apply filtering in memory to avoid complex Firestore composite index configuration
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
    const docRef = doc(db, 'products', id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      throw new Error('Product not found');
    }
    return mapFirestoreDocToProduct(docSnap.id, docSnap.data());
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
