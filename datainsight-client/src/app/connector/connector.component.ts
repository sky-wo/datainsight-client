import {Component, OnInit} from '@angular/core';
import {UntypedFormBuilder, Validators} from '@angular/forms';
import {ConnectorService} from 'src/app/core/service/connector.service';
import {Connector, ConnectorInput, ConnectorPage} from 'src/app/core/type/graphql-type';
import {NzMessageService} from 'ng-zorro-antd/message';
import {NzNotificationService} from "ng-zorro-antd/notification";
import {Apollo, gql} from "apollo-angular";

@Component({
  selector: 'app-connector', templateUrl: './connector.component.html', styleUrls: ['./connector.component.less']
})
export class ConnectorComponent implements OnInit {

  connectorList: Connector[] = []

  addConnector_Modal_IsVisible = false
  addConnector_Modal_OkLoading = false
  addConnector_Form_Validate = this.fb.group({
    name: [null, [Validators.required]], image: [null, [Validators.required]], version: [null, [Validators.required]],
  });

  pageSize: number = 7
  totalData: number = 0
  currentPageIndex: number = 1

  constructor(private fb: UntypedFormBuilder, private connectorService: ConnectorService, private message: NzMessageService, private notification: NzNotificationService, private apollo: Apollo) {
  }

  ngOnInit(): void {
    this.loadConnectors()
  }

  addConnector(): void {
    if (this.addConnector_Form_Validate.valid) {
      this.addConnector_Modal_OkLoading = true
      const connector: ConnectorInput = {
        name: this.addConnector_Form_Validate.value.name,
        image: this.addConnector_Form_Validate.value.image,
        version: this.addConnector_Form_Validate.value.version
      }
      this.connectorService.addConnector(connector).subscribe({
        next: _ => {
          this.addConnector_Modal_IsVisible = false
          this.loadConnectors(this.pageSize, 0)
        }, error: e => {
          this.message.create('error', `添加出错`)
          this.addConnector_Modal_OkLoading = false
          console.error(e)
        }
      })
    } else {
      Object.values(this.addConnector_Form_Validate.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({onlySelf: true});
        }
      });
    }
  }

  removeConnectorById(id: string) {
    this.connectorService.removeConnectorById(id).subscribe({
      next: _ => {
        this.notification.create('success', '删除成功', '');
        this.loadConnectors(this.pageSize, (this.currentPageIndex - 1) * this.pageSize)
      }, error: e => {
        this.notification.create('error', '删除失败', '');
        console.error(e)
      }
    })
  }

  loadConnectors(first: number = this.pageSize, skip: number = 0) {
    this.apollo.watchQuery<{ connectors: ConnectorPage }>({
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
      `, variables: {
        first, skip
      }
    }).valueChanges.subscribe({
      next: r => {
        this.connectorList = r.data.connectors.items
        this.totalData = r.data.connectors.total
      }, error: e => {
        console.error(e)
      }
    })
  }

  pageChange() {
    this.loadConnectors(this.pageSize, (this.currentPageIndex - 1) * this.pageSize)
  }

  showModal(): void {
    this.addConnector_Modal_IsVisible = true;
  }

  handleCancel(): void {
    this.addConnector_Modal_IsVisible = false;
  }

}
