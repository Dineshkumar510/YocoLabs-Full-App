import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../Services/auth.service';
import { ToastService } from '../../Services/toast.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  requirements: { regex: RegExp, message: string, isValid: boolean }[] = [
    { regex: /.{8}/, message: 'Password must be at least 8 characters long.', isValid: false },
    { regex: /[0-9]/, message: 'At least one number (0...9) is required.', isValid: false },
    { regex: /[a-z]/, message: 'At least one lowercase letter (a...z) is required.', isValid: false },
    { regex: /[A-Z]/, message: 'At least one uppercase letter (A...Z) is required.', isValid: false },
    { regex: /[!@#$%^&*(),.?":{}|<>]/, message: 'At least one special character (!...$) is required.', isValid: false },
  ];

  email:any;
  passwordValue: string = '';
  password:any;
  LoginEmail:any;
  LoginPassword:any;
  show:boolean = false;
  role:any;
  validRequirements: boolean[] = [false, false, false, false, false];

  constructor(
    private router: Router,
    private ToastService: ToastService,
    private AuthService: AuthService,
  ) {}

  ngOnInit(): void {
    this.password = 'password';
    const passwordInput: HTMLInputElement | null = document.getElementById('password') as HTMLInputElement;
    if (passwordInput) {
      passwordInput.addEventListener('input', () => {
        this.checkPasswordRequirements();
        this.updateRequirementsUI(this.requirements);
      });
    }
  }

  onPasswordInput() {
    this.checkPasswordRequirements();
    this.updateRequirementsUI(this.requirements);
  }

  private checkPasswordRequirements() {
    this.passwordValue = this.passwordValue.trim();
    this.requirements.forEach(requirement => {
      requirement.isValid = requirement.regex.test(this.passwordValue);
    });
  }

  isRequirementValid(requirement: { regex: RegExp, message: string, isValid: boolean }): boolean {
    return requirement.isValid;
  }


  updateRequirementsUI(requirements: { regex: RegExp, message: string, isValid: boolean }[]) {
    const passwordMessage = document.getElementById('password-message');
    if (passwordMessage) {
      requirements.forEach((requirement, index) => {
        const requirementItem = passwordMessage.children[index] as HTMLElement;

        if (requirementItem) {
          if (requirement.isValid) {
            this.validRequirements[index] = true;
            requirementItem.classList.remove("invalid");
            requirementItem.classList.add("valid");
          } else {
            this.validRequirements[index] = false;
            requirementItem.classList.remove("valid");
            requirementItem.classList.add("invalid");
          }
        }
      });
    }
  }


  SignUpSubmit(form:NgForm){
    if(!form.valid){
      return;
    } else{
      const FormatData = {
       username : form.value.username,
       password : form.value.password,
      role : this.role ? 'admin' : 'user',
      }
      this.AuthService.signUp(FormatData).subscribe(data => {
        console.log(data);
        if(data.message){
        alert(data.message);
        //this.ToastService.openSuccess(data.message);
        }
      }, (errorMessage: any) => {
        console.log(errorMessage);
      });
    }
  }

  toggle(){
    this.router.navigate(['/login']);
  }

}
