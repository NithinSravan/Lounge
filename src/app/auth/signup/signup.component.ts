import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  submitted:boolean=false;
  errorSub:Subscription;
  errmessage:string;
  constructor(public authService:AuthService) {}

  ngOnInit(): void {
    this.errorSub=this.authService.getErrorListener()
    .subscribe(err=>{
      this.errmessage=err;
    })
  }
  onSignup(form:NgForm){
    this.submitted=true;
    if(form.invalid)
    return;
    this.authService.createUser(form.value.name,form.value.username,form.value.email,form.value.password)
    this.submitted=false;
    form.reset();
  }

}
