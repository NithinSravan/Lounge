import { Component, OnInit } from '@angular/core';
import { PostsService } from '../posts.service';
import {Post} from '../post.model'
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/auth/user.model';
@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit {
  // posts=[
  //   {username:"Nithin",content:"lol",comments:"hi"},
  //   {username:"Nithin",content:"lol",comments:"hi"},
  //   {username:"Nithin",content:"lol",comments:"hi"}
  // ]
  posts:Post[]=[];
  private postsSub: Subscription;
  private authStatusSub:Subscription;
  isAuthenticated=false;
  user:User;
  constructor(public postsService:PostsService,private authService:AuthService) { }


  ngOnInit() {
    this.postsService.getPosts();
    this.user=this.authService.getUserInfo();
    this.postsSub=this.postsService.getPostUpdateListener().subscribe((posts:Post[])=>{
        this.posts=posts;
      });
    this.isAuthenticated=this.authService.getIsAuth();
    this.authStatusSub=this.authService.getAuthStatusListener()
    .subscribe(isAuthenticated=>{
      this.isAuthenticated=isAuthenticated;
      this.user=this.authService.getUserInfo();
    })

  }
  ngOnDestroy(){
    this.postsSub.unsubscribe();
  }
}
