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

  src:string;


  gameSelect(i){
    document.querySelector('iframe').src=this.src;
    document.getElementById('game-selector').style.display="none";
  }
  constructor(public gamesService:GamesService) { }
  ngOnInit() {
    window.addEventListener("message",this.handler);

  }
  ngOnDestroy(){
    console.log(JSON.parse(localStorage.getItem('score')))
    this.gamesService.updateScore(JSON.parse(localStorage.getItem('score')));
    window.removeEventListener("message",this.handler)
  }
  handler(e:any){
    if(typeof(e.data.type)==='undefined'){
      this.score=e.data;
      if(localStorage.getItem('score') === null)
      localStorage.setItem("score",JSON.stringify(this.score))
      else if(this.score>JSON.parse(localStorage.getItem('score'))){
        localStorage.setItem("score",JSON.stringify(this.score))
      }
    }
  }
}
