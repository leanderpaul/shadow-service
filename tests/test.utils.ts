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

export class TestUtils {
  static throw(err: string | Error): never {
    if (typeof err === 'string') err = new Error(err);
    throw err;
  }
}
