import { Component, OnInit } from '@angular/core';
import { AddgameService } from 'src/app/addgame/addgame.service';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/auth/user.model';

@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.css']
})
export class ActivityComponent implements OnInit {
  notifs:any[]=[];
  isAuthenticated=false;
  user:User;
  private authStatusSub:Subscription;
  private notifsSub: Subscription;
  constructor(public addGameService:AddgameService,private authService:AuthService) { }

  ngOnInit(): void {
    this.user=this.authService.getUserInfo();
    this.addGameService.getNotifs()
    this.notifsSub=this.addGameService.getNotifUpdateListener()
    .subscribe((notifs:any[])=>{
      this.notifs=notifs;
    })
    this.isAuthenticated=this.authService.getIsAuth();
    this.authStatusSub=this.authService.getAuthStatusListener()
    .subscribe(isAuthenticated=>{
      this.isAuthenticated=isAuthenticated;
    })
  }

}
