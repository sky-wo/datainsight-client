import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { JSONSchema7 } from 'json-schema';
import { FormNode } from '@skywo/jsonforms'
import { NzMessageService } from 'ng-zorro-antd/message';
import { SourcesService } from 'src/app/core/service/sources.service';

@Component({
  selector: 'app-spec',
  templateUrl: './spec.component.html',
  styleUrls: ['./spec.component.less']
})
export class SpecComponent implements OnInit {

  schema!: JSONSchema7;

  form!: FormNode | undefined

  connectorId!: string | null;

  name!: String;

  constructor(
    private activateRoute: ActivatedRoute,
    private router: Router,
    private sourcesService: SourcesService,
    private message: NzMessageService
  ) {
  }

  ngOnInit(): void {
    this.connectorId = this.activateRoute.snapshot.paramMap.get("connectorId")
    if (this.connectorId) {
      this.sourcesService.connector(this.connectorId).subscribe(
        {
          next: r => {
            this.name = r.connector.name
            this.schema = r.connector.specification.connectionSpecification as JSONSchema7
          },
          error: e => {
            console.error("specInit发生未知错误" + e)
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
      this.sourcesService.addActor({
        name: this.name as string,
        connectorId: this.connectorId,
        connectorConfig: this.form?.getValue()
      }).subscribe(
        {
          next: r => {
            //跳转回去刷新组件
            //this.router.navigate(['/frame/sources/'], {queryParams: {refresh: true}})
            this.router.navigate(['/frame/sources/selectTable', r.data?.addActor])

          },
          error: e => {
            this.message.create('error', `添加出错`);
            console.error("submitConfig发生未知错误:" + e)
          }
        }
      )
    }

  }
}
