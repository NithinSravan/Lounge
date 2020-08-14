import { Component, OnInit, OnDestroy } from '@angular/core';
import { scoreCard } from './scorecard.model';
import { Subscription } from 'rxjs';
import { GamesService } from 'src/app/games/games.service';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.css']
})
export class LeaderboardComponent implements OnInit,OnDestroy {

  scores:scoreCard[]=[];
  i:number;
  games:any[]=[]
  private gamesSub: Subscription;
  private indexSub:Subscription;
  private scoresSub: Subscription;

  constructor(public gamesService:GamesService) { }

  ngOnInit() {

    this.scoresSub=this.gamesService.getScoreUpdateListener().subscribe((scores:scoreCard[])=>{
        this.scores=scores;
      });
      this.gamesService.getGames();
      this.gamesSub=this.gamesService.getGameUpdateListener().subscribe((games:any[])=>{
        this.games=games;
      });
      this.indexSub=this.gamesService.getIndexUpdateListener().subscribe((index)=>{
        this.i=index;
      });

  }
  ngOnDestroy(){
    this.scoresSub.unsubscribe();
  }
}
