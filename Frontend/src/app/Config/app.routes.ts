import { Routes } from '@angular/router';
import { HomeMainComponent } from '../Components/HomePage/home-main/home-main.component';
import { Error404Component } from '../Components/Utils/error404/error404.component';
import { SignupComponent } from '../Components/Authentication/signup/signup.component';
import { LoginComponent } from '../Components/Authentication/login/login.component';
import { DashboardMainComponent } from '../Components/Dashboard/dashboard-main/dashboard-main.component';
import { FAQComponent } from '../Components/StaticPages/faq/faq.component';
import { WhatsESNComponent } from '../Components/StaticPages/whats-esn/whats-esn.component';
import { TheTeamComponent } from '../Components/StaticPages/the-team/the-team.component';

// Dashboard
import { MyProfileMainComponent } from '../Components/Dashboard/MyProfile/my-profile-main/my-profile-main.component';
import { AdminMainComponent } from '../Components/Dashboard/Admin/admin-main/admin-main.component';

// Guards
import { AuthGuard } from '../Guards/auth.guard';
import { AdminGuard } from '../Guards/admin.guard';
import { BureauGuard } from '../Guards/bureau.guard';

export const routes: Routes = [
  { path: 'home', component: HomeMainComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'login', component: LoginComponent },

  {
    path: 'dashboard',
    component: DashboardMainComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', component: MyProfileMainComponent },
      //{ path: 'myDash', component: MyDashMainComponent },
      { path: 'myProfile', component: MyProfileMainComponent },
      //{ path: 'events', component: EventsMainComponent },
      {
        path: 'admin',
        component: AdminMainComponent,
        canActivate: [AdminGuard],
      },
    ],
  },

  { path: 'faq', component: FAQComponent },
  { path: 'esn', component: WhatsESNComponent },
  { path: 'TheTeam', component: TheTeamComponent },

  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', component: Error404Component },
];
