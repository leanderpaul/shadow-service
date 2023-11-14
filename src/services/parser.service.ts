/**
 * Importing npm packages
 */
import { ObjectId } from 'bson';

/**
 * Importing user defined packages
 */
import { AppError, ErrorCode } from '@lib/errors';

/**
 * Defining types
 */

/**
 * Declaring the constants
 */

export class ParserService {
  toObjectID(id: string, throwError: true | AppError): ObjectId;
  toObjectID(id: string, throwError?: false): ObjectId | null;
  toObjectID(id: string, throwError?: boolean | AppError): ObjectId | null {
    try {
      return new ObjectId(id);
    } catch (err) {
      if (throwError) throw typeof throwError === 'boolean' ? new AppError(ErrorCode.S003) : throwError;
      return null;
    }
  }
}
