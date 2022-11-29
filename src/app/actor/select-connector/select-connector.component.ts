import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActorService } from 'src/app/core/service/actor.service';
import { ConnectorService } from 'src/app/core/service/connector.service';
import {Connector, ConnectorPage} from 'src/app/core/type/graphql-type';
import {Apollo, gql, QueryRef} from "apollo-angular";

@Component({
  selector: 'app-select-connector',
  templateUrl: './select-connector.component.html',
  styleUrls: ['./select-connector.component.less']
})
export class SelectConnectorComponent implements OnInit {


  dataList!: readonly Connector[];

  selectChoose: string = ""

  constructor(private connectorService: ConnectorService, private route: Router, private actor: ActorService, private apollo: Apollo) { }
  ngOnInit(): void {
    this.loadConnectorList()
  }

  nextChoose() {
    // this.route.navigate(["/frame/actor/spec/", this.selectChoose])
    this.actor.toggleSelectConnector(this.selectChoose)
    this.actor.toggleCurrentStep(this.actor.getCurrentStep + 1)
  }

  loadConnectorList() {
    this.pagingQueryConnectors(100, 0).valueChanges.subscribe({
      next: r => {
        this.dataList = r.data.connectors.items
      },
      error: e => {
        console.error(e)
      }
    })
  }

  pagingQueryConnectors(first: number, skip: number): QueryRef<{ connectors: ConnectorPage }, { first: number, skip: number }> {
    return this.apollo.watchQuery({
      query: gql`
        query ($first: Int!, $skip: Long!) {
          connectors(first: $first, skip: $skip) {
            total
            items {
              id
              name
              image
              version
              specification {
                documentationUrl
                changelogUrl
                connectionSpecification
              }
            }
          }
        }
      `,
      variables: {
        first,
        skip
      }
    })
  }

}
