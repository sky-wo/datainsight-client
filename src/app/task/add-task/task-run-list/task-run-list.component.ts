import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TaskService } from 'src/app/core/service/task.service';
import { TaskRun, TaskRunState } from 'src/app/core/type/graphql-type';

@Component({
  selector: 'app-task-run-list',
  templateUrl: './task-run-list.component.html',
  styleUrls: ['./task-run-list.component.less']
})
export class TaskRunListComponent implements OnInit {

  dataSource: TaskRun[] = []

  constructor(private taskservice: TaskService, private activateRoute: ActivatedRoute,) { }

  ngOnInit(): void {
    const taskId = this.activateRoute.snapshot.paramMap.get("taskId")
    //分页暂时写死，后续修改
    if (taskId) {
      this.taskservice.queryTaskRunsByTaskId(taskId, 10, 0, 100, "0").valueChanges.subscribe({
        next: r => {
          if (r.data.task.taskRuns?.items) this.dataSource = r.data.task.taskRuns?.items
        },
        error: e => {
          console.error("taskRun发生未知错误", e)
        }
      })
    }

  }
}
