import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Post } from '../posts/post.model';
import { Subject } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { NotificationsService } from '../notifications/notifications.service';
import { environment } from 'src/environments/environment';

const HOST_URL=environment.apiUrl;
@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  username:string;
  name:string;
  reqSent:boolean=false;
  pendingReq:boolean=false;
  areFriends:boolean=false;
  totalFriends:number;
  private likes:number;
  posts:Post[]=[];
  private profileUpdated= new Subject();
  constructor(private http:HttpClient,private authService:AuthService) { }
  getProfile(id){
    this.http.get<{username:string,name:string,posts:Post[],totalFriends:number}>(HOST_URL+id)
    .subscribe(res=>{
       this.posts=res.posts;
       this.username=res.username;
       this.name=res.name;
       this.totalFriends=res.totalFriends;
       this.profileUpdated.next({
        username:this.username,
        name:this.name,
        totalFriends:this.totalFriends,
        posts:[...this.posts],
        reqSent:this.reqSent,
        areFriends:this.areFriends,
        pendingReq:this.pendingReq
      });
      });
    }
    returnUsername(){
      return this.username;
    }
    getProfileUpdateListener(){
      return this.profileUpdated.asObservable();
    }
    onLike(i){
      let hearts=document.getElementsByClassName('likes')as HTMLCollectionOf<HTMLElement>;
      const likedUser=this.authService.getUserInfo();
      const likedBy:any={
        liker:likedUser.userId,
        likername:likedUser.username
      }
      if(hearts[i].style.filter!=="none"){
        hearts[i].style.filter="none";
        this.posts[i].likedBy.push(likedBy);
        this.posts[i].likes=this.posts[i].likedBy.length;
        this.likes=this.posts[i].likes;
        this.http.put<{post:Post}>(HOST_URL+'like/'+this.posts[i]._id,this.posts[i])
        .subscribe(resData=>{
          this.profileUpdated.next({
            username:this.username,
            name:this.name,
            totalFriends:this.totalFriends,
            posts:[...this.posts],
            reqSent:this.reqSent,
            areFriends:this.areFriends,
            pendingReq:this.pendingReq
          });
        })
      }
      else{
        hearts[i].style.filter="invert(1) sepia(95) saturate(0) hue-rotate(0deg) brightness(1)";
        this.posts[i].likedBy=this.posts[i].likedBy.filter((post)=>{
          return post.liker!==likedBy.liker;
        })
        if(this.posts[i])
        this.posts[i].likes=this.posts[i].likedBy.length;
        this.likes=this.posts[i].likes;
        this.http.put<{post:Post}>(HOST_URL+'like/'+this.posts[i]._id,this.posts[i])
        .subscribe(resData=>{
                this.profileUpdated.next({
            username:this.username,
            name:this.name,
            totalFriends:this.totalFriends,
            posts:[...this.posts],
            reqSent:this.reqSent,
            areFriends:this.areFriends,
            pendingReq:this.pendingReq
          });
        })
      }
    }
    checkIfLiked(i){
      const likedUser=this.authService.getUserInfo();
      const likedBy:any={
        liker:likedUser.userId,
        likername:likedUser.username
      }
      const tempPost=[...this.posts];
      let hearts=document.getElementsByClassName('likes')as HTMLCollectionOf<HTMLElement>;
      const likedGuy=tempPost[i].likedBy.filter((post)=>{
          return post.liker===likedBy.liker;
        })
        if(likedGuy.length!==0){
          hearts[i].style.filter="none";
        }
    }
    followUser(){
      console.log(this.username)
      if( this.reqSent===false){
        this.http.patch<{message:string}>(HOST_URL+'request',{username:this.username})
        .subscribe(res=>{
          console.log(res.message)
          this.reqSent=true;
          this.profileUpdated.next({
            username:this.username,
            name:this.name,
            totalFriends:this.totalFriends,
            posts:[...this.posts],
            reqSent:this.reqSent,
            areFriends:this.areFriends,
            pendingReq:this.pendingReq
          });

        })
      }
      else{
        console.log("request already sent")
      }
    }
    unfollow(){
      console.log(this.username)
      if( this.areFriends){
        this.http.patch<{message:string}>(HOST_URL+'unfollow',{username:this.username})
        .subscribe(res=>{
          console.log(res.message)
          this.areFriends=false;
          this.profileUpdated.next({
            username:this.username,
            name:this.name,
            totalFriends:this.totalFriends,
            posts:[...this.posts],
            reqSent:this.reqSent,
            areFriends:this.areFriends,
            pendingReq:this.pendingReq
          });
        })
      }
      else{
        console.log("request already sent")
      }
    }
    onAccept(username:string){
      this.http.patch(HOST_URL+'accept',{username})
      .subscribe(res=>{
        console.log(res)
        this.areFriends=true;
        this.pendingReq=false;
        this.reqSent=false;
        this.profileUpdated.next({
          username:this.username,
          name:this.name,
          totalFriends:this.totalFriends,
          posts:[...this.posts],
          reqSent:this.reqSent,
          areFriends:this.areFriends,
          pendingReq:this.pendingReq
        });
      })
    }
    onReject(username:string){
      this.http.patch(HOST_URL+'reject',{username})
      .subscribe(res=>{
        this.areFriends=false;
        this.pendingReq=false;
        this.reqSent=false;
        this.profileUpdated.next({
          username:this.username,
          name:this.name,
          totalFriends:this.totalFriends,
          posts:[...this.posts],
          reqSent:this.reqSent,
          areFriends:this.areFriends,
          pendingReq:this.pendingReq
        });
      })
    }
    friendshipStatus(id:string){
      this.http.get<{checkSent:string[],checkFriendsList:string[],checkRequest:string[]}>(HOST_URL+'friendship-status/'+id)
      .subscribe((areFriends)=>{
        console.log(areFriends.checkFriendsList.length)
        if(areFriends.checkSent.length!==0){
          this.reqSent=true;
        }
        if(areFriends.checkFriendsList.length!==0){
          this.areFriends=true;
        }
        if(areFriends.checkRequest.length!==0){
          this.pendingReq=true;
        }
        this.profileUpdated.next({
          username:this.username,
          name:this.name,
          totalFriends:this.totalFriends,
          posts:[...this.posts],
          reqSent:this.reqSent,
          areFriends:this.areFriends,
          pendingReq:this.pendingReq
        });
      })
    }
}
