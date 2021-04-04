import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AlertService } from './alert.service';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit, OnDestroy {

  alert: { type: string, message: string } = { type: 'dummy', message: 'dummy' };
  visibility: boolean = false;
  alertSub: Subscription;
  timoutId: any;

  constructor(private alertService: AlertService) { }

  ngOnDestroy(): void {
    this.alertSub.unsubscribe();
  }

  ngOnInit(): void {
    this.alertSub = this.alertService.showAlert$.subscribe(data => {
      this.alert = data.alert;
      this.visibility = true;
      if (this.timoutId) clearTimeout(this.timoutId);
      this.timoutId = setTimeout(() => {
        this.visibility = false;
      }, data.duration)
    });
  }

}
