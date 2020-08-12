import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';
import { User } from '../auth/user.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit,OnDestroy {

  userIsAuthenticated=false;
  private authListenerSubs:Subscription;
  user:User;
  constructor(private authService:AuthService) { }

  onLogout(){
    this.authService.logout();
  }
  ngOnInit(): void {
    this.user=this.authService.getUserInfo();
    this.userIsAuthenticated=this.authService.getIsAuth();
    this.authListenerSubs=this.authService.getAuthStatusListener()
    .subscribe(isAuthenticated =>{
      this.userIsAuthenticated=isAuthenticated;
      this.user=this.authService.getUserInfo();
    });
    if( localStorage.getItem('theme')==="dark"&&this.userIsAuthenticated){
      document.documentElement.setAttribute('data-theme', 'dark');
    }else{
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }
  ngOnDestroy(){
    this.authListenerSubs.unsubscribe();
  }
  onToggle(e){
    if (e.target.checked) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
  }
  else {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
  }
  }
}
