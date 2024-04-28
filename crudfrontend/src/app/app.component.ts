import { Component, OnDestroy, OnInit } from '@angular/core';
import {AuthService} from '../app/Components/Services/auth.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

  isAuthenticated:boolean = false;
  userSub: Subscription | undefined;

  constructor(private auth: AuthService){
  }

  ngOnInit(): void {
    this.userSub = this.auth.UserdataSubject.subscribe(user => {
      this.isAuthenticated = !user ? false : true
    })
    this.auth.autoLogin();
  }

  signOut(){
    this.auth.logout();
  }

  ngOnDestroy(): void {
    this.userSub!.unsubscribe();
  }

}
