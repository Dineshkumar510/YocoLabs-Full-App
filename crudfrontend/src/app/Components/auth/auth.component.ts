import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../Services/auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  login: boolean = false;
  email:any;
  passwordValue: string = '';
  password:any;
  username:any;
  LoginPassword:any;
  show:boolean = false;
  isAdmin:boolean = false;
  loginToken: any;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.password = 'password';
  }


  toggle() {
    this.router.navigate(['/signup']);
  }

  LoginSubmit(form:NgForm){
    if(!form.valid){
      return;
    } else {
      const formatData = {
      username : form.value.username,
      password : form.value.password
      }
      form.reset();
      this.authService.login(formatData).subscribe((data: any) => {
        this.loginToken = data;
        this.authService.SuccessLoginData(this.loginToken);
      }, (errorMessage: any) => {
        console.log(errorMessage);
      });
    }
  }

  onClick() {
    if (this.password === 'password') {
      this.password = 'text';
      this.show = true;
    } else {
      this.password = 'password';
      this.show = false;
    }
  }
}
