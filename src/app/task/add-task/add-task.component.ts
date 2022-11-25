import { Component, OnInit } from '@angular/core';
import { TaskService } from 'src/app/core/service/task.service';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.less']
})
export class AddTaskComponent implements OnInit {

  current = 0;
  constructor(private taskService: TaskService) {
    this.taskService.currentStep$.subscribe(r => {
      this.current = r
    })
  }

  ngOnInit(): void {
  }


  get getStepItems() {
    return this.taskService.stepItems
  }
}
