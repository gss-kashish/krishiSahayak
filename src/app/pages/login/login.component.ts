import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent  {
  buttonClicked!: Boolean;

  constructor(
    private router: Router) { }

  login() {
    this.buttonClicked = true;
    this.router.navigate(['/main'])
          this.buttonClicked = false;
  }

}