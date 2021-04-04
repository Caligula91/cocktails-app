import { Component, ComponentFactoryResolver, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from './auth.service';
import { AlertComponent } from '../shared/alert/alert.component';
import * as fromApp from "../store/app.reducer";
import * as AuthActions from "./store/auth.actions";

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit, OnDestroy {

  private storeSub: Subscription;
  isLoginMode: boolean = true;
  loginForm: FormGroup;
  signupForm: FormGroup;
  isLoading: boolean = false;
  error: string = null;

  constructor(private store: Store<fromApp.AppState>, private router: Router, private route: ActivatedRoute) { }
    
  ngOnInit(): void {
    this.initForms();
    this.storeSub = this.store.select('auth').subscribe(data => {
      this.isLoading = data.isLoading;
      this.error = data.error;
    });
    this.route.params.subscribe(params => {
      this.isLoginMode = params['mode'] === 'login';
    })
  }

  ngOnDestroy(): void {
    this.storeSub.unsubscribe();
  }
    
  onChangeState(): void {
    this.router.navigate(['/', 'auth', (this.isLoginMode)?'signup':'login']);
    this.store.dispatch(new AuthActions.ClearError());
  }

  onErrorConfirm() {
    this.store.dispatch(new AuthActions.ClearError());
  }

  onSubmit(): void {
    if (this.isLoginMode) {
      const { email, password } = this.loginForm.value; 
      this.store.dispatch(new AuthActions.LoginStart({ email, password }));
    } else {
      const { email, passwordData: { password } } = this.signupForm.value;
      this.store.dispatch(new AuthActions.SignupStart({ email, password }));
      
    }
  }

  private passwordMatching(formGroup: FormGroup): { [s: string]: boolean } {
    const password = formGroup.get('password').value;
    const passwordConfirm = formGroup.get('passwordConfirm').value;
    return (password === passwordConfirm) 
      ? null
      : { 'passwordNotMatching': true};
  }

  private initForms() {
    this.loginForm = new FormGroup({
      'email': new FormControl('nanica71@gmail.com', [Validators.required, Validators.email]),
      'password': new FormControl('pass1234', [Validators.required]),
    });
    this.signupForm = new FormGroup({
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'passwordData': new FormGroup({
        'password': new FormControl(null, [Validators.required, Validators.minLength(6)]),
        'passwordConfirm': new FormControl(null, [Validators.required, Validators.minLength(6)]),
      }, { validators: this.passwordMatching })
    })
  }

}
