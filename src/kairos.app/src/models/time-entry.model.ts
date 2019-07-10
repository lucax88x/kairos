import { UUID } from './uuid.model';

export enum TimeEntryTypes {
  IN = 'IN',
  OUT = 'OUT',
}

export interface TimeEntryInputModel {
  id: UUID;
  when: Date;
  type: TimeEntryTypes;
}
