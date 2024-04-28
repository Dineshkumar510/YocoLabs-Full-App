import { CrudserviceService } from './../Services/crudservice.service';
import {AuthService} from "../Services/auth.service";
import { Component, OnInit, ViewChild } from '@angular/core';
import { UserModel } from './../Model/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-userdata',
  templateUrl: './userdata.component.html',
  styleUrls: ['./userdata.component.css']
})
export class UserdataComponent implements OnInit {

  name:any;
  employee_code:any;
  salary:any;
  id:any;
  showAdd!:boolean;
  showUpdate!:boolean;
  userDetails:any;
  userData:any;

  @ViewChild ('empdetails') empdetailsForm:any;
  EmployeeDetails: UserModel[] = [];

  constructor(
    private userService: CrudserviceService,
    private router: Router,
    private AuthService: AuthService,
  ) { }

  ngOnInit(): void {
    this.AuthService.UserDetails.subscribe((data)=> {
      this.userDetails = data;
    })
    this.getDetails();
  }

  get UserName(){
    const userData = JSON.parse(localStorage.getItem('UserSessionData')!);
    return userData.username;
  }

  AddEmp(){
    this.empdetailsForm.reset();
    this.showAdd = true;
    this.showUpdate = false;
  }

  Onsubmit(details:any){
    if(this.empdetailsForm.valid){
      if(details !== null){
        this.userService.OnPostMethod(details.value).subscribe((res:any)=>{
          if(res){
          console.log(res);
          }
        });
        this.empdetailsForm.reset();
        window.location.reload();
        alert("User Details Added Successfully");
      }
    }
  }

  getDetails(){
    this.userService.OngetMethod().subscribe(
      (res:any)=> {
        this.EmployeeDetails = res;
        console.log(this.EmployeeDetails);
      }
    )
  }

  Edit(data:any){
    this.showUpdate = true;
    this.showAdd = false;
    if(data){
      this.id = data.id;
      this.name = data.name;
      this.employee_code = data.employee_code;
      this.salary = data.salary;
    }
  }

  Update(data:any){
    console.log(this.id);
    console.log("Updated Data", data.value)
    this.userService.OnUpdateMethod(data.value, this.id).subscribe(
      (res) => {
        this.EmployeeDetails = res;
      }
    );
    window.location.reload();
  }

  Delete(data:any){
    this.userService.OnDeleteMethod(data.id).subscribe(
      (res:any)=> {
        this.EmployeeDetails = res;
      }
    );
    alert("Are you sure, you want to delete this Record?");
    window.location.reload();
  }

  logout(){
    if(this.userDetails.token){
      alert("Are you sure, you want to Logout?");
      this.AuthService.logout();
    }
  }

}
