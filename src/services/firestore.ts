import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
} from 'firebase/firestore';
import { db } from '@/firebase/config';
import { Product, Category, Offer, Review, RestaurantSettings, Order, Visitor, VisitorLocation } from '@/types/models';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_OFFERS, INITIAL_REVIEWS, INITIAL_SETTINGS } from './mockData';

const isDemo = process.env.NEXT_PUBLIC_FIREBASE_API_KEY === 'demo-api-key';

// Helper to remove any undefined fields before writing to Firestore
function cleanUndefined<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(cleanUndefined) as any;
  const result: any = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      result[key] = cleanUndefined(value);
    }
  }
  return result;
}

// Helper to save fallback data in localStorage for demo mode
const getLocalState = <T>(key: string, defaultVal: T): T => {
  if (typeof window === 'undefined') return defaultVal;
  const stored = localStorage.getItem(`sizzle_${key}`);
  if (!stored) {
    localStorage.setItem(`sizzle_${key}`, JSON.stringify(defaultVal));
    return defaultVal;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return defaultVal;
  }
};

const setLocalState = <T>(key: string, val: T): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(`sizzle_${key}`, JSON.stringify(val));
};

// ---------------- PRODUCTS ----------------
export async function getProducts(): Promise<Product[]> {
  if (isDemo) {
    return getLocalState<Product[]>('products', INITIAL_PRODUCTS);
  }
  try {
    const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return INITIAL_PRODUCTS;
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Product));
  } catch (error) {
    console.warn('Firestore fetch error, using fallback:', error);
    return getLocalState<Product[]>('products', INITIAL_PRODUCTS);
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const products = await getProducts();
  return products.find((p) => p.slug === slug) || null;
}

export async function saveProduct(productData: Partial<Product>): Promise<Product> {
  if (isDemo) {
    const products = getLocalState<Product[]>('products', INITIAL_PRODUCTS);
    let updated: Product;
    if (productData.id) {
      const idx = products.findIndex((p) => p.id === productData.id);
      updated = { ...products[idx], ...productData, updatedAt: new Date().toISOString() } as Product;
      products[idx] = updated;
    } else {
      updated = {
        id: `prod-${Date.now()}`,
        name: productData.name || 'New Product',
        slug: productData.slug || `prod-${Date.now()}`,
        description: productData.description || '',
        category: productData.category || 'burgers',
        price: Number(productData.price) || 10,
        discountPercentage: Number(productData.discountPercentage) || 0,
        discountPrice: Number(productData.discountPrice) || Number(productData.price) || 10,
        currency: '$',
        rating: 5.0,
        totalReviews: 0,
        images: productData.images || ['https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80'],
        ingredients: productData.ingredients || [],
        preparationTime: productData.preparationTime || '15 min',
        isAvailable: productData.isAvailable ?? true,
        isPopular: productData.isPopular ?? false,
        isFeatured: productData.isFeatured ?? false,
        isRecommended: productData.isRecommended ?? false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      products.unshift(updated);
    }
    setLocalState('products', products);
    return updated;
  }

  const docId = productData.id || doc(collection(db, 'products')).id;
  const payload = {
    ...productData,
    id: docId,
    updatedAt: new Date().toISOString(),
  };
  await setDoc(doc(db, 'products', docId), cleanUndefined(payload), { merge: true });
  return payload as Product;
}

export async function deleteProduct(id: string): Promise<void> {
  if (isDemo) {
    const products = getLocalState<Product[]>('products', INITIAL_PRODUCTS);
    const filtered = products.filter((p) => p.id !== id);
    setLocalState('products', filtered);
    return;
  }
  await deleteDoc(doc(db, 'products', id));
}

// ---------------- CATEGORIES ----------------
export async function getCategories(): Promise<Category[]> {
  if (isDemo) {
    return getLocalState<Category[]>('categories', INITIAL_CATEGORIES);
  }
  try {
    const snapshot = await getDocs(collection(db, 'categories'));
    if (snapshot.empty) return INITIAL_CATEGORIES;
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Category));
  } catch (error) {
    console.warn('Firestore categories fetch error:', error);
    return getLocalState<Category[]>('categories', INITIAL_CATEGORIES);
  }
}

export async function saveCategory(categoryData: Partial<Category>): Promise<Category> {
  if (isDemo) {
    const categories = getLocalState<Category[]>('categories', INITIAL_CATEGORIES);
    let updated: Category;
    if (categoryData.id) {
      const idx = categories.findIndex((c) => c.id === categoryData.id);
      updated = { ...categories[idx], ...categoryData } as Category;
      categories[idx] = updated;
    } else {
      updated = {
        id: `cat-${Date.now()}`,
        name: categoryData.name || 'New Category',
        slug: categoryData.slug || `cat-${Date.now()}`,
        image: categoryData.image || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
        description: categoryData.description || '',
        itemCount: 0,
      };
      categories.push(updated);
    }
    setLocalState('categories', categories);
    return updated;
  }

  const docId = categoryData.id || doc(collection(db, 'categories')).id;
  const payload = { ...categoryData, id: docId };
  await setDoc(doc(db, 'categories', docId), cleanUndefined(payload), { merge: true });
  return payload as Category;
}

export async function deleteCategory(id: string): Promise<void> {
  if (isDemo) {
    const categories = getLocalState<Category[]>('categories', INITIAL_CATEGORIES);
    const filtered = categories.filter((c) => c.id !== id);
    setLocalState('categories', filtered);
    return;
  }
  await deleteDoc(doc(db, 'categories', id));
}

// ---------------- OFFERS ----------------
export async function getOffers(): Promise<Offer[]> {
  if (isDemo) {
    return getLocalState<Offer[]>('offers', INITIAL_OFFERS);
  }
  try {
    const snapshot = await getDocs(collection(db, 'offers'));
    if (snapshot.empty) return INITIAL_OFFERS;
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Offer));
  } catch (error) {
    return getLocalState<Offer[]>('offers', INITIAL_OFFERS);
  }
}

export async function saveOffer(offerData: Partial<Offer>): Promise<Offer> {
  if (isDemo) {
    const offers = getLocalState<Offer[]>('offers', INITIAL_OFFERS);
    let updated: Offer;
    if (offerData.id) {
      const idx = offers.findIndex((o) => o.id === offerData.id);
      updated = { ...offers[idx], ...offerData } as Offer;
      offers[idx] = updated;
    } else {
      updated = {
        id: `offer-${Date.now()}`,
        title: offerData.title || 'Special Deal',
        code: offerData.code || 'PROMO',
        description: offerData.description || '',
        discountPercentage: offerData.discountPercentage || 10,
        validUntil: offerData.validUntil || '2026-12-31',
        bannerUrl: offerData.bannerUrl || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80',
        isAvailable: offerData.isAvailable ?? true,
      };
      offers.push(updated);
    }
    setLocalState('offers', offers);
    return updated;
  }

  const docId = offerData.id || doc(collection(db, 'offers')).id;
  const payload = { ...offerData, id: docId };
  await setDoc(doc(db, 'offers', docId), cleanUndefined(payload), { merge: true });
  return payload as Offer;
}

export async function deleteOffer(id: string): Promise<void> {
  if (isDemo) {
    const offers = getLocalState<Offer[]>('offers', INITIAL_OFFERS);
    setLocalState('offers', offers.filter((o) => o.id !== id));
    return;
  }
  await deleteDoc(doc(db, 'offers', id));
}

// ---------------- REVIEWS ----------------
export async function getReviews(): Promise<Review[]> {
  if (isDemo) {
    return getLocalState<Review[]>('reviews', INITIAL_REVIEWS);
  }
  try {
    const snapshot = await getDocs(collection(db, 'reviews'));
    if (snapshot.empty) return INITIAL_REVIEWS;
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Review));
  } catch (error) {
    return getLocalState<Review[]>('reviews', INITIAL_REVIEWS);
  }
}

export async function submitReview(reviewData: Omit<Review, 'id' | 'createdAt' | 'isApproved'>): Promise<Review> {
  const newReview: Review = {
    ...reviewData,
    id: `rev-${Date.now()}`,
    isApproved: false, // Requires admin moderation
    createdAt: new Date().toISOString(),
  };

  if (isDemo) {
    const reviews = getLocalState<Review[]>('reviews', INITIAL_REVIEWS);
    reviews.unshift(newReview);
    setLocalState('reviews', reviews);
    return newReview;
  }

  await setDoc(doc(db, 'reviews', newReview.id), cleanUndefined(newReview));
  return newReview;
}

export async function updateReviewStatus(id: string, isApproved: boolean): Promise<void> {
  if (isDemo) {
    const reviews = getLocalState<Review[]>('reviews', INITIAL_REVIEWS);
    const idx = reviews.findIndex((r) => r.id === id);
    if (idx !== -1) {
      reviews[idx].isApproved = isApproved;
      setLocalState('reviews', reviews);
    }
    return;
  }
  await updateDoc(doc(db, 'reviews', id), { isApproved });
}

// ---------------- ORDERS ----------------
export async function getOrders(): Promise<Order[]> {
  if (isDemo) {
    return getLocalState<Order[]>('orders', []);
  }
  try {
    const snapshot = await getDocs(query(collection(db, 'orders'), orderBy('createdAt', 'desc')));
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Order));
  } catch (error) {
    return getLocalState<Order[]>('orders', []);
  }
}

export async function saveOrderRecord(order: Order): Promise<void> {
  // Save locally as backup
  const orders = getLocalState<Order[]>('orders', []);
  orders.unshift(order);
  setLocalState('orders', orders);

  try {
    await setDoc(doc(db, 'orders', order.id), cleanUndefined(order), { merge: true });
  } catch (err) {
    console.warn('Firestore order save note:', err);
  }
}

export async function updateOrderStatus(orderId: string, status: Order['status']): Promise<void> {
  if (isDemo) {
    const orders = getLocalState<Order[]>('orders', []);
    const idx = orders.findIndex((o) => o.id === orderId);
    if (idx !== -1) {
      orders[idx].status = status;
      setLocalState('orders', orders);
    }
    return;
  }
  await updateDoc(doc(db, 'orders', orderId), { status });
}

// ---------------- RESTAURANT SETTINGS ----------------
export async function getRestaurantSettings(): Promise<RestaurantSettings> {
  if (isDemo) {
    return getLocalState<RestaurantSettings>('settings', INITIAL_SETTINGS);
  }
  try {
    const docRef = doc(db, 'settings', 'general');
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      return snapshot.data() as RestaurantSettings;
    }
    return INITIAL_SETTINGS;
  } catch (error) {
    return getLocalState<RestaurantSettings>('settings', INITIAL_SETTINGS);
  }
}

export async function updateRestaurantSettings(settings: RestaurantSettings): Promise<void> {
  if (isDemo) {
    setLocalState('settings', settings);
    return;
  }
  await setDoc(doc(db, 'settings', 'general'), cleanUndefined(settings), { merge: true });
}

// ---------------- TIMESTAMP FORMATTER ----------------
export function getFormattedTimestamps(dateInput?: Date | number | string) {
  const date = dateInput ? new Date(dateInput) : new Date();

  // Format Canada time reference: e.g. "24 July 2026 11:05 AM"
  const day = date.toLocaleString('en-US', { day: '2-digit', timeZone: 'America/Toronto' });
  const month = date.toLocaleString('en-US', { month: 'long', timeZone: 'America/Toronto' });
  const year = date.toLocaleString('en-US', { year: 'numeric', timeZone: 'America/Toronto' });
  const time = date.toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'America/Toronto' });
  const canadaTime = `${day} ${month} ${year} ${time}`;

  // Format UTC time reference: e.g. "24 July 2026 03:05 PM UTC"
  const utcDay = date.toLocaleString('en-US', { day: '2-digit', timeZone: 'UTC' });
  const utcMonth = date.toLocaleString('en-US', { month: 'long', timeZone: 'UTC' });
  const utcYear = date.toLocaleString('en-US', { year: 'numeric', timeZone: 'UTC' });
  const utcTimeStr = date.toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'UTC' });
  const utcTime = `${utcDay} ${utcMonth} ${utcYear} ${utcTimeStr} UTC`;

  return {
    iso: date.toISOString(),
    canadaTime,
    utcTime,
  };
}

// ---------------- VISITOR ANALYTICS & PRECISE LOCATION ----------------
export async function updateVisitorRecord(visitorData: Partial<Visitor> & { visitorId: string }): Promise<void> {
  const visitorId = visitorData.visitorId;
  const now = getFormattedTimestamps();

  // Always update local storage cache for instant offline view
  const visitors = getLocalState<Record<string, Visitor>>('visitors', {});
  const existing = visitors[visitorId] || {
    visitorId,
    firstVisit: now.iso,
    firstVisitCanadaTime: now.canadaTime,
    firstVisitUtcTime: now.utcTime,
    lastVisit: now.iso,
    lastVisitCanadaTime: now.canadaTime,
    lastVisitUtcTime: now.utcTime,
    pageViews: 0,
  };

  const updatedRecord: Visitor = {
    ...existing,
    ...visitorData,
    lastVisit: now.iso,
    lastVisitCanadaTime: now.canadaTime,
    lastVisitUtcTime: now.utcTime,
    pageViews: (existing.pageViews || 0) + (visitorData.pageViews || 1),
  };

  if (visitorData.location) {
    const locTime = getFormattedTimestamps(visitorData.location.timestamp ? new Date(visitorData.location.timestamp) : new Date());
    updatedRecord.location = {
      ...visitorData.location,
      canadaTime: locTime.canadaTime,
      utcTime: locTime.utcTime,
    };
  }

  visitors[visitorId] = updatedRecord;
  setLocalState('visitors', visitors);

  // Directly attempt write to Firestore collection 'visitors', stripping any undefined keys
  try {
    const ref = doc(db, 'visitors', visitorId);
    const payload = cleanUndefined(updatedRecord);
    await setDoc(ref, payload, { merge: true });
    console.log('✅ Synchronized visitor record to Firebase Firestore visitors collection!');
  } catch (err) {
    console.warn('Firestore visitor write warning:', err);
  }
}

export async function saveVisitorPreciseLocation(visitorId: string, location: VisitorLocation): Promise<void> {
  const locTime = getFormattedTimestamps(location.timestamp ? new Date(location.timestamp) : new Date());
  await updateVisitorRecord({
    visitorId,
    location: {
      latitude: location.latitude,
      longitude: location.longitude,
      accuracy: location.accuracy,
      timestamp: location.timestamp || Date.now(),
      canadaTime: locTime.canadaTime,
      utcTime: locTime.utcTime,
    },
  });
}
