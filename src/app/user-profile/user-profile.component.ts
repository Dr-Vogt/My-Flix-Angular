import { Component, OnInit, Input } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

  @Input() userData = { Username: '', Password: '', Email: '', Birthday: '', FavoriteMovies: [] };
  FavoriteMovies: any[] = [];
  movies: any[] = [];
  user: any = {};

  constructor(
    public fetchProfile: FetchApiDataService,
    public snackBar: MatSnackBar,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.userProfile();
  }

  userProfile(): void {
    const username = localStorage.getItem('currentUser');
    console.log('Retrieved username from localStorage:', username);
    
    if (username) {
      this.fetchProfile.getOneUser(username).subscribe((user: any) => {
        console.log('Fetched user from API:', user);
        this.user = user;
        this.userData.Username = user.Username;
        this.userData.Password = user.Password;
        this.userData.Email = user.Email;
        this.userData.Birthday = user.Birthday;
        this.getFavMovies();
      });
    }
  }

  updateProfile(): void {
    const username = localStorage.getItem('currentUser');
    if (username) {
      this.fetchProfile.updateUser(JSON.parse(username).Username, this.userData).subscribe((response) => {
        console.log('Profile Update', response);
        localStorage.setItem('user', JSON.stringify(response));
        this.snackBar.open('Profile updated successfully', 'OK', {
          duration: 2000
        });
      });
    }
  }

  deleteUser(): void {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      const username = localStorage.getItem('currentUser');
      if (username) {
        this.fetchProfile.deleteUser(JSON.parse(username).Username).subscribe((response) => {
          console.log('Deleted User', response);
          localStorage.clear();
          this.router.navigate(['welcome']);
        });
      }
    }
  }

  getFavMovies(): void {
    this.fetchProfile.getAllMovies().subscribe((movies: any[]) => {
      this.movies = movies;
      this.FavoriteMovies = movies.filter((movie: any) => this.user.FavoriteMovies.includes(movie._id));
      console.log(`Here is this users ${this.FavoriteMovies}`);
    });
  }
}
