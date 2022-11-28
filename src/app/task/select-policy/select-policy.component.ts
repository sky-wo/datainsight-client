import {Component, OnInit, ViewChild} from '@angular/core';
import {TaskService} from "../../core/service/task.service";
import {DataTag} from "../../core/type/graphql-type";
import {PolicyService} from "../../core/service/policy.service";
import {NzFormatEmitEvent} from "ng-zorro-antd/tree";

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

  constructor(private policyService: PolicyService, private taskService: TaskService) {
  }

  ngOnInit(): void {
    this.loadAllPolicys()
  }

  nzEvent(event: NzFormatEmitEvent): void {
  }

  ngAfterViewInit(): void {
  }

  loadAllPolicys() {
    this.policyService.pagingQueryDataTags(200, 0).valueChanges.subscribe({
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
    this.taskService.prevStep()
  }

  nextStep() {
    let flattenedNodes = this.flatTree(this.nzTreeComponent.getCheckedNodeList(), [])
    let config = {
      enabledDataTagIds: flattenedNodes
    }
    this.taskService.toggleInspectorConfig(config)
    this.taskService.nextStep()
  }

}
