import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {NzFormatEmitEvent, NzTreeComponent} from "ng-zorro-antd/tree";
import {DataTag, DataTagsPage} from "../core/type/graphql-type";
import {PolicyService} from "../core/service/policy.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {Apollo, gql, QueryRef} from "apollo-angular";

@Component({
  selector: 'app-policy',
  templateUrl: './policy.component.html',
  styleUrls: ['./policy.component.less']
})
export class PolicyComponent implements OnInit, AfterViewInit {

  @ViewChild('nzTreeComponent') nzTreeComponent: any
  defaultCheckedKeys = ['10020'];
  defaultSelectedKeys = [];
  defaultExpandedKeys = [];
  nodes: any [] = []
  originalData: DataTag[] = []
  intermediateDataForConvertedToTree: any[] = []

  constructor(private policyService: PolicyService, private apollo: Apollo, private notification: NzNotificationService) {
  }

  ngOnInit(): void {
    this.loadAllPolicys()
  }

  loadAllPolicys() {
    this.pagingQueryDataTags(200, 0).valueChanges.subscribe({
      next: r => {
        this.originalData = r.data.dataTags.items as DataTag[]
        this.intermediateDataForConvertedToTree = this.originalData.map(item => {
          let parentId = item.parentId ? item.parentId : ''
          return {
            key: item.id,
            title: item.name,
            parentId: parentId,
            isLeaf: this.isLeaf(item.id)
          }
        })
        this.nodes = this.convertedToTree()
      }, error: e => {
        console.error(e)
      }
    })
  }

  convertedToTree(pid = '') {
    if (!pid) {
      // 如果没有父id（第一次递归的时候）将所有父级查询出来
      return this.intermediateDataForConvertedToTree.filter(item => !item.parentId).map(item => {
        // 通过父节点ID查询所有子节点
        item.children = this.convertedToTree(item.key)
        return item
      })
    } else {
      return this.intermediateDataForConvertedToTree.filter(item => item.parentId === pid).map(item => {
        // 通过父节点ID查询所有子节点
        item.children = this.convertedToTree(item.key)
        return item
      })
    }
  }

  isLeaf(datatagId: string) {
    let isLeaf = true
    for (let dataTag2 of this.originalData) {
      if (dataTag2.parentId == datatagId)
        isLeaf = false
    }
    return isLeaf
  }

  nzEvent(event: NzFormatEmitEvent): void {
  }

  ngAfterViewInit(): void {
  }

  readNodes(nodes: any[], arr: any[]) {
    for (let item of nodes) {
      arr.push(item.key)
      if (item.children && item.children.length) this.readNodes(item.children, arr)
    }
    return arr
  }


  clickMe() {
    console.log(this.nzTreeComponent.getCheckedNodeList())
    console.log(this.readNodes(this.nzTreeComponent.getCheckedNodeList(), []))
  }

  pagingQueryDataTags(first: number, skip: number): QueryRef<{ dataTags: DataTagsPage }, { first: number, skip: number }> {
    return this.apollo.watchQuery({
      query: gql`
        query ($first: Int!, $skip: Long!) {
          dataTags(first: $first, skip: $skip) {
            total
            items {
              alert
              id
              level
              name
              parentId
              rules(first: 100, skip: 0) {
                items{
                  content
                  dataTagId
                  id
                }
                total
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
