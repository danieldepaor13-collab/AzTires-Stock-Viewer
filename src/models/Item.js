export class Item {
  constructor(data = {}) {
    this.id = data.id || null;
    this.shopName = data.shopName || 'Az Tires';
    this.category = data.category || 'Tire';
    this.brand = data.brand || '';
    this.name = data.name || '';
    this.description = data.description || '';
    this.quantity = data.quantity || 0;
    this.sellingPrice = data.sellingPrice || 0.0;
    this.originalCost = data.originalCost || 0.0;
    this.createdAt = data.createdAt || Date.now();
    this.updatedAt = data.updatedAt || Date.now();
  }

  // Create from Firestore document
  static fromFirestore(doc) {
    const data = doc.data();
    return new Item({
      id: doc.id,
      ...data,
      createdAt: data.createdAt?.toMillis?.() || data.createdAt || Date.now(),
      updatedAt: data.updatedAt?.toMillis?.() || data.updatedAt || Date.now()
    });
  }
}

