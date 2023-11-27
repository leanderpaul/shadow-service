/**
 * Importing npm packages
 */
import { MailDataRequired, MailService as SendGridMail } from '@sendgrid/mail';

/**
 * Importing user defined packages
 */
import { type JSONData } from '@lib/interfaces';
import { Utils } from '@lib/internal.utils';

import { Logger } from './logger/logger.service';

/**
 * Defining types
 */

export interface MailData {
  from: string;
  to: string;
  subject: string;
  templateId: string;
  templateData: Record<string, JSONData>;
}

/**
 * Declaring the constants
 */
const MAX_RETRY_ATTEMPTS = 3;

export abstract class MailService {
  private readonly mail: SendGridMail;
  protected abstract readonly logger: Logger;
  private readonly defaultData: Record<string, JSONData> = {};

  private isEnabled = false;

  constructor() {
    this.mail = new SendGridMail();
    const Config = Utils.getGlobalRef('config');

    const apiKey = Config.get('mail.sendgrid.apikey');
    if (apiKey) {
      this.mail.setApiKey(apiKey);
      this.isEnabled = true;
    }
  }

  private async _sendMail(data: MailDataRequired, retryAttempt = 1): Promise<void> {
    if (!this.isEnabled) {
      this.logger.warn(`mail service disabled, but got '${data.subject}' mail to '${data.to}'`, data);
      return;
    }

    const [response] = await this.mail.send(data);
    if (response.statusCode != 202) {
      if (retryAttempt < MAX_RETRY_ATTEMPTS) this._sendMail(data, retryAttempt + 1);
      else this.logger.warn(`Failed to send email to '${data.to}'`, { response });
    }
  }

  protected appendDefaultData(key: string, data: JSONData): void;
  protected appendDefaultData(data: Record<string, JSONData>): void;
  protected appendDefaultData(keyOrData: string | Record<string, JSONData>, data?: JSONData): void {
    const value = typeof keyOrData === 'string' ? { [keyOrData]: data } : keyOrData;
    Object.assign(this.defaultData, value);
  }

  protected sendMail(mail: MailData): void {
    this._sendMail({
      from: mail.from,
      to: mail.to,
      subject: mail.subject,
      templateId: mail.templateId,
      dynamicTemplateData: { ...this.defaultData, ...mail.templateData },
    });
  }
}
