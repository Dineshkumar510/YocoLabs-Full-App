import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { BehaviorSubject, ReplaySubject, Subject, first, map, tap } from 'rxjs';
import { Router } from '@angular/router';
import { User } from '../Model/login.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  backendAuth:any = 'http://localhost:3000/auth/';
  UserdataSubject:Subject<User> = new ReplaySubject<User>(1);
  isUserLoggedIn$ = new BehaviorSubject<boolean>(false);
  userId: Pick<User, "userId"> | undefined;
  private tokenexpirationTimer : any;

  httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({ "Content-Type": "application/json" }),
  };

  constructor(
    private http: HttpClient,
    private router: Router,
  ) { }


  signUp(data:any){
    return this.http.post<any>(this.backendAuth+'signup', data, this.httpOptions)
    .pipe(
      first(),
      map((res:any)=> {
      if(res){
        this.router.navigate(['/login']);
      }
      return res;
    }));
  }

  login(data:any){
    return this.http.post<any>(this.backendAuth+'login', data, this.httpOptions)
    .pipe(
      first(),
      tap(resData => {
        this.handleAuthenication(resData.token, resData.username, resData.userId, resData.sessionDuration, resData.role)
        console.log("Response Data:",resData)
      },
       (tokenObject: { token: string; userId: Pick<User, "userId"> }) => {
        this.userId = tokenObject.userId;
        localStorage.setItem("token", tokenObject.token);
        this.isUserLoggedIn$.next(true);
       }
      ),
      map((res:any)=> {
        if(res){
          this.router.navigate(['/data']);
        }
      return res;
    }));
  }

  SuccessLoginData(data:any){
    this.UserdataSubject.next(data);
  }

  get UserDetails(){
    return this.UserdataSubject;
  }


  logout(){
    if(this.UserdataSubject){
      this.UserdataSubject.next(null!);
      this.router.navigate(['/login']);
      localStorage.clear();
      if(this.tokenexpirationTimer){
        clearTimeout(this.tokenexpirationTimer);
      }
      this.tokenexpirationTimer = null;
    }
  }

  // Storing the User Session Data in Local Storage and retriving the User in UserSessionData element
autoLogin(){
  const userData : {
    uid: string,
    username: string,
    role:string,
    _token : string,
    _tokenExpirationDate: string } = JSON.parse(localStorage.getItem('UserSessionData') || '{}');

    if(!userData){
      return;
    }
    const LoadUser = new User( userData.username, userData.uid, userData.role, userData._token, new Date(userData._tokenExpirationDate));
    if(LoadUser.token){
      this.UserdataSubject.next(LoadUser);
      const expirationDuration =  new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
      this.autoLogOut(expirationDuration);
    }
}

  autoLogOut(expirationDuration : number){
    this.tokenexpirationTimer = setTimeout(()=>{
      this.logout();
    }, expirationDuration);
  }


  handleAuthenication(token: string, email: string, uid: string, expiresIn:any, role: string){
    const exiprationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(uid, email, role, token, exiprationDate);
    this.UserdataSubject.next(user);
    this.autoLogOut(expiresIn * 1000);
    localStorage.setItem('UserSessionData', JSON.stringify(user));
    var Token1 = token;
    const tokenValue = Token1.replace(/^"|"$/g, '')
    localStorage.setItem('UserSessionToken', tokenValue);
  }

}
