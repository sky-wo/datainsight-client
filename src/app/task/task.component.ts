import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.less']
})
export class TaskComponent implements OnInit {

  current = 0;

  stepsContent = 'First-content';

  constructor() {
  }


  ngOnInit(): void {
  }


  pre(): void {
    this.current -= 1;
    this.changeContent();
  }

  next(): void {
    this.current += 1;
    this.changeContent();
  }

  done(): void {
    console.log('done');
  }

  changeContent(): void {
    switch (this.current) {
      case 0: {
        this.stepsContent = 'First-content';
        break;
      }
      case 1: {
        this.stepsContent = 'Second-content';
        break;
      }
      case 2: {
        this.stepsContent = 'third-content';
        break;
      }
      case 3: {
        this.stepsContent = 'four-content';
        break;
      }
      default: {
        this.stepsContent = 'error';
      }
    }
  }



}
