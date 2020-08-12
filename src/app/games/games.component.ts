import { Component, OnInit, OnDestroy } from '@angular/core';
import { GamesService } from './games.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-games',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.css']
})
export class GamesComponent implements OnInit,OnDestroy {
  score:number;
  gamename:string;
  i:number;
  games:any[]=[]
  src:string;
  private gamesSub: Subscription;
  private indexSub:Subscription;

  constructor(public gamesService:GamesService) { }
  ngOnInit() {
    window.addEventListener("message",this.handler);
    this.gamesService.getGames();
    this.gamesSub=this.gamesService.getGameUpdateListener().subscribe((games:any[])=>{
      this.games=games;
    });
    this.indexSub=this.gamesService.getIndexUpdateListener().subscribe((index)=>{
      this.i=index;
    });
  }

  ngOnDestroy(){
    console.log(this.i)
    let gamename;
    if(typeof(this.i)!="undefined"){
      gamename=this.gamesService.getGamename(this.i);
    }
    this.gamesService.updateScore(JSON.parse(localStorage.getItem(gamename)),gamename);
    window.removeEventListener("message",this.handler)
  }
  handler(e:any){
    if(typeof(e.data.type)==='undefined'){
      this.score=e.data.score;
      this.gamename=e.data.gamename;
      if(localStorage.getItem(`${this.gamename}`) === null){
        localStorage.setItem(`${this.gamename}`,JSON.stringify(this.score))
      }
      else if(this.score>JSON.parse(localStorage.getItem(`${this.gamename}`))){
        localStorage.setItem(`${this.gamename}`,JSON.stringify(this.score))
      }
    }
  }
}
