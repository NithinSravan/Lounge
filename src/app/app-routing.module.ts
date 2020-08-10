import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { GamesComponent } from './games/games.component';
import{LoginComponent}from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { AuthGuard } from './auth/auth.guard';
import { ProfileComponent } from './home/profile/profile.component';
import { AddgameComponent } from './addgame/addgame.component';

const routes: Routes = [
  {path:'',component:HomeComponent,canActivate:[AuthGuard]},
  {path:'addgame',component:AddgameComponent, canActivate:[AuthGuard]},
  {path:'games',component:GamesComponent, canActivate:[AuthGuard]},
  {path:'profile/:id',component:ProfileComponent,canActivate:[AuthGuard]},
  {path:'login',component:LoginComponent},
  {path:'signup',component:SignupComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers:[AuthGuard]
})
export class AppRoutingModule { }
