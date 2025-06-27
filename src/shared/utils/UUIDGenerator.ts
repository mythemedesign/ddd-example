import { v4 as uuidv4, validate as uuidValidate } from 'uuid';

export class UUIDGenerator {
  public static generate(): string {
    return uuidv4();
  }

  public static validate(uuid: string): boolean {
    return uuidValidate(uuid);
  }

  public static isEqual(uuid1: string, uuid2: string): boolean {
    if (!this.validate(uuid1) || !this.validate(uuid2)) {
      return false;
    }
    return uuid1.toLowerCase() === uuid2.toLowerCase();
  }
}