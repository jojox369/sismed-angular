import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  userName: string;
  user = JSON.parse(sessionStorage.getItem('user'));
  constructor() { }

  ngOnInit(): void {
    this.transformName();

  }

  transformName() {
    let userNameArray = this.user.nome.toLowerCase().split(' ');
    userNameArray[0] = userNameArray[0].charAt(0).toUpperCase() + userNameArray[0].slice(1);
    userNameArray[1] = userNameArray[1].charAt(0).toUpperCase() + userNameArray[1].slice(1);
    this.userName = userNameArray[0] + ' ' + userNameArray[1];

  }
}
