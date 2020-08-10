import { Component, OnInit, OnDestroy } from '@angular/core';
import { scoreCard } from './scorecard.model';
import { Subscription } from 'rxjs';
import { LeaderboardService } from './leaderboard.service';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/auth/user.model';
import { GamesService } from 'src/app/games/games.service';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.css']
})
export class LeaderboardComponent implements OnInit,OnDestroy {

  scores:scoreCard[]=[];
  private scoresSub: Subscription;

  constructor(public gameService:GamesService) { }

  ngOnInit() {
    this.gameService.getScores();

    this.scoresSub=this.gameService.getScoreUpdateListener().subscribe((scores:scoreCard[])=>{
        this.scores=scores;
      });

  }
  ngOnDestroy(){
    console.log("destoryed")
    this.scoresSub.unsubscribe();
  }
}
