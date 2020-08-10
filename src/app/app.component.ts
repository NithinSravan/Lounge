import { Component, OnInit, HostListener } from '@angular/core';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  // @HostListener('window:scroll', ['$event'])
  // onWindowScroll(e) {
  //    if (window.pageYOffset) {
  //      let element = document.getElementById('navbar');
  //      let leaderboard=document.getElementById('leaderboard');
  //      element.classList.add('sticky');
  //      leaderboard.classList.add('sticky');
  //    } else {
  //     let element = document.getElementById('navbar');
  //     let leaderboard=document.getElementById('leaderboard');
  //       element.classList.remove('sticky');
  //       leaderboard.classList.remove('sticky');
  //    }
  // }


  title = 'Lounge';
  constructor(private authService:AuthService){}

  ngOnInit(){
    this.authService.autoAuthUser();
  }
}
