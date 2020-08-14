import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import{HttpClient} from '@angular/common/http';
import{Post} from './post.model'
import { AuthService } from 'src/app/auth/auth.service';
import { environment } from 'src/environments/environment';


const HOST_URL=environment.apiUrl;
@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private posts:Post[]=[];
  private likes:number;
  private postUpdated= new Subject<Post[]>();
  constructor(private http:HttpClient,private authService:AuthService) { }
  getPosts(){
   this.http.get<{posts:Post[]}>(HOST_URL)
 .subscribe(postsArr=>{
      this.posts=postsArr.posts;
      this.postUpdated.next([...this.posts]);
   });
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
        this.postUpdated.next([...this.posts]);
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
        this.postUpdated.next([...this.posts]);
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
  getPostUpdateListener(){
    return this.postUpdated.asObservable();
  }
  addPosts(content:string,image:File){
    const postData=new FormData();
    postData.append("content",content);
    const filename=content.split(" ");
    postData.append("image",image,filename[0]);
    this.http.post<{message:string,post:any}>(HOST_URL,postData)
    .subscribe((resData)=>{
      const post:Post={
        _id:resData.post._id,
        content:content,
        imagePath:resData.post.imagePath,
        likes:resData.post.likes,
        likedBy:resData.post.likedBy,
        creator:resData.post.creator,
        creatorname:resData.post.creatorname
      };
      this.posts.push(post);
      this.postUpdated.next([...this.posts]);
      this.getPosts();
    })
  }
}
