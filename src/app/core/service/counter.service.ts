import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';


// export interface ITableCount {
//   dataSourceName: string,
//   tabelCount: number
// }

@Injectable({
  providedIn: 'root'
})
export class CounterService {


  private tableCountSource = new BehaviorSubject<Map<string, number>>(new Map())
  tableCount$ = this.tableCountSource.asObservable()


  constructor() { }


  get getTableCount() {
    return this.tableCountSource.value
  }

  toggleTableCount(value: Map<string, number>) {
    this.tableCountSource.next(value)
  }
}
