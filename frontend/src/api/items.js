import { apiRequest } from './client';
import { INITIAL_CATEGORIES, INITIAL_ITEMS } from '../data/mockFallback';

// Local storage cache keys for offline/fallback mode
const LOCAL_ITEMS_KEY = 'findit_local_items_v1';
const LOCAL_CLAIMS_KEY = 'findit_local_claims_v1';

export function getLocalItems() {
  try {
    const raw = localStorage.getItem(LOCAL_ITEMS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading local items', e);
  }
  return INITIAL_ITEMS;
}

export function saveLocalItems(items) {
  try {
    localStorage.setItem(LOCAL_ITEMS_KEY, JSON.stringify(items));
  } catch (e) {
    console.error('Error saving local items', e);
  }
}

export function getLocalClaims() {
  try {
    const raw = localStorage.getItem(LOCAL_CLAIMS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading local claims', e);
  }
  return [
    {
      id: 1,
      item: 101,
      item_title: 'AirPods case',
      claimant: 'Lisbon',
      message: 'I dropped my white airpods case right in front of the campus entrance gate on Monday morning.',
      status: 'pending',
      contact_email: 'lisbon@oxford.ac.uk',
      created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
    }
  ];
}

export function saveLocalClaims(claims) {
  try {
    localStorage.setItem(LOCAL_CLAIMS_KEY, JSON.stringify(claims));
  } catch (e) {
    console.error('Error saving local claims', e);
  }
}

/**
 * Fetch categories from backend or fallback to initial categories.
 */
export async function getCategories() {
  try {
    const data = await apiRequest('/api/categories/');
    if (Array.isArray(data) && data.length > 0) {
      return { data, isBackend: true };
    }
    return { data: INITIAL_CATEGORIES, isBackend: false };
  } catch {
    return { data: INITIAL_CATEGORIES, isBackend: false };
  }
}

/**
 * Fetch items list with query filters (kind, category, search, ordering).
 */
export async function getItems(params = {}) {
  const query = new URLSearchParams();
  if (params.kind && params.kind !== 'all') query.set('kind', params.kind);
  if (params.category) query.set('category', params.category);
  if (params.search) query.set('search', params.search);
  if (params.status) query.set('status', params.status);
  if (params.ordering) query.set('ordering', params.ordering);

  const qs = query.toString() ? `?${query.toString()}` : '';

  try {
    const res = await apiRequest(`/api/items/${qs}`);
    // Django DRF paginated response has { count, next, previous, results }
    const results = res.results || (Array.isArray(res) ? res : []);
    
    // Retrieve local items (recently added products saved locally)
    const localItems = getLocalItems();
    const backendTitles = new Set(results.map((r) => r.title?.toLowerCase().trim()));
    const unmergedLocal = localItems.filter(
      (item) => !backendTitles.has(item.title?.toLowerCase().trim())
    );

    // Apply active filters to unmerged local items
    let filteredLocal = unmergedLocal;
    if (params.kind && params.kind !== 'all') {
      filteredLocal = filteredLocal.filter((item) => item.kind === params.kind);
    }
    if (params.category) {
      filteredLocal = filteredLocal.filter((item) => String(item.category) === String(params.category));
    }
    if (params.search) {
      const q = params.search.toLowerCase();
      filteredLocal = filteredLocal.filter(
        (item) =>
          item.title?.toLowerCase().includes(q) ||
          item.description?.toLowerCase().includes(q) ||
          item.location?.toLowerCase().includes(q)
      );
    }

    // Combine local items first (most recently added) with backend items
    let combined = [...filteredLocal, ...results];

    // Fallback to initial items if completely empty and no search active
    if (combined.length === 0 && !params.search && (!params.kind || params.kind === 'all') && !params.category) {
      combined = INITIAL_ITEMS;
    }

    return {
      items: combined,
      count: combined.length,
      isBackend: true,
    };
  } catch {
    // Graceful offline fallback
    let items = getLocalItems();

    if (params.kind && params.kind !== 'all') {
      items = items.filter((item) => item.kind === params.kind);
    }
    if (params.category) {
      items = items.filter((item) => String(item.category) === String(params.category));
    }
    if (params.search) {
      const q = params.search.toLowerCase();
      items = items.filter(
        (item) =>
          item.title?.toLowerCase().includes(q) ||
          item.description?.toLowerCase().includes(q) ||
          item.location?.toLowerCase().includes(q)
      );
    }
    if (params.status) {
      items = items.filter((item) => item.status === params.status);
    }

    return {
      items,
      count: items.length,
      isBackend: false,
    };
  }
}

/**
 * Fetch a single item by ID.
 */
export async function getItemById(id) {
  try {
    const item = await apiRequest(`/api/items/${id}/`);
    return { item, isBackend: true };
  } catch {
    const local = getLocalItems();
    const item = local.find((i) => String(i.id) === String(id)) || local[0];
    return { item, isBackend: false };
  }
}

/**
 * Create a new lost or found item. Supports multipart FormData or JSON.
 */
export async function createItem(itemData) {
  try {
    const created = await apiRequest('/api/items/', {
      method: 'POST',
      body: itemData,
    });
    // Cache in local items so it displays immediately in the feed
    if (created) {
      const localItems = getLocalItems();
      const updated = [created, ...localItems.filter((i) => i.id !== created.id)];
      saveLocalItems(updated);
    }
    return { item: created, isBackend: true };
  } catch (backendError) {
    console.warn('Backend createItem failed, storing locally:', backendError);

    // Save in local items
    const localItems = getLocalItems();
    let newEntry;

    if (itemData instanceof FormData) {
      const imageFile = itemData.get('image');
      let imageUrl = 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80';
      if (imageFile && imageFile.name) {
        imageUrl = URL.createObjectURL(imageFile);
      }

      newEntry = {
        id: Date.now(),
        kind: itemData.get('kind') || 'lost',
        title: itemData.get('title') || 'Untitled item',
        description: itemData.get('description') || '',
        category: Number(itemData.get('category')) || null,
        location: itemData.get('location') || 'Campus',
        date_occurred: itemData.get('date_occurred') || new Date().toISOString().split('T')[0],
        image: imageUrl,
        status: 'open',
        reporter: 'Lisbon',
        is_owner: true,
        match_percentage: 95,
        verified_by_security: true,
        match_criteria: [
          { label: 'Same category', matched: true },
          { label: 'Similar location', matched: true },
          { label: 'Similar time', matched: true },
        ],
        created_at: new Date().toISOString(),
      };
    } else {
      newEntry = {
        id: Date.now(),
        ...itemData,
        status: 'open',
        reporter: 'Lisbon',
        is_owner: true,
        match_percentage: 95,
        verified_by_security: true,
        match_criteria: [
          { label: 'Same category', matched: true },
          { label: 'Similar location', matched: true },
          { label: 'Similar time', matched: true },
        ],
        created_at: new Date().toISOString(),
      };
    }

    localItems.unshift(newEntry);
    saveLocalItems(localItems);
    return { item: newEntry, isBackend: false };
  }
}

/**
 * Claim an item with proof of ownership message.
 */
export async function claimItem(itemId, message) {
  try {
    const claim = await apiRequest(`/api/items/${itemId}/claim/`, {
      method: 'POST',
      body: { message },
    });
    return { claim, isBackend: true };
  } catch (err) {
    const claims = getLocalClaims();
    const newClaim = {
      id: Date.now(),
      item: Number(itemId),
      item_title: 'AirPods case',
      claimant: 'Lisbon',
      message,
      status: 'pending',
      contact_email: 'lisbon@oxford.ac.uk',
      created_at: new Date().toISOString(),
    };
    claims.unshift(newClaim);
    saveLocalClaims(claims);
    return { claim: newClaim, isBackend: false };
  }
}

/**
 * Reporter decides on a claim (approve or reject).
 */
export async function decideClaim(claimId, decision) {
  const endpoint = decision === 'approve' ? `/api/claims/${claimId}/approve/` : `/api/claims/${claimId}/reject/`;
  try {
    const result = await apiRequest(endpoint, { method: 'POST' });
    return { result, isBackend: true };
  } catch {
    const claims = getLocalClaims();
    const updated = claims.map((c) =>
      c.id === claimId ? { ...c, status: decision === 'approve' ? 'approved' : 'rejected' } : c
    );
    saveLocalClaims(updated);
    return { result: { id: claimId, status: decision === 'approve' ? 'approved' : 'rejected' }, isBackend: false };
  }
}

/**
 * Reporter marks an item as resolved.
 */
export async function resolveItem(itemId) {
  // Always update local cache so the status is retained
  const localItems = getLocalItems();
  const updated = localItems.map((i) =>
    i.id === Number(itemId) || String(i.id) === String(itemId) ? { ...i, status: 'resolved' } : i
  );
  saveLocalItems(updated);

  try {
    const res = await apiRequest(`/api/items/${itemId}/resolve/`, { method: 'POST' });
    return { item: res, isBackend: true };
  } catch (err) {
    return { item: updated.find((i) => i.id === Number(itemId) || String(i.id) === String(itemId)), isBackend: false };
  }
}

