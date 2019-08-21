import { OptionsObject } from 'notistack';

import { UUID } from './uuid.model';
import { immerable } from 'immer';

export class NotificationModel {
  [immerable] = true;
  
  public key: UUID;

  constructor(public message: string, public options?: OptionsObject) {
    this.key = UUID.Generate();
  }
}
