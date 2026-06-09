import { 
  collection, 
  doc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy 
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL 
} from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { AdminProduct } from '@/types/admin.types';

export const adminProductsService = {
  /**
   * Fetch all products from Firestore, sorted by creation time (newest first)
   */
  async getAll(): Promise<AdminProduct[]> {
    const productsCol = collection(db, 'products');
    const q = query(productsCol, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name || '',
        description: data.description || '',
        price: data.price || 0,
        category: data.category || 'coffee',
        imageUrl: data.imageUrl || '',
        isAvailable: data.isAvailable !== false,
        isFeatured: !!data.isFeatured,
        createdAt: data.createdAt || new Date().toISOString(),
      } as AdminProduct;
    });
  },

  /**
   * Create a new product in Firestore. Uploads image to Storage if provided.
   */
  async create(data: Omit<AdminProduct, 'id' | 'createdAt'>, imageFile?: File): Promise<string> {
    let imageUrl = data.imageUrl;
    if (imageFile) {
      imageUrl = await this.uploadImage(imageFile);
    }
    const productsCol = collection(db, 'products');
    const docRef = await addDoc(productsCol, {
      ...data,
      imageUrl,
      createdAt: new Date().toISOString()
    });
    return docRef.id;
  },

  /**
   * Update an existing product in Firestore. Uploads new image to Storage if provided.
   */
  async update(id: string, data: Partial<Omit<AdminProduct, 'id'>>, imageFile?: File): Promise<void> {
    let imageUrl = data.imageUrl;
    if (imageFile) {
      imageUrl = await this.uploadImage(imageFile);
    }
    const docRef = doc(db, 'products', id);
    const updateData: any = { ...data };
    if (imageFile && imageUrl) {
      updateData.imageUrl = imageUrl;
    }
    await updateDoc(docRef, updateData);
  },

  /**
   * Delete a product from Firestore
   */
  async remove(id: string): Promise<void> {
    const docRef = doc(db, 'products', id);
    await deleteDoc(docRef);
  },

  /**
   * Toggle the availability status of a product
   */
  async toggleAvailability(id: string, isAvailable: boolean): Promise<void> {
    const docRef = doc(db, 'products', id);
    await updateDoc(docRef, { isAvailable });
  },

  /**
   * Upload an image to Firebase Storage and return its download URL
   */
  async uploadImage(file: File): Promise<string> {
    const fileExtension = file.name.split('.').pop() || 'jpg';
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExtension}`;
    const storageRef = ref(storage, `products/${fileName}`);
    const uploadResult = await uploadBytes(storageRef, file);
    return getDownloadURL(uploadResult.ref);
  }
};
