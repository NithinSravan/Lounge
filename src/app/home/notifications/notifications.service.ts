import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

const HOST_URL=environment.apiUrl;
@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  private notifs:any[]=[];
  private notifsUpdated=new Subject<any[]>();
  constructor(private http:HttpClient) { }

  getNotifs(){
    this.http.get<{requests:any}>(HOST_URL+'received-requests')
    .subscribe(res=>{
      this.notifs=res.requests;
      this.notifsUpdated.next([...this.notifs]);
    })
  }
  getNotifsUpdateListener(){
    return this.notifsUpdated.asObservable();
  }
  onAccept(username:string,i:number){
    this.http.patch(HOST_URL+'accept',{username})
    .subscribe(res=>{
      const buttons=document.getElementsByClassName('buttons') as HTMLCollectionOf<HTMLElement>
      buttons[i].style.display="none";
      const myDiv = document.createElement('div');
			document.getElementsByClassName('notifcard')[i].appendChild(myDiv);
      myDiv.classList.add("friends-now");
      const friendsnow=document.getElementsByClassName('friends-now') as HTMLCollectionOf<HTMLElement>
      friendsnow[i].innerText="You are friends!"
      this.notifs.splice(i);

    })
  }
  onReject(username:string,i:number){
    this.http.patch(HOST_URL+'reject',{username})
    .subscribe(res=>{
      (document.getElementsByClassName('notifcard') as HTMLCollectionOf<HTMLElement>)[i].style.display="none";
      this.notifs.splice(i,1);
      this.notifsUpdated.next([...this.notifs]);
    })
  }

}
