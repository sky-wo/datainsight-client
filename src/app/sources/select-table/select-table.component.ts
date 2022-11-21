import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { SourcesService } from 'src/app/core/service/sources.service';
import { DataInsightStream } from 'src/app/core/type/graphql-type';


interface ItemData {
  id: number;
  name: string;
  age: number;
  address: string;
}

interface IDataInsightStream {
  id: number,
  stream: DataInsightStream
}


@Component({
  selector: 'app-select-table',
  templateUrl: './select-table.component.html',
  styleUrls: ['./select-table.component.less']
})
export class SelectTableComponent implements OnInit {

  checked = false;
  indeterminate = false;
  listOfCurrentPageData: readonly ItemData[] = [];
  listOfData: readonly ItemData[] = [];
  setOfCheckedId = new Set<number>();


  dataSource = new BehaviorSubject<IDataInsightStream[]>([])
  constructor(private sourcesService: SourcesService, private activateRoute: ActivatedRoute,) { }

  ngOnInit(): void {
    const actorId = this.activateRoute.snapshot.paramMap.get("ActorId")
    const tableData: IDataInsightStream[] = []
    if (actorId) {
      this.sourcesService.actor(actorId).subscribe(r => {
        r.actor.catalog.streams.forEach((r, index) => {
          tableData.push({
            id: index,
            stream: r
          })
        })
        this.dataSource.next(tableData)
      })
    }
    this.dataSource.subscribe(r=>console.log(r))
    this.listOfData = new Array(200).fill(0).map((_, index) => ({
      id: index,
      name: `Edward King ${index}`,
      age: 32,
      address: `London, Park Lane no. ${index}`
    }));
  }

  updateCheckedSet(id: number, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(id);
    } else {
      this.setOfCheckedId.delete(id);
    }
  }

  onItemChecked(id: number, checked: boolean): void {
    this.updateCheckedSet(id, checked);
    this.refreshCheckedStatus();
  }

  onAllChecked(value: boolean): void {
    this.listOfCurrentPageData.forEach(item => this.updateCheckedSet(item.id, value));
    this.refreshCheckedStatus();
  }

  onCurrentPageDataChange($event: readonly ItemData[]): void {
    this.listOfCurrentPageData = $event;
    this.refreshCheckedStatus();
  }

  refreshCheckedStatus(): void {
    this.checked = this.listOfCurrentPageData.every(item => this.setOfCheckedId.has(item.id));
    this.indeterminate = this.listOfCurrentPageData.some(item => this.setOfCheckedId.has(item.id)) && !this.checked;
  }

}
