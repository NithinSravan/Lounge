import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { scoreCard } from '../home/leaderboard/scorecard.model';
import { AddgameService } from '../addgame/addgame.service';
import { environment } from 'src/environments/environment';

const HOST_URL=environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class GamesService {
  private scores:scoreCard[]=[];
  games:any[]=[]
  i:number;
  private indexUpdated=new Subject<number>();
  private scoreUpdated= new Subject<scoreCard[]>();

  constructor(private http:HttpClient,public addgameService:AddgameService) { }
  getScores(gamename:string){
    console.log(gamename)
    if(gamename===''){
      return;
    }
    this.http.get<{scores:scoreCard[]}>(HOST_URL+'scores/'+gamename)
    .subscribe(scoresArr=>{
      console.log(scoresArr)
       this.scores=scoresArr.scores;
       this.scoreUpdated.next([...this.scores]);
     });
  }
  getScoreUpdateListener(){
    return this.scoreUpdated.asObservable();
  }

  updateScore(score:number,gamename:string){
    const scorecard={
      score,gamename
    }
    console.log(scorecard)
     this.http.post<{message:string,scorecard:scoreCard}>(HOST_URL+"score",scorecard)
    .subscribe(res=>{
      const scorecard={
        id:res.scorecard.id,
        gameId:res.scorecard.gameId,
        best:res.scorecard.best,
        player:res.scorecard.player,
        playername:res.scorecard.playername
      }
      console.log(res.message);
      this.scores.push(scorecard);
      this.getScores(gamename);
     })
  }
  getGames(){
    this.http.get<{games:any[]}>(HOST_URL+'games')
    .subscribe(gamesArr=>{
         this.games=gamesArr.games;
         this.addgameService.gameUpdated.next([...this.games]);
      });
  }

  getGameUpdateListener(){
    return  this.addgameService.gameUpdated.asObservable();
  }
  getIndexUpdateListener(){
    return  this.indexUpdated.asObservable();
  }
  getGamename(i){
    if(this.games.length){
      return this.games[i].gamename;
    }
    else{
      return ""
    }

  }
  gameSelect(i){
    console.log(this.games)
    this.i=i;
    this.indexUpdated.next(this.i);
    document.querySelector('iframe').src=this.games[i].url;
    document.getElementById('game-selector').style.display="none";
    document.getElementById('gamehub-header').style.display="none";
    document.getElementById('line').style.display="none";
  }
}
