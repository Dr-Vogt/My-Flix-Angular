import { Component, OnInit, Input } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { forkJoin } from 'rxjs';

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
    const userString = localStorage.getItem('currentUser');
    if (userString) {
      this.user = JSON.parse(userString);
      const username = this.user.Username;
      console.log('Retrieved username from localStorage:', username);
      if (username) {
        this.fetchProfile.getOneUser(username).subscribe((user: any) => {
          console.log('Fetched user from API:', user);
          this.userData = user;
          this.getFavMovies();
        });
      }
    }
  }


  updateProfile(): void {
    const username = localStorage.getItem('currentUser');
    if (username) {
      this.fetchProfile.updateUser(JSON.parse(username).Username, this.userData).subscribe((response) => {
        console.log('Profile Update', response);
        //localStorage.setItem('user', JSON.stringify(response));
        localStorage.setItem('currentUser', response.Username);
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
    const userString = localStorage.getItem('currentUser');
    if (userString) {
      const username = JSON.parse(userString).Username;
      if (username) {
        this.fetchProfile.getOneUser(username).subscribe((user: any) => {
          this.user = user;
          this.userData.FavoriteMovies = user.FavoriteMovies;
  
          const movieObservables = user.FavoriteMovies.map((movieId: string) =>
            this.fetchProfile.getMovieById(movieId)
          );
  
          forkJoin(movieObservables).subscribe((movies: unknown) => {
            const movieArray = movies as any[]; // Here, we treat 'movies' as an array
            this.FavoriteMovies = movieArray.filter(movie => movie); // Store non-null movies
            console.log('Favorite movies:', this.FavoriteMovies);
          });
        });
      }
    }
  }
  
  
  
  
}
