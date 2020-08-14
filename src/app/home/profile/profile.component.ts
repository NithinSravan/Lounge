import { Component, OnInit, OnDestroy, AfterViewChecked, AfterViewInit, AfterContentChecked, AfterContentInit, OnChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProfileService } from './profile.service';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { Post } from '../posts/post.model';
import { User } from 'src/app/auth/user.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit,OnDestroy{
  id:any;
  reqSent:boolean;
  pendingReq:boolean;
  areFriends:boolean;
  totalFriends:number;
  user:User;
  isAuthenticated=false;
  username:string;
  name:string;
  posts:Post[]=[];
  private authStatusSub:Subscription;
  private profileSub: Subscription;
  constructor(private activeRoute:ActivatedRoute,public profileService:ProfileService,private authService:AuthService) {
    this.activeRoute.params.subscribe(params=>{
      // console.log(params)
      this.id=params.id;
    })
  }

  ngOnInit() {
    this.profileService.getProfile(this.id);
    this.user=this.authService.getUserInfo();
    this.profileService.friendshipStatus(this.id);
    this.profileSub=this.profileService.getProfileUpdateListener().subscribe((resData:any)=>{
        this.posts=resData.posts;
        this.username=resData.username;
        this.name=resData.name;
        this.totalFriends=resData.totalFriends;
        this.reqSent=resData.reqSent;
        this.areFriends=resData.areFriends;
        this.pendingReq=resData.pendingReq;
      });
    this.isAuthenticated=this.authService.getIsAuth();
    this.authStatusSub=this.authService.getAuthStatusListener()
    .subscribe(isAuthenticated=>{
      this.isAuthenticated=isAuthenticated;
      this.user=this.authService.getUserInfo();
    })
  }

  ngOnDestroy(){
    this.profileSub.unsubscribe();
  }
}
