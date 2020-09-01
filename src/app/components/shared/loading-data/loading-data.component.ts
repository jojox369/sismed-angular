import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-loading-data',
  templateUrl: './loading-data.component.html',
  styleUrls: ['./loading-data.component.css'],
})
export class LoadingDataComponent implements OnInit {
  @Input() message: string;

  constructor() {}

  ngOnInit(): void {}
}
