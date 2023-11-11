/**
 * Importing npm packages
 */

/**
 * Importing user defined packages
 */

/**
 * Defining types
 */
export enum ErrorType {
  CLIENT_ERROR = 'CLIENT_ERROR',
  HTTP_ERROR = 'HTTP_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  UNAUTHORIZED = 'UNAUTHORIZED',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  SERVER_ERROR = 'SERVER_ERROR',
}

/**
 * Declaring the constants
 */
const ERROR_STATUS_CODES: Record<ErrorType, number> = {
  [ErrorType.CLIENT_ERROR]: 400,
  [ErrorType.HTTP_ERROR]: 400,
  [ErrorType.NOT_FOUND]: 404,
  [ErrorType.SERVER_ERROR]: 500,
  [ErrorType.UNAUTHORIZED]: 403,
  [ErrorType.VALIDATION_ERROR]: 400,
};

export class ErrorCode {
  protected constructor(
    private readonly code: string,
    private readonly type: ErrorType,
    private readonly msg: string,
    private readonly statusCode?: number,
  ) {
    if (!statusCode) this.statusCode = ERROR_STATUS_CODES[type];
  }

  getCode(): string {
    return this.code;
  }

  getType(): ErrorType {
    return this.type;
  }

  getMessage(): string {
    return this.msg;
  }

  getStatusCode(): number {
    return this.statusCode || 500;
  }
}
