export class AiConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AiConfigurationError";
  }
}

export class AiRequestError extends Error {
  status: number | null;

  constructor(message: string, status: number | null = null) {
    super(message);
    this.name = "AiRequestError";
    this.status = status;
  }
}

export class AiResponseValidationError extends Error {
  details: string | null;

  constructor(message: string, details: string | null = null) {
    super(message);
    this.name = "AiResponseValidationError";
    this.details = details;
  }
}
