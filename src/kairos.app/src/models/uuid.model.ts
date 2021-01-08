import { immerable } from 'immer';
import { v4 as uuidv4, NIL } from 'uuid';

export class UUID {
  [immerable] = true;

  public static Empty = NIL;

  public static Generate(): UUID {
    return new UUID(uuidv4());
  }

  public static IsValid(value: string): boolean {
    if (value === UUID.Empty) {
      return true;
    }

    const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return regex.test(value);
  }

  public value: string = UUID.Empty;

  constructor(value?: string) {
    if (!!value) {
      if (!UUID.IsValid(value)) {
        throw Error('invalid UUID');
      }

      this.value = value;
    } else {
      this.value = UUID.Empty;
    }
  }

  public static isEmpty(uuid: UUID) {
    return uuid.value === UUID.Empty;
  }

  public static equals(uuid: UUID, other: UUID): boolean {
    return uuid.value === other.value;
  }

  public toString = (): string => {
    return this.value;
  };

  public toJSON = (): string => {
    return this.value;
  };
}
