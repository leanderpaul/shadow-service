/**
 * Importing npm packages
 */

/**
 * Importing user defined packages
 */
import { ErrorCode } from './error-code.error';

/**
 * Defining types
 */

/**
 * Declaring the constants
 */

export class InternalError extends Error {
  private readonly errorCode: ErrorCode;

  constructor(message: string);
  constructor(errorCode: ErrorCode, message: string);
  constructor(errorCode: string | ErrorCode, message?: string) {
    if (!message) {
      message = errorCode as string;
      errorCode = ErrorCode.S001;
    }
    super(message);
    this.name = this.constructor.name;
    this.errorCode = errorCode as ErrorCode;
  }

  getErrorCode(): ErrorCode {
    return this.errorCode;
  }
}
