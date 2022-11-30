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
  isAllowedDrag = false
  defaultCheckedKeys = []
  defaultExpandedKeys = []
  nodesForView: any [] = []

  originalDataTagList: DataTag[] = []
  currentlySelectedNode: DataTag | undefined = undefined

  labelMoveScratchpad: any[] = []

  constructor(private policyService: PolicyService, private apollo: Apollo, private notification: NzNotificationService) {
  }

  ngOnInit(): void {
    this.loadAllPolicy()
  }

  dragSortingNode(confirm: boolean = false) {
    if (confirm) {
      this.isAllowedDrag = false
      for (let event of this.labelMoveScratchpad) {
        this.policyService.moveDataTag(event.id, event.parentId).subscribe({
          next: _ => {
            this.notification.success('修改成功', '')
            this.loadAllPolicy()
          }, error: e => {
            this.notification.error('异常', '')
            console.error(e)
          }
        })
      }
      this.labelMoveScratchpad = []
    } else {
      this.isAllowedDrag = true
    }
  }

  nzEvent(event: NzFormatEmitEvent): void {
    switch (event.eventName) {
      case "click" : {
        this.getTagDetails(event.node?.key!)
        break
      }
      case "drop" : {
        this.accumulateAllSorts(event)
        break
      }
      default: {
        break
      }
    }
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

  /**
   * 递归读取树结构的 nodes，展开为一维数组，可用于解析已勾选的节点
   *
   * this.flattenNodes(this.nzTreeComponent.getCheckedNodeList(), [])
   * */
  flattenNodes(nodes: any[], arr: any[]) {
    for (let item of nodes) {
      arr.push(item.key)
      if (item.children && item.children.length) this.flattenNodes(item.children, arr)
    }
    return arr
  }

  isLeaf(dataTagId: string) {
    let isLeaf = true
    for (let d of this.originalDataTagList) {
      if (d.parentId == dataTagId) isLeaf = false
    }
    return isLeaf
  }

  getDataTagById(id: String) {
    let dataTag: DataTag
    for (let d of this.originalDataTagList) {
      if (d.id == id) {
        dataTag = d
        break
      }
    }
    return dataTag!
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
            // Todo 没叶子节点 以用来允许放置在最后面
            // key: item.id, title: item.name, parentId: parentId, isLeaf: this.isLeaf(item.id)
            key: item.id, title: item.name, parentId: parentId, isLeaf: false
          }
        })
        this.nodesForView = this.convertedToTree("", intermediateData)
      }, error: e => {
        console.error(e)
      }
    })
  }

  /**
   * 积攒所有排序更改，保存到 labelMoveScratchpad
   * */
  accumulateAllSorts(event: NzFormatEmitEvent) {
    let dragNode = event.dragNode
    let originalNode = this.getDataTagById(dragNode?.key!)
    let dragNodeParentId = (!!dragNode?.parentNode?.key) ? dragNode?.parentNode?.key : undefined
    let originalNodeParentId = (!!originalNode.parentId) ? originalNode.parentId : undefined
    if (dragNodeParentId != originalNodeParentId) {
      this.labelMoveScratchpad.push({id: originalNode.id, parentId: dragNodeParentId})
    }
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
