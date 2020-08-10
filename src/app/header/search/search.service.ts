import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from 'src/app/auth/user.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor(private http:HttpClient,private router:Router) { }
  searchUser(user:string){
    const searchedUser={
      user:user
    };
    this.http.post<{message:string,user:User}>('http://localhost:3000/search',searchedUser)
    .subscribe(data=>{
     this.router.navigate(['/profile',data.user.userId])
    })
  }
}
