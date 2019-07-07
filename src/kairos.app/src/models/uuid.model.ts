import uuidv4 from 'uuid/v4';

export class UUID {
  public static Empty = '00000000-0000-0000-0000-000000000000';

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

  public get isEmpty() {
    return this.value === UUID.Empty;
  }

  public equals(other: UUID): boolean {
    return this.value === other.value;
  }

  public toString = (): string => {
    return this.value;
  };
}
