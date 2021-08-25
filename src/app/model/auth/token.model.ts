export class Token {

  private readonly _accessToken: string;
  private readonly _expiryDate: Date;

  constructor(_accessToken: string, _expiryDate: Date) {
    this._accessToken = _accessToken;
    this._expiryDate = _expiryDate;
  }

  get accessToken(): string | null {
    if (this._expiryDate && this._expiryDate > new Date()) {
      return this._accessToken;
    } else {
      return null;
    }
  }

  get expiryDate(): Date | null {
    return this._expiryDate ? this._expiryDate : null;
  }
}
