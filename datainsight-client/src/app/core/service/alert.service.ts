import {Injectable} from '@angular/core';
import {BehaviorSubject, filter, map, Observable} from 'rxjs';
import {DataTag, TaskCounterItem} from '../type/graphql-type';
import {PolicyService} from './policy.service';
import {Apollo, gql, QueryRef} from "apollo-angular";

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


  alertItems$!: Observable<AlertInfo[]>;
  private alertItemsSource: BehaviorSubject<IAlertInfo[]> = new BehaviorSubject<IAlertInfo[]>([])

  constructor(private policyService: PolicyService, private apollo: Apollo) {
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
            this.queryDataTagById(t.name.split("-")[1]).valueChanges.subscribe(k => {
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

  queryDataTagById(id: string): QueryRef<{ dataTag: DataTag }, { id: string }> {
    return this.apollo.watchQuery({
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
      `,
      variables: {
        id
      }
    })
  }
}
