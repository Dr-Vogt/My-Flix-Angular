import { Component, OnInit, Input  } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { UserRegistrationFormComponent } from '../user-registration-form/user-registration-form.component';
import { UserLoginRequest } from '../../types';

@Component({
  selector: 'app-user-login-form',
  templateUrl: './user-login-form.component.html',
  styleUrls: ['./user-login-form.component.scss']
})
  export class UserLoginFormComponent implements OnInit {
    @Input() userData: UserLoginRequest = {
       Username: "",
       Password: "",
       };
    constructor(
        public fetchApiData: FetchApiDataService,
        public dialogRef: MatDialogRef<UserRegistrationFormComponent>,
        public snackBar: MatSnackBar,
    ) { }

    ngOnInit(): void {}
    loginUser(): void {
      this.fetchApiData.userLogin(this.userData).subscribe(
        (response) => {
          this.dialogRef.close();
          this.snackBar.open(response, 'OK', {
            duration: 2000,
          });
          localStorage.setItem('currentUser', JSON.stringify(response.user));
          localStorage.setItem('token', response.token);
        },
        (response) => {
          this.snackBar.open(response, 'NOT OK', {
            duration: 9000,
          });
        }
      );
    }
  }