import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActorService } from 'src/app/core/service/actor.service';
import { ConnectorService } from 'src/app/core/service/connector.service';
import { TaskService } from 'src/app/core/service/task.service';
import { Actor, Connector } from 'src/app/core/type/graphql-type';

@Component({
  selector: 'app-select-actor',
  templateUrl: './select-actor.component.html',
  styleUrls: ['./select-actor.component.less']
})
export class SelectActorComponent implements OnInit {

  dataList!: readonly Actor[];

  selectChoose: string = ""

  constructor(private taskService: TaskService, private actor: ActorService, private actorService: ActorService) { }
  ngOnInit(): void {
    this.loadActorList()
  }

  nextChoose() {
    // this.route.navigate(["/frame/actor/spec/", this.selectChoose])
    this.taskService.toggleSelectActor(this.selectChoose)
    this.taskService.toggleCurrentStep(this.actor.getCurrentStep + 1)
  }

  loadActorList() {
    this.actorService.queryActorsName(100, 0).valueChanges.subscribe({
      next: r => {
        this.dataList = r.data.actors.items
      },
      error: e => {
        console.error(e)
      }
    })
  }
}
