import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ActorService } from '../core/service/actor.service';
import { TaskService } from '../core/service/task.service';
import { Actor, TaskState } from '../core/type/graphql-type';


interface listTaskItem {
  id: string
  state: TaskState
  actor: { name: string }
}
@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.less']
})
export class TaskComponent implements OnInit {



  isVisible = false;

  listData: listTaskItem[] = []
  pageIndex: number = 1
  pageSize: number = 10
  totalData: number = 0
  constructor(private taskService: TaskService, private actorService: ActorService, private message: NzMessageService) {

  }


  ngOnInit(): void {
    setInterval(() => { this.taskService.pagingQueryTasks(this.pageSize, (this.pageIndex - 1) * this.pageSize).refetch() }, 1000)
    this.tasklists()
  }

  tasklists() {
    this.taskService.pagingQueryTasks(this.pageSize, (this.pageIndex - 1) * this.pageSize).valueChanges.subscribe({
      next: (res) => {
        //根据id进行排序
        let tempTaskList = []
        for (let i in res.data.tasks.items) {
          tempTaskList.push(res.data.tasks.items[i])
        }
        this.totalData = Number(res.data.tasks.total)
        this.listData = tempTaskList.sort((pre, next) => Number(pre.id) - Number(next.id))
      },
      error: (e) => {
        console.error("taskList出错了")
      }
    })
  }

  start(id: string) {
    this.taskService.startTaskById(id).subscribe({
      next: _ => {
        this.message.create("success", "任务开始")
      },
      error: e => {
        this.message.create("error", "任务出错")
      }
    })
  }
  cancel(id: string) {
    this.taskService.cancelTaskById(id).subscribe({
      next: _ => {
        this.message.create("success", "任务取消成功")
      },
      error: e => {
        this.message.create("error", "任务删除出错")
      }
    })
  }

  remove(id: string) {
    this.taskService.removeTaskById(id).subscribe({
      next: _ => {
        this.message.create("success", "任务移除成功")
      },
      error: e => {
        this.message.create("error", "任务移除出错")
      }
    })
  }

  pageChange() {
    this.tasklists()
  }

  detail() {
  }



  showModal(): void {
    this.isVisible = true;
  }

  handleOk(): void {
    this.isVisible = false;
  }

  handleCancel(): void {
    this.isVisible = false;
  }
}
