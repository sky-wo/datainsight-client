import {Component, OnInit} from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-policy',
  templateUrl: './policy.component.html',
  styleUrls: ['./policy.component.less']
})
export class PolicyComponent implements OnInit {

  // lists = [['Get to work', 'Pick up groceries', 'Go home', 'Fall asleep'],['Get up', 'Brush teeth', 'Take a shower', 'Check e-mail', 'Walk dog'],['Get up', 'Brush teeth', 'Take a shower', 'Check e-mail', 'Walk dog']]

  todo = ['Get to work', 'Pick up groceries', 'Go home', 'Fall asleep'];
  done = ['Get up', 'Brush teeth', 'Take a shower', 'Check e-mail', 'Walk dog'];
  done2 = ['666', 'Brush teeth', 'Take a shower', 'Check e-mail', 'Walk dog'];

  ngOnInit(): void {

  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }
}
