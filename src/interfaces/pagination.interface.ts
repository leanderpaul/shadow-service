/**
 * Importing npm packages
 */

/**
 * Importing user defined packages
 */

/**
 * Defining types
 */

/**
 * Declaring the constants
 */

export interface PageCursor {
  limit: number;
  offset: number;
}

export interface PageSort<T> {
  field: T;
  order: 'asc' | 'desc';
}
