import {Component, OnInit} from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import {ConnectorService} from 'src/app/core/service/connector.service';
import {Connector, ConnectorInput, ConnectorPage} from 'src/app/core/type/graphql-type';
import {NzMessageService} from 'ng-zorro-antd/message';
import {NzNotificationService} from "ng-zorro-antd/notification";
import {Apollo, gql, QueryRef} from "apollo-angular";

@Component({
  selector: 'app-connector',
  templateUrl: './connector.component.html',
  styleUrls: ['./connector.component.less']
})
export class ConnectorComponent implements OnInit {

  listOfData: Connector[] = []
  pageSize: number = 10
  totalData: number = 0
  currentPageIndex: number = 1
  isVisible = false;
  isOkLoading = false;
  validateForm!: UntypedFormGroup;

  constructor(
    private fb: UntypedFormBuilder,
    private connectorService: ConnectorService,
    private message: NzMessageService,
    private notification: NzNotificationService,
    private apollo: Apollo
  ) {
  }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      name: [null, [Validators.required]],
      image: [null, [Validators.required]],
      version: [null, [Validators.required]],
    });
    this.loadConnectors(this.pageSize, 0)
  }


  loadConnectors(first: number, skip: number) {
    this.pagingQueryConnectors(first, skip).valueChanges.subscribe({
      next: r => {
        this.listOfData = r.data.connectors.items as Connector[]
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
    this.isVisible = true;
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  submitForm(): void {
    if (this.validateForm.valid) {
      this.isOkLoading = true
      const connector: ConnectorInput = {
        name: this.validateForm.value.name,
        image: this.validateForm.value.image,
        version: this.validateForm.value.version
      }
      this.connectorService.addConnector(connector).subscribe({
        next: _ => {
          this.isOkLoading = false
          this.isVisible = false
          this.pagingQueryConnectors(this.pageSize, (this.currentPageIndex - 1) * this.pageSize).refetch()
        }, error: e => {
          this.isOkLoading = false
          this.isVisible = false
          this.message.create('error', `添加出错`);
          console.error(e)
        }
      })
    } else {
      Object.values(this.validateForm.controls).forEach(control => {
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
        this.notification.create(
          'success',
          '删除成功',
          ''
        );
        this.pagingQueryConnectors(this.pageSize, (this.currentPageIndex - 1) * this.pageSize).refetch()
      }, error: e => {
        this.notification.create(
          'error',
          '删除失败',
          ''
        );
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
