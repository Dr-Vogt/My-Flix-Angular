import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

const apiUrl = 'https://testingmovieapi.onrender.com';

type UserLoginRequest = {
  username: string;
  password: string;
}

type UserLoginResponse = {
  user:{
     Username:string;
   Password: string;
   Email: string;
   Birthday: string;
   
  }
  token: string;
}

@Injectable({
  providedIn: 'root'
})

export class FetchApiDataService {

  constructor(private http: HttpClient) {
   }
  
  public userRegistration(userDetails: any): Observable<any> {
    console.log(userDetails);
    return this.http.post(apiUrl + '/signup', userDetails).pipe(
      catchError(this.handleError)
    );
  } 


  
  public userLogin(userDetails: UserLoginRequest): Observable<any> {
    console.log(userDetails);
    return this.http.post<UserLoginResponse>(apiUrl + `/login?username=${userDetails.username}&password=${userDetails.password}`, userDetails)
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  public getAllMovies(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get<any>(apiUrl + '/movies', {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  public getMovieByTitle(title: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get<any>(`${apiUrl}/movies/${title}`, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  public getGenreByName(genreName: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get<any>(`${apiUrl}/genre/${genreName}`, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  public getDirectorByName(directorName: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get<any>(`${apiUrl}/director/${directorName}`, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  public addFavoriteMovie(username: string, movieId: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.post<any>(`${apiUrl}/users/${username}/movies/${movieId}`, {}, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  public deleteFavoriteMovie(userID: string, title: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.delete(apiUrl + `/user/${userID}/${title}`,
    {headers: new HttpHeaders({
        Authorization: 'Bearer' + token,
    })}).pipe(
        map(this.extractResponseData), catchError(this.handleError)
    );
}

public getUserList(): Observable<any> {
  const token = localStorage.getItem('token');
  return this.http.get(apiUrl + `/users`, {headers: new HttpHeaders(
  {
      Authorization: 'Bearer' + token,
  })}).pipe(
      map(this.extractResponseData), catchError(this.handleError)
  );
}

  public updateUser(username: string, userDetails: any): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.put<any>(`${apiUrl}/users/${username}`, userDetails, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  public deleteUser(username: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.delete<any>(`${apiUrl}/users/${username}`, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
      console.error('Some error occurred:', error.error.message);
    } else {
      console.error(
        `Error Status code ${error.status}, ` +
        `Error body is: ${error.error}`);
    }
    return throwError(
      'Something bad happened; please try again later.');
  }

  private extractResponseData(res: any): any {
    return res || {};
  }
}
