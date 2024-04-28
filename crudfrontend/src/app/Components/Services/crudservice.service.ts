import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { ReplaySubject, Subject, map } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class CrudserviceService {

  backendApi:any = 'http://localhost:3000/api/users/';

  constructor(
    private http: HttpClient,
    private router: Router,
  ) { }

  OnPostMethod(data:any){
    return this.http.post<any>(this.backendApi, data)
    .pipe(map((res:any)=> {
      return res;
    }))
  }

  OngetMethod(){
    return this.http.get<any>(this.backendApi)
    .pipe(map((res:any)=> {
      return res;
    }));
  }

  OnUpdateMethod(data:any, id:any){
    return this.http.put<any>(this.backendApi+`${id}`, data)
    .pipe(map((res:any)=> {
      return res;
    }));
  }

  OnDeleteMethod(id:any){
    return this.http.delete<any>(this.backendApi+`${id}`)
    .pipe(map((res:any)=> {
      return res;
    }));
  }

}
