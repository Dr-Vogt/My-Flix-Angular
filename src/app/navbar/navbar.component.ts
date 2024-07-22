import { Component } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
 // currentUser = undefined
  constructor(
    public fetchApiData: FetchApiDataService,
    public router: Router,
    public snackBar: MatSnackBar
  ) { 
  }

  ngOnInit(): void {
   // this.getUserFromLocalStorage()
  }

 // getUserFromLocalStorage(){
   // const storageUser = localStorage.getItem('currentUser')
  //  if(storageUser){
  //    this.currentUser = JSON.parse(storageUser)
   // }else {
  //    this.currentUser = undefined
  //  }
 // }

  public launchMovies(): void {
    this.router.navigate(['movies']);
  }

  public launchProfile(): void {
    this.router.navigate(['profile']);
  }

  ngDoCheck() {
   // this.getUserFromLocalStorage();
  }

  logoutUser(): void {
   // this.getUserFromLocalStorage();
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    this.router.navigate(['/welcome']);
  }

}
