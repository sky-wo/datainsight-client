import { Component, OnInit } from '@angular/core';
import { TaskService } from 'src/app/core/service/task.service';
import { Actor, ActorPage } from 'src/app/core/type/graphql-type';
import { Apollo, gql, QueryRef } from "apollo-angular";
import { CreateTaskCommunicationService } from "../create-task-communication.service";
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-select-actor',
  templateUrl: './select-actor.component.html',
  styleUrls: ['./select-actor.component.less']
})
export class SelectActorComponent implements OnInit {

  actors!: readonly Actor[];



  currentSelectSource: BehaviorSubject<string> = new BehaviorSubject<string>("")

  pageSize: number = 2

  totalData: number = 0

  currentPageIndex: number = 1

  constructor(private createTaskCommunicationService: CreateTaskCommunicationService, private apollo: Apollo) {
  }

  ngOnInit(): void {
    this.loadActorList(this.pageSize, 0)
  }

  loadActorList(first: number, skip: number) {
    this.apollo.watchQuery<{ actors: ActorPage }>({
      query: gql`
        query ($first: Int!, $skip: Long!) {
          actors(first: $first, skip: $skip) {
            total
            items {
              id
              name
              connector{
                name
                version
              }
            }
          }
        }
      `, variables: {
        first, skip
      }
    }).valueChanges.subscribe({
      next: r => {
        this.totalData = r.data.actors.total
        this.actors = r.data.actors.items
      }, error: e => {
        console.error(e)
      }
    })
  }

  pageChange() {
    this.loadActorList(this.pageSize, (this.currentPageIndex - 1) * this.pageSize)
  }
  selectActive(id: string): boolean {
    if (id !== this.currentSelectSource.value) {
      return false
    }
    return true
  }

  chooseActor(id: string) {
    this.currentSelectSource.next(id)
  }

  nextStep() {
    this.createTaskCommunicationService.announceActorId(this.currentSelectSource.value)
    this.createTaskCommunicationService.nextStep()
  }
}
