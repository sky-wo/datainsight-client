import {Component, OnInit} from '@angular/core';
import {TaskService} from 'src/app/core/service/task.service';
import {Actor, ActorPage} from 'src/app/core/type/graphql-type';
import {Apollo, gql, QueryRef} from "apollo-angular";
import {CreateTaskCommunicationService} from "../create-task-communication.service";

@Component({
  selector: 'app-select-actor',
  templateUrl: './select-actor.component.html',
  styleUrls: ['./select-actor.component.less']
})
export class SelectActorComponent implements OnInit {

  actors!: readonly Actor[];

  currentActorId: string | undefined

  constructor(private createTaskCommunicationService: CreateTaskCommunicationService, private apollo: Apollo) {
  }

  ngOnInit(): void {
    this.loadActorList()
  }

  loadActorList() {
    this.queryActors(100, 0).valueChanges.subscribe({
      next: r => {
        this.actors = r.data.actors.items
      }, error: e => {
        console.error(e)
      }
    })
  }

  queryActors(first: number, skip: number): QueryRef<{ actors: ActorPage }, { first: number, skip: number }> {
    return this.apollo.watchQuery({
      query: gql`
        query ($first: Int!, $skip: Long!) {
          actors(first: $first, skip: $skip) {
            total
            items {
              id
              name
            }
          }
        }
      `, variables: {
        first, skip
      }
    })
  }

  nextStep() {
    this.createTaskCommunicationService.announceActorId(this.currentActorId!)
    this.createTaskCommunicationService.nextStep()
  }

}
