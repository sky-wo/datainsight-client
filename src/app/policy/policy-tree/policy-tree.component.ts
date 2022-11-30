import {Component, OnInit, ViewChild} from '@angular/core';
import {DataTag, DataTagsPage} from "../../core/type/graphql-type";
import {PolicyService} from "../../core/service/policy.service";
import {Apollo, gql} from "apollo-angular";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NzFormatEmitEvent} from "ng-zorro-antd/tree";

@Component({
  selector: 'app-policy-tree', templateUrl: './policy-tree.component.html', styleUrls: ['./policy-tree.component.less']
})
export class PolicyTreeComponent implements OnInit {

  // Todo: 标签父子关系、是否联动控制？ [nzSelectedKeys]="defaultSelectedKeys"

  @ViewChild('nzTreeComponent') nzTreeComponent: any
  defaultCheckedKeys = [];
  defaultSelectedKeys = [];
  defaultExpandedKeys = [];
  nodesForView: any [] = []

  originalDataTagList: DataTag[] = []
  currentlySelectedNode: DataTag | undefined = undefined

  constructor(private policyService: PolicyService, private apollo: Apollo, private notification: NzNotificationService) {
  }

  ngOnInit(): void {
    this.loadAllPolicy()
  }

  clickMe() {
    console.log(this.nzTreeComponent.getCheckedNodeList())
    console.log(this.flattenNodes(this.nzTreeComponent.getCheckedNodeList(), []))
  }

  nzEvent(event: NzFormatEmitEvent): void {
    if (event.eventName == "click") {
      this.getTagDetails(event.node?.key!)
    } else {
      console.log(event)
    }
  }

  isLeaf(dataTagId: string) {
    let isLeaf = true
    for (let d of this.originalDataTagList) {
      if (d.parentId == dataTagId) isLeaf = false
    }
    return isLeaf
  }

  /**
   * 递归读取树结构的 nodes，展开为一维数组
   * */
  flattenNodes(nodes: any[], arr: any[]) {
    for (let item of nodes) {
      arr.push(item.key)
      if (item.children && item.children.length) this.flattenNodes(item.children, arr)
    }
    return arr
  }

  /**
   * 处理后台返回的 一维数组 ，转换为 带有父子关系的 树形结构
   *
   * 外部调用时，pid = "" ，即取得所有根节点
   * */
  convertedToTree(pid: string, list: any[]) {
    if (!pid) {
      return list.filter(item => !item.parentId).map(item => {
        item.children = this.convertedToTree(item.key, list)
        return item
      })
    } else {
      return list.filter(item => item.parentId === pid).map(item => {
        item.children = this.convertedToTree(item.key, list)
        return item
      })
    }
  }

  loadAllPolicy() {
    this.apollo.watchQuery<{ dataTags: DataTagsPage }>({
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
      `, variables: {
        first: 200, skip: 0
      }
    }).valueChanges.subscribe({
      next: r => {
        this.originalDataTagList = r.data.dataTags.items as DataTag[]
        let intermediateData = this.originalDataTagList.map(item => {
          let parentId = item.parentId ? item.parentId : ''
          return {
            key: item.id, title: item.name, parentId: parentId, isLeaf: this.isLeaf(item.id)
          }
        })
        this.nodesForView = this.convertedToTree("", intermediateData)
      }, error: e => {
        console.error(e)
      }
    })
  }

  getTagDetails(id: string) {
    this.apollo.watchQuery<{ dataTag: DataTag }, { id: string }>({
      query: gql`
        query($id: ID!) {
          dataTag(id: $id) {
            id
            name
            level
            alert
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
      `, variables: {
        id
      }
    }).valueChanges.subscribe(data => {
      this.currentlySelectedNode = data.data.dataTag
    })
  }

}
