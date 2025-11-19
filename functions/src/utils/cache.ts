// Firestore cache utilities for page caching

import * as admin from 'firebase-admin';
import { TeletextPage, PageCacheDocument } from '../types';

// Lazy initialization to avoid accessing firestore before admin.initializeApp()
const getFirestore = () => admin.firestore();
const getTimestamp = () => admin.firestore.Timestamp;

/**
 * Retrieves a cached page from Firestore if it exists and hasn't expired
 * @param pageId - The page ID to retrieve
 * @returns The cached page or null if not found or expired
 */
export async function getCachedPage(pageId: string): Promise<TeletextPage | null> {
  try {
    const cacheRef = getFirestore().collection('pages_cache').doc(pageId);
    const doc = await cacheRef.get();

    if (!doc.exists) {
      return null;
    }

    const data = doc.data() as PageCacheDocument;
    const now = getTimestamp().now();

    // Check if cache has expired
    if (data.expiresAt.toMillis() < now.toMillis()) {
      // Cache expired, delete and return null
      await cacheRef.delete();
      return null;
    }

    // Update access count
    await cacheRef.update({ 
      accessCount: admin.firestore.FieldValue.increment(1) 
    });

    // Update cache status in metadata
    const page = data.page;
    if (page.meta) {
      page.meta.cacheStatus = 'cached';
    }

    return page;
  } catch (error) {
    console.error('Error retrieving cached page:', error);
    return null;
  }
}

/**
 * Stores a page in Firestore cache with a TTL
 * @param pageId - The page ID to cache
 * @param page - The page data to cache
 * @param ttlSeconds - Time to live in seconds
 */
export async function setCachedPage(
  pageId: string,
  page: TeletextPage,
  ttlSeconds: number
): Promise<void> {
  try {
    const Timestamp = getTimestamp();
    const now = Timestamp.now();
    const expiresAt = Timestamp.fromMillis(
      now.toMillis() + ttlSeconds * 1000
    );

    const cacheData: PageCacheDocument = {
      pageId,
      page,
      source: page.meta?.source || 'unknown',
      cachedAt: now,
      expiresAt,
      accessCount: 0
    };

    await getFirestore().collection('pages_cache').doc(pageId).set(cacheData);
  } catch (error) {
    console.error('Error caching page:', error);
    // Don't throw - caching failure shouldn't break the request
  }
}

/**
 * Clears expired cache entries (can be called periodically)
 */
export async function clearExpiredCache(): Promise<number> {
  try {
    const now = getTimestamp().now();
    const expiredDocs = await getFirestore()
      .collection('pages_cache')
      .where('expiresAt', '<', now)
      .get();

    const batch = getFirestore().batch();
    expiredDocs.docs.forEach(doc => {
      batch.delete(doc.ref);
    });

    await batch.commit();
    return expiredDocs.size;
  } catch (error) {
    console.error('Error clearing expired cache:', error);
    return 0;
  }
}
