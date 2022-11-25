import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActorService } from 'src/app/core/service/actor.service';
import { ConnectorService } from 'src/app/core/service/connector.service';
import { Connector } from 'src/app/core/type/graphql-type';

@Component({
  selector: 'app-select-connector',
  templateUrl: './select-connector.component.html',
  styleUrls: ['./select-connector.component.less']
})
export class SelectConnectorComponent implements OnInit {


  dataList!: readonly Connector[];

  selectChoose: string = ""

  constructor(private connectorService: ConnectorService, private route: Router, private actor: ActorService) { }
  ngOnInit(): void {
    this.loadConnectorList()
  }

  nextChoose() {
    // this.route.navigate(["/frame/actor/spec/", this.selectChoose])
    this.actor.toggleSelectConnector(this.selectChoose)
    this.actor.toggleCurrentStep(this.actor.getCurrentStep + 1)
  }

  loadConnectorList() {
    this.connectorService.pagingQueryConnectors(100, 0).valueChanges.subscribe({
      next: r => {
        this.dataList = r.data.connectors.items
      },
      error: e => {
        console.error(e)
      }
    })
  }

}
