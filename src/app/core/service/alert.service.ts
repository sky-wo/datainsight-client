import { Injectable } from '@angular/core';
import { BehaviorSubject, filter, map, Observable } from 'rxjs';
import { TaskCounterItem } from '../type/graphql-type';
import { PolicyService } from './policy.service';

export interface IAlertInfo {
  database: string
  table: string
  //TODO 此处先填写标签id,后期改正(不知道如何处理)
  // tagName: string
  // tagLevel: number
  counter: TaskCounterItem[]
  tableRow: string
}
export interface AlertInfo {
  database: string
  table: string
  tagInfo: TagInfo[]
  tableRow: string
}
export interface TagInfo {
  tagName: string
  tagLevel: number
  count: number
}



@Injectable({
  providedIn: 'root'
})
export class AlertService {


  private alertItemsSource: BehaviorSubject<IAlertInfo[]> = new BehaviorSubject<IAlertInfo[]>([])
  alertItems$!: Observable<AlertInfo[]>;


  constructor(private policyService: PolicyService) {
    this.alertItems$ = this.alertItemsSource.asObservable().pipe(map(r => {
      const tempItems: AlertInfo[] = []
      r.forEach(v => {
        const items: AlertInfo = {
          database: v.database,
          table: v.table,
          tagInfo: [],
          tableRow: v.tableRow
        }
        v.counter.forEach(t => {
          this.policyService.queryDataTagById(t.name.split("-")[1]).valueChanges.subscribe(k => {
            const tempTag: TagInfo = {
              tagName: k.data.dataTag.name,
              tagLevel: k.data.dataTag.level,
              count: t.value
            }
            items.tagInfo.push(tempTag)
          })
        })
        tempItems.push(items)
      })
      return tempItems
    }),
      filter(y => y.length !== 0)
    )

  }

  toggleAlertItems(value: IAlertInfo[]) {
    this.alertItemsSource.next(value)
  }
}
