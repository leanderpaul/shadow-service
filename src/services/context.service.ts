/**
 * Importing npm packages
 */
import { AsyncLocalStorage } from 'async_hooks';

/**
 * Importing user defined packages
 */

/**
 * Defining types
 */

type Middleware<Req, Res> = (req: Req, res: Res, next: () => void) => void;

/**
 * Declaring the constants
 */
let reqCounter = 0;

class ContextError extends Error {
  constructor(msg?: string) {
    super(msg);
    this.name = 'ContextError';
  }
}

export class ContextService<Req = Request, Res = Response> {
  private readonly asyncLocalStorage = new AsyncLocalStorage<Map<string, any>>();

  /** Initiates the context data store */
  init(): Middleware<Req, Res> {
    return (req, res, next) => {
      if (reqCounter > 9_999_999) reqCounter = 0;
      const store = new Map<string, any>();
      store.set('RID', ++reqCounter);
      store.set('CURRENT_REQUEST', req);
      store.set('CURRENT_RESPONSE', res);
      this.asyncLocalStorage.run(store, () => next());
    };
  }

  /** Returns the value if the context store and value exists */
  getOptional<T>(key: string): T | undefined {
    return this.asyncLocalStorage.getStore()?.get(key);
  }

  /** Returns the value if the value exists in context */
  get<T>(key: string, required: true): T;
  get<T>(key: string): T | undefined;
  get<T>(key: string, required?: true): T | undefined {
    const store = this.asyncLocalStorage.getStore();
    if (!store) throw new ContextError('store not initialized');
    const value = store.get(key);
    if (!value && required) throw new ContextError(`value for key '${key}' is undefined when it is required`);
    return value;
  }

  /** Sets the value in context */
  set<T>(key: string, value: T): ContextService<Req, Res> {
    const store = this.asyncLocalStorage.getStore();
    if (!store) throw new ContextError('store not initialized');
    store.set(key, value);
    return this;
  }

  /** Returns the current request */
  getCurrentRequest(): Req {
    return this.get('CURRENT_REQUEST', true);
  }

  /** Returns the current response */
  getCurrentResponse(): Res {
    return this.get('CURRENT_RESPONSE', true);
  }

  /** Returns the current request id */
  getRID(): string {
    return this.get('RID', true);
  }
}
