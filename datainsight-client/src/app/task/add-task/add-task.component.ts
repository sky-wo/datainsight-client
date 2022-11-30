import {Component, OnInit} from '@angular/core';
import {CreateTaskCommunicationService} from "./create-task-communication.service";

@Component({
  selector: 'app-add-task', templateUrl: './add-task.component.html', styleUrls: ['./add-task.component.less']
})
export class AddTaskComponent implements OnInit {


  currentStep = 0

  constructor(private createTaskCommunicationService: CreateTaskCommunicationService) {
  }

  ngOnInit(): void {
    this.createTaskCommunicationService.currentStep$.subscribe(r => {
      this.currentStep = r
    })
  }

}
