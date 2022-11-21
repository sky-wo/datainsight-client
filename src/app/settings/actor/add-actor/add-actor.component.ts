import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Connector} from 'src/app/core/type/graphql-type';
import {ConnectorService} from "../../../core/service/connector.service";

@Component({
  selector: 'app-add-connector',
  templateUrl: './add-actor.component.html',
  styleUrls: ['./add-actor.component.less']
})
export class AddActorComponent implements OnInit {

  dataList!: readonly Connector[];
  selectChoose: String = ""

  constructor(private connectorService: ConnectorService, private route: Router) {
  }

  ngOnInit(): void {
    this.loadConnectorList()
  }

  nextChoose() {
    this.route.navigate(["/frame/sources/spec/", this.selectChoose])
  }

  loadConnectorList() {
    this.connectorService.pagingQueryConnectors(100, 0).valueChanges.subscribe({
      next: r => {
        this.dataList = r.data.connectors.items
      },
      error: e => {
        console.error("add-Sources出错了" + e)
      }
    })
  }

}
