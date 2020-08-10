import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AddgameService {
  url:string[]=[];
  private gameUpdated=new Subject();

  constructor(private http:HttpClient) { }

  addGame(file:File){
    const gameUpload=new FormData();
    const filename=file.name.split(".");
    gameUpload.append("file",file,filename[0]);
    this.http.post<{gamename:string}>("http://localhost:3000/add-game",gameUpload)
    .subscribe(data=>{
     console.log("game added",data.gamename)
    //  this.url.push(data.url)
    //  this.gameUpdated.next([...this.url])
    })
  }
  getGameUpdateListener(){
    return this.gameUpdated.asObservable();
  }

}
