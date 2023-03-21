import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonDataService } from 'src/app/common/common-data.service';
import { UserModel } from 'src/app/model/user-model';
import { UserService } from '../services/user/user.service';

@Component({
  selector: 'app-layouts',
  templateUrl: './layouts.component.html',
  styleUrls: ['./layouts.component.scss']
})
export class LayoutsComponent implements OnInit {

  username!: string;
  currentUserModel!: UserModel;

  constructor(private router: Router,
    private commonDataService: CommonDataService,
    private userService: UserService) {
  }

  ngOnInit(): void {
    this.username = JSON.parse(JSON.stringify(localStorage.getItem('name')!));
    this.commonDataService.user.subscribe((response) => {
      if(response) {
        this.currentUserModel = response;
        let obj: any = response.operations;
        let keys = Object.keys(obj);
        let filtered : Array<any> = [];
        keys.filter(key => {
          if(obj[key])
            filtered.push(key);
        });
        this.commonDataService.permissions.next(filtered);
      }
    })
  }

  showNavigationItems(itemLabel: string): boolean {
    return this.currentUserModel.products.filter(product => product.productLabel === itemLabel).length > 0;
  }

  toggleSidemenu() {
    var body = document.getElementById("body");
    if(body?.classList.contains("sidemenu-open")) {
      body.classList.remove("sidemenu-open");
    } else {
      body?.classList.add("sidemenu-open");
    }
  }

  logout() {
    this.commonDataService.permissions.next(undefined);
    this.commonDataService.user.next(undefined);
    localStorage.removeItem('authToken');
    localStorage.removeItem('name');
    this.router.navigate(['/']);
  }

  layoutsUserSettings() {
    this.router.navigate(['/main/userSettings']);
  }
  
  securityGroups() {
    this.router.navigate(['/main/security-groups']);
  }

  productSettings() {
    this.router.navigate(['/main/product-settings']);
  }

}
