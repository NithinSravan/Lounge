import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {ReactiveFormsModule,FormsModule}from '@angular/forms';
import{HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { PostsComponent } from './home/posts/posts.component';
import { LeaderboardComponent } from './home/leaderboard/leaderboard.component';
import { ProfileComponent } from './home/profile/profile.component';
import { GamesComponent } from './games/games.component';
import { PostCreateComponent } from './home/posts/post-create/post-create.component';
import { PostListComponent } from './home/posts/post-list/post-list.component';
import{LoginComponent}from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { AuthInterceptor } from './auth/auth-interceptor';
import { SearchComponent } from './header/search/search.component';
import { NotificationsComponent } from './home/notifications/notifications.component';
import { AddgameComponent } from './addgame/addgame.component';
import { ActivityComponent } from './home/activity/activity.component';
import {MatBadgeModule} from '@angular/material/badge';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    PostsComponent,
    LeaderboardComponent,
    GamesComponent,
    PostCreateComponent,
    PostListComponent,
    LoginComponent,
    SignupComponent,
    ProfileComponent,
    SearchComponent,
    NotificationsComponent,
    AddgameComponent,
    ActivityComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    MatBadgeModule
  ],
  providers: [{provide:HTTP_INTERCEPTORS, useClass:AuthInterceptor,multi:true}],
  bootstrap: [AppComponent]
})
export class AppModule { }
