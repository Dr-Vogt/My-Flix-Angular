import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DirectorInfoComponent } from '../director-info/director-info.component';
import { GenreInfoComponent } from '../genre-info/genre-info.component';
import { MovieSynopsisComponent } from '../movie-synopsis/movie-synopsis.component';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss']
})
export class MovieCardComponent {
  movies: any[] = [];
  favoriteMovies: any[] = [];
  constructor(
    public fetchApiData: FetchApiDataService,
    public snackBar: MatSnackBar,
    public dialog: MatDialog) { }

ngOnInit(): void {
  this.getMovies();
  this.getFavoriteMovies();
}

getMovies(): void {
  this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
      console.log(this.movies);
      return this.movies;
    });
  }

  openDirectorDialog(name: string, bio: string, birth: string): void {
    this.dialog.open(DirectorInfoComponent, {
      data: {
        Name: name,
        Bio: bio,
        Birth: birth
      },
      width: '400px'
    });
  }

  openGenreDialog(name: string, description: string): void {
    this.dialog.open(GenreInfoComponent, {
      data: {
        Name: name,
        Description: description
      },
      width: '400px'
    })
  }

  openSynopsisDialog(description: string): void {
    this.dialog.open(MovieSynopsisComponent, {
      data: {
        Description: description
      },
      width: '400px'
    })
  }
  getFavoriteMovies(): void {
    const username = localStorage.getItem('currentUser');
    if (username) {
      this.fetchApiData.getOneUser(JSON.parse(username).Username).subscribe((user: any) => {
        this.favoriteMovies = user.FavoriteMovies;
        console.log('Favorite Movies:', this.favoriteMovies);
      });
    }
  }

  isFavorite(movieId: string): boolean {
    return this.favoriteMovies.includes(movieId);
  }

  toggleFavorite(movieId: string): void {
    console.log('Toggle favorite for movie ID:', movieId);
    if (this.isFavorite(movieId)) {
      this.removeFromFavorites(movieId);
    } else {
      this.addToFavorites(movieId);
    }
  }

  addToFavorites(movieId: string): void {
    const user = localStorage.getItem('currentUser');
    if (user) {
      try {
        const username = JSON.parse(user).Username;
        console.log(`Adding movie ID: ${movieId} to favorites for user: ${username}`);
        this.fetchApiData.addFavoriteMovie(username, movieId).subscribe(
          (result) => {
            console.log('Add to favorites result:', result);
            this.snackBar.open('Movie added to favorites', 'OK', { duration: 2000 });
            this.favoriteMovies.push(movieId);
          },
          (error) => {
            console.error('Error adding to favorites:', error);
            this.snackBar.open('Something went wrong', 'OK', { duration: 2000 });
          }
        );
      } catch (error) {
        console.error('Error parsing currentUser from localStorage', error);
        this.snackBar.open('Error with user data. Please log in again.', 'OK', { duration: 2000 });
      }
    } else {
      this.snackBar.open('User not logged in', 'OK', { duration: 2000 });
    }
  }
  
  removeFromFavorites(movieId: string): void {
    const user = localStorage.getItem('currentUser');
    if (user) {
      try {
        const username = JSON.parse(user).Username;
        console.log(`Removing movie ID: ${movieId} from favorites for user: ${username}`);
        this.fetchApiData.deleteFavoriteMovie(username, movieId).subscribe(
          (result) => {
            console.log('Remove from favorites result:', result);
            this.snackBar.open('Movie removed from favorites', 'OK', { duration: 2000 });
            this.favoriteMovies = this.favoriteMovies.filter(id => id !== movieId);
          },
          (error) => {
            console.error('Error removing from favorites:', error);
            this.snackBar.open('Something went wrong', 'OK', { duration: 2000 });
          }
        );
      } catch (e) {
        console.error('Error parsing currentUser from localStorage', e);
        this.snackBar.open('Error with user data. Please log in again.', 'OK', { duration: 2000 });
      }
    } else {
      this.snackBar.open('User not logged in', 'OK', { duration: 2000 });
    }
  }
  
}
