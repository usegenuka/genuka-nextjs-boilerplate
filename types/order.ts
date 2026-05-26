/**
 * Genuka order shapes (partial — only the fields this app reads).
 * The Admin API returns far more; we keep what the ticket scanner needs.
 */

export interface GenukaCustomer {
  id: string;
  first_name?: string | null;
  last_name?: string | null;
  email?: string | null;
  phone?: string | null;
}

export interface GenukaOrderProduct {
  id: number | string;
  product_id?: string;
  variant_id?: string | null;
  title?: string | null;
  quantity: number;
  price: number;
}

export interface GenukaProduct {
  id: string;
  title?: string | null;
  type?: string | null;
}

export interface GenukaOrderMetadata {
  /** Free-text note shown/edited in the app and synced back to Genuka. */
  note?: string | null;
  /** ISO timestamp of when the ticket was scanned (set by this app). */
  scanned_at?: string | null;
  /** Agent / gate that scanned the ticket (set by this app). */
  scanned_by?: string | null;
  [key: string]: unknown;
}

export interface GenukaOrder {
  id: string;
  reference?: string | null;
  status?: string | null;
  amount?: number | null;
  amount_due?: number | null;
  currency?: string | null;
  customer_id?: string | null;
  customer?: GenukaCustomer | null;
  order_products?: GenukaOrderProduct[];
  products?: GenukaProduct[];
  metadata?: GenukaOrderMetadata | null;
  created_at?: string | null;
  updated_at?: string | null;
}

/** Laravel paginated response envelope. */
export interface Paginated<T> {
  data: T[];
  meta?: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  links?: Record<string, string | null>;
}

/**
 * Local representation stored in IndexedDB: the Genuka order plus
 * device-local scan/sync state.
 */
export interface LocalTicket {
  id: string;
  reference: string | null;
  /** Full order payload from Genuka, kept for offline detail display. */
  order: GenukaOrder;
  customerName: string | null;
  customerPhone: string | null;
  amount: number | null;
  currency: string | null;
  // Local scan state
  scanned: boolean;
  scannedAt: string | null;
  scannedBy: string | null;
  note: string;
  // Sync bookkeeping
  /** True when local changes have not yet been pushed to Genuka. */
  dirty: boolean;
  syncStatus: "synced" | "pending" | "error";
  syncError: string | null;
  /** Local-only timestamp of last local change, for ordering recent scans. */
  updatedAt: number;
}
