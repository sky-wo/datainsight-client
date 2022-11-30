import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';
import { TaskRun, Task } from 'src/app/core/type/graphql-type';

@Component({
  selector: 'app-task-run-list',
  templateUrl: './task-run-list.component.html',
  styleUrls: ['./task-run-list.component.less']
})
export class TaskRunListComponent implements OnInit {

  dataSource: TaskRun[] = []

  taskRunTotal: number = 0

  currentPage: number = 1

  pageSize: number = 10

  taskId!: string;

  constructor(private activateRoute: ActivatedRoute, private apollo: Apollo) { }

  ngOnInit(): void {
    this.taskId = this.activateRoute.snapshot.paramMap.get("taskId")!
    this.taskRunList(this.pageSize, this.pageSize * (this.currentPage - 1))
  }

  taskRunList(taskRunFirst: number, skip: number) {
    if (this.taskId) {
      this.apollo.watchQuery<{ task: Task }>({
        query: gql`
        query($id:ID!,$taskRunFirst:Int!,$skip:Long!,$logsFirst:Int!){
          task(id:$id){
            taskRuns (first:$taskRunFirst,skip:$skip){
              total,
              items{
                state,
                logs(first:$logsFirst){
                  items{
                    id,
                    message
                  }
                }
              }
            }
          }
        }
      `,
        variables: {
          //此处忽略logsFirst的值，后台固定取了前100
          id: this.taskId, taskRunFirst: taskRunFirst, skip: skip, logsFirst: 100
        }
      }).valueChanges.subscribe({
        next: r => {
          if (r.data.task.taskRuns) {
            this.dataSource = r.data.task.taskRuns?.items
            this.taskRunTotal = r.data.task.taskRuns.total
          }

        },
        error: e => {
          console.error("taskRun发生未知错误", e)
        }
      })
    }
  }

  pageChange() {
    this.taskRunList(this.pageSize, this.pageSize * (this.currentPage - 1))
  }
}
