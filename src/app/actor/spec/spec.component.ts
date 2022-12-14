import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { JSONSchema7 } from 'json-schema';
import { FormNode } from '@skywo/jsonforms'
import { NzMessageService } from 'ng-zorro-antd/message';
import { ConnectorService } from "../../core/service/connector.service";
import { ActorService } from "../../core/service/actor.service";
import {Apollo, gql, QueryRef} from "apollo-angular";
import {Connector} from "../../core/type/graphql-type";

@Component({
  selector: 'app-spec',
  templateUrl: './spec.component.html',
  styleUrls: ['./spec.component.less']
})
export class SpecComponent implements OnInit {

  schema!: JSONSchema7;

  form!: FormNode | undefined

  connectorId!: string | null;

  constructor(
    private activateRoute: ActivatedRoute,
    private router: Router,
    private actorService: ActorService,
    private connectorService: ConnectorService,
    private message: NzMessageService,
    private apollo: Apollo
  ) {
  }

  ngOnInit(): void {
    this.connectorId = this.actorService.getselectConnector
    if (this.connectorId) {
      this.queryConnectorById(this.connectorId).valueChanges.subscribe(
        {
          next: r => {
            this.schema = r.data.connector.specification.connectionSpecification as JSONSchema7
          },
          error: e => {
            console.error(e)
          }
        }
      )
    }
  }

  onFormChange(form: FormNode | undefined) {
    this.form = form
  }

  submitConfig() {
    if (this.connectorId !== null) {
      this.actorService.addActor({
        name: this.form?.getValue().database,
        connectorId: this.connectorId,
        connectorConfig: this.form?.getValue()
      }).subscribe(
        {
          next: r => {
            // this.router.navigate(['/frame/actor/selectTable', r.data?.addActor])
            //跳转回去刷新组件
            this.router.navigate(['/frame/actor/'], { queryParams: { refresh: true } })
          },
          error: e => {
            this.message.create('error', `添加出错`);
            console.error(e)
          }
        }
      )
    }
  }

  queryConnectorById(id: string): QueryRef<{ connector: Connector }, { id: string }> {
    return this.apollo.watchQuery({
      query: gql`
        query($id: ID!) {
          connector(id: $id) {
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
      `,
      variables: {
        id
      }
    })
  }

}
