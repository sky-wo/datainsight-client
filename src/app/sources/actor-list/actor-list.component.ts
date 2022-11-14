import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SourcesService } from 'src/app/core/service/sources.service';
import { Actor } from 'src/app/core/type/graphql-type';


@Component({
  selector: 'app-actor-list',
  templateUrl: './actor-list.component.html',
  styleUrls: ['./actor-list.component.less']
})
export class ActorListComponent implements OnInit {

  listOfData: readonly Actor[] = []
  pageIndex: number = 1
  pageSize: number = 10
  totalData: number = 0
  constructor(private activeRoute: ActivatedRoute, private sourcesService: SourcesService) {
    this.activeRoute.queryParams.subscribe(r => {
      if (r) {
        this.sourcesService.actors(this.pageSize, (this.pageIndex - 1) * this.pageSize).refetch()
      }
    })
  }

  ngOnInit(): void {

    this.actors(this.pageSize, (this.pageIndex - 1) * this.pageSize)
  }
  actors(first: number, skip: number) {
    this.sourcesService.actors(first, skip).valueChanges.subscribe(
      {
        next: r => {
          this.listOfData = r.data.actors.items
          this.totalData = r.data.actors.total
        },
        error: e => {
          console.error("connectors发生位置错误" + e)
        }
      }
    )
  }
  pageChange() {
    this.actors(this.pageSize, (this.pageIndex - 1) * this.pageSize)
  }

}
