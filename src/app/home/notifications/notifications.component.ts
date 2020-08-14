import { Component, OnInit, OnDestroy } from '@angular/core';
import { NotificationsService } from './notifications.service';
import { AuthService } from 'src/app/auth/auth.service';
import { Subscription } from 'rxjs';
import { User } from 'src/app/auth/user.model';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit,OnDestroy {
  notifs:any[]=[];
  private notifsSub: Subscription;
  private authStatusSub:Subscription;
  isAuthenticated=false;
  user:User;
  constructor(public notifsService:NotificationsService,private authService:AuthService) { }

  ngOnInit() {
    this.notifsService.getNotifs();
    this.user=this.authService.getUserInfo();
    this.notifsSub=this.notifsService.getNotifsUpdateListener().subscribe((notifs:any[])=>{
        this.notifs=notifs;
      });
    this.isAuthenticated=this.authService.getIsAuth();
    this.authStatusSub=this.authService.getAuthStatusListener()
    .subscribe(isAuthenticated=>{
      this.isAuthenticated=isAuthenticated;
      this.user=this.authService.getUserInfo();
    })
  }
  ngOnDestroy(){
    this.notifsSub.unsubscribe();
  }
}
