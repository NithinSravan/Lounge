import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { scoreCard } from './scorecard.model';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LeaderboardService {
  private scores:scoreCard[]=[];
  private scoreUpdated= new Subject<scoreCard[]>();
  constructor(private http:HttpClient) { }

}
