import {Component, OnInit, ViewChild} from '@angular/core';
import {TaskService} from "../../../core/service/task.service";
import {DataTag, DataTagsPage} from "../../../core/type/graphql-type";
import {PolicyService} from "../../../core/service/policy.service";
import {NzFormatEmitEvent} from "ng-zorro-antd/tree";
import {NzMessageService} from "ng-zorro-antd/message";
import {Router} from "@angular/router";
import {Apollo, gql, QueryRef} from "apollo-angular";
import {CreateTaskCommunicationService} from "../create-task-communication.service";

@Component({
  selector: 'app-select-policy',
  templateUrl: './select-policy.component.html',
  styleUrls: ['./select-policy.component.less']
})
export class SelectPolicyComponent implements OnInit {

  @ViewChild('nzTreeComponent') nzTreeComponent: any
  defaultCheckedKeys = [];
  defaultSelectedKeys = [];
  defaultExpandedKeys = [];
  nodes: any [] = []
  originalData: DataTag[] = []
  intermediateDataForConvertedToTree: any[] = []

  constructor(private policyService: PolicyService, private apollo: Apollo, private router: Router, private createTaskCommunicationService: CreateTaskCommunicationService, private message: NzMessageService) {
  }

  ngOnInit(): void {
    this.loadAllPolicys()
  }

  nzEvent(event: NzFormatEmitEvent): void {
  }

  ngAfterViewInit(): void {
  }

  loadAllPolicys() {
    this.pagingQueryDataTags(200, 0).valueChanges.subscribe({
      next: r => {
        this.originalData = r.data.dataTags.items as DataTag[]
        this.intermediateDataForConvertedToTree = this.originalData.map(item => {
          let parentId = item.parentId ? item.parentId : ''
          return {
            key: item.id, title: item.name, parentId: parentId, isLeaf: this.isLeaf(item.id)
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
      if (dataTag2.parentId == datatagId) isLeaf = false
    }
    return isLeaf
  }

  flatTree(nodes: any[], arr: any[]) {
    for (let item of nodes) {
      arr.push(item.key)
      if (item.children && item.children.length) this.flatTree(item.children, arr)
    }
    return arr
  }

  prevStep() {
    this.createTaskCommunicationService.prevStep()
  }

  nextStep() {
    let inspectorConfig = {enabledDataTagIds: this.flatTree(this.nzTreeComponent.getCheckedNodeList(), [])}
    this.createTaskCommunicationService.announceInspectorConfig(inspectorConfig)

    this.createTaskCommunicationService.createTaskByStep().subscribe({
      next: _ => {
        this.message.create("success", `任务创建成功`);
        this.router.navigate(['/frame/task/'])
      }, error: e => {
        console.error(e)
      }
    })
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
