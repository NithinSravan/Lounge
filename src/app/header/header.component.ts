import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';
import { User } from '../auth/user.model';
import { NotificationsService } from '../home/notifications/notifications.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit,OnDestroy {

  userIsAuthenticated=false;
  notifs:any[]=[];
  private notifsSub: Subscription;
  private authListenerSubs:Subscription;
  user:User;
  constructor(private authService:AuthService,public notifsService:NotificationsService) { }

  onLogout(){
    this.authService.logout();
  }
  ngOnInit(): void {
    this.notifsService.getNotifs();
    this.user=this.authService.getUserInfo();
    this.userIsAuthenticated=this.authService.getIsAuth();
    this.authListenerSubs=this.authService.getAuthStatusListener()
    .subscribe(isAuthenticated =>{
      this.userIsAuthenticated=isAuthenticated;
      this.user=this.authService.getUserInfo();
    });
    this.notifsSub=this.notifsService.getNotifsUpdateListener().subscribe((notifs:any[])=>{
      this.notifs=notifs;
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
  toggle(e){
    console.log(1)
    if (e.target.checked) {
      document.getElementById('dropdown-notifs').style.display="block";
  }
  else {
    document.getElementById('dropdown-notifs').style.display="none";
  }
  }
}
