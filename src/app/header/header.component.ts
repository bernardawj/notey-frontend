import { Component, OnInit } from '@angular/core';
import { UserService } from '../shared/user/user.service';
import { User } from '../shared/user/user.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  user: User | null;

  constructor(private userService: UserService) {
    this.user = null;
  }

  ngOnInit(): void {
    this.userService.getUserDetails().subscribe(
      response => this.user = response
    );
  }

}
