import { Component, OnInit, Input  } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { UserRegistrationFormComponent } from '../user-registration-form/user-registration-form.component';

@Component({
  selector: 'app-user-login-form',
  templateUrl: './user-login-form.component.html',
  styleUrls: ['./user-login-form.component.scss']
})
  export class UserLoginFormComponent implements OnInit {
    @Input() userData = { username: "", password: "" };
    constructor(
        public fetchApiData: FetchApiDataService,
        public dialogRef: MatDialogRef<UserRegistrationFormComponent>,
        public snackBar: MatSnackBar,
        public router: Router
    ) { }

    ngOnInit(): void {}
    logInUser() : void {
        this.fetchApiData.userLogin(this.userData).subscribe(res => {
            this.dialogRef.close();
            this.snackBar.open(`Login success, Welcom ${res.user.username}`, "OK", {
                duration: 2000
            });
            let user = {
                id: res.user._id,
                username: res.user.Username,
                birthday: res.user.Bbirthday,
                email: res.user.Email,
                token: res.token
            }
            
            localStorage.setItem("user", JSON.stringify(user));
            this.router.navigate(["movies"]);
        }, res => {
            this.snackBar.open("Login fail", "OK", {
                duration: 2000
            })
        })
    }
}
