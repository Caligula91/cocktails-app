export class User {
    
    constructor(
        public localId: string,
        public email: string, 
        private _token: string,
        private _expDate: Date) {}
    
    get token() {
        if (!this._expDate || this._expDate < new Date(Date.now())) {
            return null;
        }
        return this._token;
    }
}