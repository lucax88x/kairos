import { OptionsObject } from 'notistack';

import { UUID } from './uuid.model';

export class NotificationModel {
  public key: UUID;

  constructor(public message: string, public options?: OptionsObject) {
    this.key = UUID.Generate();
  }
}
