import {Component, OnInit} from '@angular/core';
import {NzMessageService} from 'ng-zorro-antd/message';
import {ActorService} from '../core/service/actor.service';
import {TaskService} from '../core/service/task.service';
import {TasksPage, TaskState} from '../core/type/graphql-type';
import {Apollo, gql} from "apollo-angular";

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

  listData: listTaskItem[] = []
  pageIndex: number = 1
  pageSize: number = 10
  totalData: number = 0

  constructor(private taskService: TaskService, private apollo: Apollo, private actorService: ActorService, private message: NzMessageService) {
  }

  ngOnInit(): void {
    this.loadTaskList()
  }

  startTask(id: string) {
    this.taskService.startTaskById(id).subscribe({
      next: _ => {
        this.message.create("success", "任务开始")
      },
      error: e => {
        this.message.create("error", "任务出错")
        console.error(e)
      }
    })
  }

  cancelTask(id: string) {
    this.taskService.cancelTaskById(id).subscribe({
      next: _ => {
        this.message.create("success", "任务取消成功")
      },
      error: e => {
        this.message.create("error", "取消任务失败")
        console.error(e)
      }
    })
  }

  removeTask(id: string) {
    this.taskService.removeTaskById(id).subscribe({
      next: _ => {
        this.message.create("success", "任务移除成功")
      },
      error: e => {
        this.message.create("error", "任务移除出错")
      }
    })
  }

  loadTaskList() {
    this.apollo.watchQuery<{ tasks: TasksPage }>({
      query: gql`
        query ($first: Int!, $skip: Long!) {
          tasks(first: $first, skip: $skip) {
            total
            items{
              id,
              state,
              actor{
                name
              }
            }
          }
        }
      `, variables: {
        first: this.pageSize
        , skip: (this.pageIndex - 1) * this.pageSize
      },
      pollInterval: 500
    }).valueChanges.subscribe({
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
        console.error(e)
      }
    })
  }

  detail() {
  }

  pageChange() {
    this.loadTaskList()
  }

}
