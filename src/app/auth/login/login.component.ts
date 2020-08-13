import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit,OnDestroy {

  userIsAuthenticated=false;
  errmessage:string;
  errorSub:Subscription;
  private authListenerSubs:Subscription;
  constructor(private authService:AuthService) { }

  ngOnInit(): void {
    this.authListenerSubs=this.authService.getAuthStatusListener()
    .subscribe(isAuthenticated =>{
      this.userIsAuthenticated=isAuthenticated;
    });
    this.errorSub=this.authService.getErrorListener()
    .subscribe(err=>{
      this.errmessage=err;
    })
  }
  ngOnDestroy(){
    this.authListenerSubs.unsubscribe();
  }
  onLogin(form:NgForm){
    if(form.invalid)
    return;
    this.authService.login(form.value.email,form.value.password)
  }
}
