/**
 * Importing npm packages
 */

/**
 * Importing user defined packages
 */

/**
 * Defining types
 */
import { type ConfigRecords, type ConfigService, type ContextService } from './services';

/**
 * Declaring the constants
 */
const globalRef = global as any;

export class Utils {
  static exit(err: string | Error): never {
    if (typeof err === 'string') err = new Error(err);
    process.exit(1);
  }

  static getGlobalRef(key: 'context'): ContextService;
  static getGlobalRef(key: 'config'): ConfigService<ConfigRecords>;
  static getGlobalRef(key: 'context' | 'config'): ContextService | ConfigService<ConfigRecords> {
    const ref = globalRef[key + 'Service'];
    if (!ref) this.exit(`${key} service not initialized`);
    return ref;
  }
}
