import {Component, OnInit} from '@angular/core';
import {DagreNodesOnlyLayout, Edge, Layout, Node} from "@swimlane/ngx-graph";

import * as shape from 'd3-shape';
import {DataTag} from "../../core/type/graphql-type";
import {PolicyService} from "../../core/service/policy.service";
import {NzNotificationService} from "ng-zorro-antd/notification";

@Component({
  selector: 'app-tree', templateUrl: './tree.component.html', styleUrls: ['./tree.component.less']
})
export class TreeComponent implements OnInit {

  originalData: DataTag[] = []
  originalDataCopy: DataTag[] = []
  ww: DataTag | null = null;

  public layout: Layout = new DagreNodesOnlyLayout();
  public curve: any = shape.curveBasis
  public links: Edge[] = []
  public nodes: Node[] = []

  isLoaded = false

  currentlySelectedTab: DataTag | null = null


  constructor(private policyService: PolicyService, private notification: NzNotificationService) {
  }

  ngOnInit(): void {
    this.loadAllPolicys()
  }


  loadAllPolicys() {
    this.policyService.pagingQueryDataTags(200, 0).valueChanges.subscribe({
      next: r => {
        this.originalData = r.data.dataTags.items as DataTag[]
        for (let i = 0; i < this.originalData.length; i++) {

          // 深拷贝 解决属性不可扩展的错误
          this.originalDataCopy.push(JSON.parse(JSON.stringify(this.originalData[i])))

          if (!this.originalData[i].parentId) {
            let myObj = {
              id: this.originalData[i].id, data: this.originalDataCopy[i], label: this.originalDataCopy[i].name
            }
            this.nodes.push(myObj)
          }

          // if (this.originalData[i].parentId) {
          //   let myObj = {source: this.originalData[i].parentId!, target: this.originalData[i].id}
          //   this.links.push(myObj)
          // }

        }
        this.isLoaded = true
      }, error: e => {
        console.error(e)
      }
    })
  }

  clickNode(node2: Node) {
    this.currentlySelectedTab = node2.data
    for (let node of this.getChilds(this.currentlySelectedTab!)) {
      console.log(node)
      let myObj = {
        id: node.id, data: JSON.parse(JSON.stringify(node)), label: node.name
      }
      this.nodes.push(myObj)
      let myObj2 = {source: node2.id, target: node.id}
      this.links.push(myObj2)
    }

  }

  getChilds(dataTag: DataTag) {
    let c = []
    for (let d of this.originalData) {
      if (d.parentId == dataTag.id) {
        c.push(d)
      }
    }
    return c
  }

}

