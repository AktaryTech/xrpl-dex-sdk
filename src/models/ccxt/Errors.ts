export class BaseError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class ExchangeError extends BaseError {}
export class AuthenticationError extends ExchangeError {}
export class PermissionDenied extends AuthenticationError {}
export class AccountNotEnabled extends PermissionDenied {}
export class ArgumentsRequired extends ExchangeError {}
export class BadRequest extends ExchangeError {}
export class BadSymbol extends BadRequest {}
export class BadOrderId extends BadRequest {}
export class BadResponse extends ExchangeError {}
export class InsufficientFunds extends ExchangeError {}
export class InvalidAddress extends ExchangeError {}
export class InvalidOrder extends ExchangeError {}
export class OrderNotFound extends InvalidOrder {}
export class CancelPending extends InvalidOrder {}
export class NotSupported extends ExchangeError {}
export class NetworkError extends BaseError {}
export class DDoSProtection extends NetworkError {}
export class RateLimitExceeded extends DDoSProtection {}
export class ExchangeNotAvailable extends NetworkError {}
export class RequestTimeout extends NetworkError {}
