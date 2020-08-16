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
  notifs:any[]=[];
  gameUpdated=new Subject();
  notifUpdated=new Subject();
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
        gamename:data.gamename,
        addedBy:data.addedBy
      }
     console.log("game added",data)
     this.pushNotif(game.addedBy);
     this.games.push(data)
     this.gameUpdated.next([...this.games])
    })
  }
  getGameUpdateListener(){
    return this.gameUpdated.asObservable();
  }
  getNotifUpdateListener(){
    return this.notifUpdated.asObservable();
  }
  pushNotif(addedBy){
    const notif={
      message:"added their game! Check it out!",
      username: addedBy
    }
    this.http.patch<{message:string}>(HOST_URL+'push-notifs/',notif)
    .subscribe(data=>{
      console.log(data.message)
      this.notifs.push(notif)
      this.notifUpdated.next([...this.notifs])
    })
  }
  readNotif(i){
    const id=this.notifs[i]._id;
    this.http.delete<{notifs:any[]}>(HOST_URL+'read-notifs/'+id)
    .subscribe(data=>{
      this.notifs.splice(i,1)
      this.notifUpdated.next([...this.notifs])
    })
  }
  getNotifs(){
    this.http.get<{notifs:any[]}>(HOST_URL+"get-notifs")
    .subscribe(notifsArr=>{
         this.notifs=notifsArr.notifs;
         this.notifUpdated.next([...this.notifs]);
      });
  }
}
