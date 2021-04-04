import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

enum ErrorType {
    SUCCESS = 'alert--success',
    ERROR = 'alert--error',
}

@Injectable({
    providedIn: 'root',
})
export class AlertService {

    showAlert$ = new Subject<{ alert: { type: ErrorType, message: string }, duration: number }>();

    showSuccessAlert(message: string, duration: number = 2000) {
        this.showAlert$.next({ alert: { type: ErrorType.SUCCESS, message }, duration });
    }

    showErrorAlert(message: string, duration: number = 2000) {
        this.showAlert$.next({ alert: { type: ErrorType.ERROR, message }, duration });
    }
}