import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { Actor } from 'src/app/core/type/graphql-type';
import { ActorService } from "../../core/service/actor.service";


@Component({
  selector: 'app-actor-list',
  templateUrl: './actor-list.component.html',
  styleUrls: ['./actor-list.component.less']
})
export class ActorListComponent implements OnInit {

  listOfData: readonly Actor[] = []
  // isTheDataLoaded: boolean = false;
  pageIndex: number = 1
  pageSize: number = 10
  totalData: number = 0

  //此处刷新页面table不会变为load
  isTheDataLoaded: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true)


  constructor(private activeRoute: ActivatedRoute, private actorService: ActorService) {
    this.activeRoute.queryParams.subscribe(r => {
      if (r['refresh']) {
        // console.log("zhingle")
        // this.isTheDataLoaded = true
        this.actorService.pagingQueryActors(this.pageSize, (this.pageIndex - 1) * this.pageSize).refetch()
        //每次刷新说明创建成功,将步骤设置为初始值
        this.actorService.toggleCurrentStep(0)
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
          this.listOfData = r.data.actors.items
          this.totalData = r.data.actors.total
          // this.isTheDataLoaded = true
          this.isTheDataLoaded.next(false)
        },
        error: e => {
          console.error(e)
        }
      }
    )
  }

  pageChange() {
    this.actors(this.pageSize, (this.pageIndex - 1) * this.pageSize)
  }

}
