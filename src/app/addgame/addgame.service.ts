import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

const HOST_URL=environment.apiUrl;
@Injectable({
  providedIn: 'root'
})
export class AddgameService {
  games:any[]=[];

   gameUpdated=new Subject();

  constructor(private http:HttpClient) { }

  addGame(gamename:string,file:File){
    const gameUpload=new FormData();
    console.log(gamename)
    gameUpload.append("gamename",gamename);
    const filename=file.name.split(".");
    gameUpload.append("file",file,filename[0]);
    this.http.post<{games:any}>(HOST_URL+"add-game",gameUpload)
    .subscribe((data:any)=>{
      const game={
        url:data.url,
        gamename:data.gamename
      }
     console.log("game added",data)
     this.games.push(data)
     this.gameUpdated.next([...this.games])
    })
  }

}
