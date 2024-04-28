import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AuthComponent} from './Components/auth/auth.component';
import { UserdataComponent } from './Components/userdata/userdata.component';
import { RegisterComponent } from './Components/auth/register/register.component';
import {AuthGuard} from './Components/Auth Guard/auth.guard';

const routes: Routes = [
  {path: '', pathMatch:'full', redirectTo: '/login'},
  {path:'login', component: AuthComponent},
  {path:'signup', component:RegisterComponent},
  {path: 'data', component: UserdataComponent, canActivate: [AuthGuard]},
  {path: "**", redirectTo: '/login'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
