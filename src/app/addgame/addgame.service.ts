import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AddgameService {
  gamename:string[]=[];
  private gameUpdated=new Subject();

  constructor(private http:HttpClient) { }

  addGame(file:File){
    const gameUpload=new FormData();
    const filename=file.name.split(".");
    gameUpload.append("file",file,filename[0]);
    this.http.post<{gamename:string}>("http://localhost:3000/add-game",gameUpload)
    .subscribe(data=>{
     console.log("game added")
    //  this.gamename.push(data.gamename)
    //  this.gameUpdated.next([...this.gamename])
    })
  }
  getGameUpdateListener(){
    return this.gameUpdated.asObservable();
  }

}
