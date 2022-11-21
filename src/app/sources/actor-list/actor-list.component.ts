import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Actor} from 'src/app/core/type/graphql-type';
import {ActorService} from "../../core/service/actor.service";


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

  constructor(private activeRoute: ActivatedRoute, private actorService: ActorService) {
    this.activeRoute.queryParams.subscribe(r => {
      if (r) {
        this.actorService.pagingQueryActors(this.pageSize, (this.pageIndex - 1) * this.pageSize).refetch()
      }
    })
  }

  ngOnInit(): void {
    this.actors(this.pageSize, 0)
  }

  actors(first: number, skip: number) {
    this.actorService.pagingQueryActors(first, skip).valueChanges.subscribe(
      {
        next: r => {
          this.listOfData =r.data.actors.items
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
