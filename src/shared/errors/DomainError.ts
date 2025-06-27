export class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DomainError';
    Object.setPrototypeOf(this, DomainError.prototype);
  }

  public static create(message: string): DomainError {
    return new DomainError(message);
  }
}

export class InvalidArgumentError extends DomainError {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidArgumentError';
    Object.setPrototypeOf(this, InvalidArgumentError.prototype);
  }
}

export class NotFoundError extends DomainError {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}