/**
 * Importing npm packages
 */

/**
 * Importing user defined packages
 */
import { AppError, ErrorCode } from '@lib/errors';
import { type Logger } from '@lib/services';

/**
 * Defining types
 */

export enum MigrationStatus {
  DISABLED = 'DISABLED',
  PENDING = 'PENDING',
  RUNNING = 'RUNNING',
  COMPLETED = 'COMPLETED',
}

export enum MigrationMode {
  DRY = 'DRY',
  LIVE = 'LIVE',
}

/**
 * Declaring the constants
 */

export abstract class MigrationService {
  abstract readonly logger: Logger;

  private mode?: MigrationMode;
  private status = MigrationStatus.DISABLED;
  private error?: string;
  private progress = 0;

  constructor(private readonly name?: string) {
    if (name) this.status = MigrationStatus.PENDING;
  }

  getName(): string | undefined {
    return this.name || undefined;
  }

  getStatus(): MigrationStatus {
    return this.status;
  }

  getMode(): MigrationMode | undefined {
    return this.mode;
  }

  getError(): string | undefined {
    return this.error;
  }

  getProgress(): number {
    return this.progress;
  }

  run(mode: MigrationMode = MigrationMode.DRY): void {
    if (this.status === MigrationStatus.DISABLED) throw new AppError(ErrorCode.MIG001);
    if (this.status === MigrationStatus.RUNNING) throw new AppError(ErrorCode.MIG002);
    this.mode = mode;
    this.status = MigrationStatus.RUNNING;
    this.migrate()
      .then(() => {
        this.logger.info('Migration completed');
        this.status = MigrationStatus.COMPLETED;
      })
      .catch(error => {
        this.logger.error(error);
        this.error = error.stack ?? error.toString();
      });
  }

  abstract migrate(): Promise<void>;
}
