import { Component } from '@angular/core';
import { HomeFooterComponent } from '../../../HomePage/home-footer/home-footer.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../../Services/Authentication/auth.service';
import { MembersService } from '../../../../Services/Members/members.service';

@Component({
  selector: 'app-my-profile-main',
  standalone: true,
  imports: [HomeFooterComponent, CommonModule, FormsModule],
  templateUrl: './my-profile-main.component.html',
  styleUrl: './my-profile-main.component.css',
})
export class MyProfileMainComponent {
  successMessage = '';
  errorMessage = '';
  nickname = 'Jayjay';
  firstname = 'John';
  lastname = 'Doe';
  email = 'johndoe@gmail.com';
  year = 'A4';
  program = 'Classic';
  school = 'ESILV';
  role = 'Member';
  password = '';
  newPassword = '';
  confirmNewPassword = '';

  constructor(
    private authService: AuthService,
    private memberService: MembersService
  ) {}

  ngOnInit() {
    console.log(this.getUserInfo());
  }

  getUserInfo() {
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('No token provided !');
      return;
    }

    this.authService.whoAmI(token).subscribe(
      (response) => {
        console.log(response);
        this.nickname = response.userNickname;
        this.firstname = response.userFirstName;
        this.lastname = response.userLastName;
        this.email = response.userEmail;
        this.year = response.userYear;
        this.program = response.userProgram;
        this.school = response.userSchool;
      },
      (error) => {
        console.error('Error fetching user info:', error);
      }
    );
  }

  modifyUserInfo() {
    this.errorMessage = '';
    this.successMessage = '';

    const token = localStorage.getItem('token');

    if (!token) {
      console.log('No token provided !');
      return;
    }

    this.memberService
      .modifyUser(token, {
        nickname: this.nickname,
        firstname: this.firstname,
        lastname: this.lastname,
        email: this.email,
        year: this.year,
        program: this.program,
        school: this.school,
        password: this.password,
      })
      .subscribe(
        (response) => {
          console.log(response);
          this.successMessage = 'Successfully updated user !';
        },
        (error) => {
          console.error('Error updating user !', error);
          this.errorMessage = 'Error updating user !';
        }
      );
  }
}
