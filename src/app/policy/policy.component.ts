import {Component, OnInit} from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {DataTag} from "../core/type/graphql-type";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {PolicyService} from "../core/service/policy.service";

@Component({
  selector: 'app-policy',
  templateUrl: './policy.component.html',
  styleUrls: ['./policy.component.less']
})
export class PolicyComponent implements OnInit {

  openSort = true

  originalData: DataTag[] = []

  nonRootNode: DataTag[] = []

  rootNode: DataTag[] = []

  c2: DataTag[] = []
  c4: DataTag[] = []
  c3: DataTag[] = []


  constructor(
    private policyService: PolicyService,
    private notification: NzNotificationService
  ) {
  }


  sort() {
    this.openSort = !this.openSort
  }


  ngOnInit(): void {
    this.loadAllPolicys()
  }

  loadAllPolicys() {
    this.policyService.pagingQueryDataTags(200, 0).valueChanges.subscribe({
      next: r => {
        this.originalData = r.data.dataTags.items as DataTag[]
        for (let i = 0; i < this.originalData.length; i++) {
          let n = this.originalData[i]
          if (n.parentId) {
            this.nonRootNode.push(n)
          } else {
            this.rootNode.push(n)
          }
        }
      }, error: e => {
        console.error(e)
      }
    })
  }

  listChilds(id: string) {
    let childs: DataTag[] = []
    for (let i = 0; i < this.nonRootNode.length; i++) {
      if (this.nonRootNode[i].parentId === id) {
        childs.push(this.nonRootNode[i])
      }
    }
    this.c2 = childs
  }


  drop(event: CdkDragDrop<DataTag[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex)
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }
}
