import { db } from '../firebase/config';
import {
  collection,
  query,
  where,
  getDocs,
  orderBy
} from 'firebase/firestore';
import { Item } from '../models/Item';

class StockService {
  constructor() {
    this.itemsCollection = collection(db, 'items');
  }

  // Get only available stock (quantity > 0) for a shop
  async getAvailableStock(shopName) {
    try {
      // Firestore doesn't support > 0 directly, so we'll get all items and filter
      // Or we can use >= 1 which is equivalent
      const q = query(
        this.itemsCollection,
        where('shopName', '==', shopName),
        where('quantity', '>=', 1),
        orderBy('quantity', 'desc')
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => Item.fromFirestore(doc));
    } catch (error) {
      console.error('Error getting available stock:', error);
      // Fallback: get all items and filter client-side
      try {
        const q = query(
          this.itemsCollection,
          where('shopName', '==', shopName)
        );
        const querySnapshot = await getDocs(q);
        const items = querySnapshot.docs.map(doc => Item.fromFirestore(doc));
        // Filter for available items (quantity > 0)
        return items.filter(item => item.quantity > 0).sort((a, b) => b.quantity - a.quantity);
      } catch (fallbackError) {
        console.error('Fallback query also failed:', fallbackError);
        throw fallbackError;
      }
    }
  }

  // Search available stock
  async searchAvailableStock(shopName, searchTerm) {
    try {
      const allAvailable = await this.getAvailableStock(shopName);
      const term = searchTerm.toLowerCase().trim();

      if (!term) {
        return allAvailable;
      }

      return allAvailable.filter(item =>
        (item.brand && item.brand.toLowerCase().includes(term)) ||
        (item.name && item.name.toLowerCase().includes(term)) ||
        (item.category && item.category.toLowerCase().includes(term)) ||
        (item.description && item.description.toLowerCase().includes(term))
      );
    } catch (error) {
      console.error('Error searching available stock:', error);
      throw error;
    }
  }
}

export const stockService = new StockService();

