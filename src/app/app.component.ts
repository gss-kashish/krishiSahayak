import { Component, OnInit } from '@angular/core';
import { CommonDataService } from './common/common-data.service';
import { UserService } from './pages/services/user/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{

  constructor(private userService: UserService, private commonDataService: CommonDataService) {}

  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe((response) => {
      this.commonDataService.user.next(response);
    });
  }
}
