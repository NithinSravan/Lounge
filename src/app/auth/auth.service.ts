import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from './auth-data.model';
import { LoginData } from './auth-login.model';
import { User } from './user.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

const HOST_URL=environment.apiUrl;
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated=false;
  private token:string;
  private timer:any;
  private user:User;
  errmessage:string;
  private authStatusListener=new Subject<boolean>();
  updateError=new Subject<string>();
  constructor(private http:HttpClient,private router:Router) { }

  getToken(){
    return this.token;
  }
  getAuthStatusListener(){
    return this.authStatusListener.asObservable()
  }
  getErrorListener(){
    return this.updateError.asObservable()
  }
  getIsAuth(){
    return this.isAuthenticated;
  }
  getUserInfo(){
    return this.user;
  }
  createUser(name:string,username:string,email:string,password:string){
    const authData: AuthData={
      name,
      username,
      email,
      password
    }
    this.http.post(HOST_URL+'signup',authData)
    .subscribe(res=>{
      this.router.navigate(['/login']);
    },(err)=>{
        this.errmessage="Form wasn't submitted successfully.Please specify a different username or an email ID that hasn't been registered already."
        this.updateError.next(this.errmessage)
    })
  }
  autoAuthUser(){
    const authInfo=this.getAuthData();
    if(!authInfo){
      return;
    }
    const now=new Date();
    const expiry=authInfo.expirationDate.getTime()-now.getTime();
    if(expiry>0){
      this.token=authInfo.token;
      this.isAuthenticated=true;
      this.user=authInfo.loggedUser;
      this.setAuthTimer(expiry/1000);
      this.authStatusListener.next(true);
    }
  }
  login(email:string,password:string){
    const loginData: LoginData={
      email,
      password
    }
    this.http.post<{token:string,expiresIn:number,username:string,userId:string,name:string}>(HOST_URL+'login',loginData)
    .subscribe(res=>{
      const token=res.token;
      this.token=token;
      const user:User={
        userId:res.userId,
        name:res.name,
        username:res.username
      };
      if(token) {
        const expiry=res.expiresIn;
        this.setAuthTimer(expiry);
        this.isAuthenticated=true;
        this.user=user;
        this.authStatusListener.next(true);
        this.router.navigate(['/']);
        const now= new Date();
        const expirationDate=new Date(now.getTime()+expiry*1000);
        this.saveAuthData(token,expirationDate,user);
        console.log("logged in")
      }
    },(err)=>{
        this.errmessage="Invalid credentials.Please try again."
        this.updateError.next(this.errmessage)
    })
  }
  logout(){
    clearTimeout(this.timer);
    this.token=null;
    this.isAuthenticated=false;
    this.authStatusListener.next(false);
    this.user=null;
    this.clearAuthData();
    this.router.navigate(['/login']);
  }
  private setAuthTimer(duration:number){
    this.timer=setTimeout(()=>{
      this.logout();
    },duration*1000)
  }
  private saveAuthData(token:string,expirationDate:Date,user:User){
    localStorage.setItem('token',token);
    localStorage.setItem('expiration',expirationDate.toISOString());
    localStorage.setItem('user',JSON.stringify(user));
  }
  private clearAuthData(){
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('user');
    localStorage.removeItem('score');
  }
  private getAuthData(){
    const token=localStorage.getItem('token');
    const expirationDate=localStorage.getItem('expiration');
    const user=JSON.parse(localStorage.getItem('user'));

    if(!token||!expirationDate){
      return;
    }
    const loggedUser:User={
      userId:user.userId,
      name:user.name,
      username:user.username
      }
    return {
      token,
      expirationDate:new Date(expirationDate),
     loggedUser
    };
  }
}
