import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { User } from '../auth/user.model';
import { scoreCard } from '../home/leaderboard/scorecard.model';


@Injectable({
  providedIn: 'root'
})
export class GamesService {
  private scores:scoreCard[]=[];

  private scoreUpdated= new Subject<scoreCard[]>();

  constructor(private http:HttpClient) { }
  getScores(){
    this.http.get<{scores:scoreCard[]}>('http://localhost:3000/scores')
    .subscribe(scoresArr=>{
      console.log(scoresArr)
       this.scores=scoresArr.scores;
       this.scoreUpdated.next([...this.scores]);
     });
  }
  getScoreUpdateListener(){
    return this.scoreUpdated.asObservable();
  }

  updateScore(score:number){
    const scorecard={
      score
    }
    console.log(scorecard)
     this.http.post<{message:string,scorecard:scoreCard}>("http://localhost:3000/score",scorecard)
    .subscribe(res=>{
      const scorecard={
        id:res.scorecard.id,
        best:res.scorecard.best,
        player:res.scorecard.player,
        playername:res.scorecard.playername
      }
      console.log(res.message);
      this.scores.push(scorecard);
      this.getScores();
     })
  }

}
