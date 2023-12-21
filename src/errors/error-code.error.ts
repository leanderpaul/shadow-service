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
  UNAUTHENTICATED = 'UNAUTHENTICATED',
  UNAUTHORIZED = 'UNAUTHORIZED',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  SERVER_ERROR = 'SERVER_ERROR',
  CONFLICT = 'CONFLICT',
  INTERNAL = 'INTERNAL',
}

/**
 * Declaring the constants
 */
const ERROR_STATUS_CODES: Record<ErrorType, number> = {
  [ErrorType.CLIENT_ERROR]: 400,
  [ErrorType.HTTP_ERROR]: 400,
  [ErrorType.NOT_FOUND]: 404,
  [ErrorType.SERVER_ERROR]: 500,
  [ErrorType.UNAUTHENTICATED]: 401,
  [ErrorType.UNAUTHORIZED]: 403,
  [ErrorType.VALIDATION_ERROR]: 422,
  [ErrorType.CONFLICT]: 409,
  [ErrorType.INTERNAL]: 500,
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

  /**
   * List of migration related errors
   */

  /** Migration not enabled */
  static readonly MIG001 = new ErrorCode('MIG001', ErrorType.HTTP_ERROR, 'Migration not enabled');
  /** Migration is already running */
  static readonly MIG002 = new ErrorCode('MIG002', ErrorType.HTTP_ERROR, 'Migration is already running');

  /*!
   * List of all server related errors
   */

  /** Unexpected server error */
  static readonly S001 = new ErrorCode('S001', ErrorType.SERVER_ERROR, 'Unexpected server error');
  /** Not found */
  static readonly S002 = new ErrorCode('S002', ErrorType.NOT_FOUND, 'Not found');
  /** Invalid input */
  static readonly S003 = new ErrorCode('S003', ErrorType.VALIDATION_ERROR, 'Invalid input');
}
