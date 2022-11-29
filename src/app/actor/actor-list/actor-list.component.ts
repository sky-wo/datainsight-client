import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {BehaviorSubject} from 'rxjs';
import {Actor, ActorPage} from 'src/app/core/type/graphql-type';
import {ActorService} from "../../core/service/actor.service";
import {Apollo, gql, QueryRef} from "apollo-angular";


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


  constructor(private activeRoute: ActivatedRoute, private actorService: ActorService, private apollo: Apollo) {
    this.activeRoute.queryParams.subscribe(r => {
      if (r['refresh']) {
        // console.log("zhingle")
        // this.isTheDataLoaded = true
        this.pagingQueryActors(this.pageSize, (this.pageIndex - 1) * this.pageSize).refetch()
        //每次刷新说明创建成功,将步骤设置为初始值
        this.actorService.toggleCurrentStep(0)
      }
    })
  }

  ngOnInit(): void {
    this.actors(this.pageSize, 0)
  }

  actors(first: number, skip: number) {
    this.pagingQueryActors(first, skip).valueChanges.subscribe(
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

  pagingQueryActors(first: number, skip: number): QueryRef<{ actors: ActorPage }, { first: number, skip: number }> {
    return this.apollo.watchQuery({
      query: gql`
        query ($first: Int!, $skip: Long!) {
          actors(first: $first, skip: $skip) {
            total
            items {
              id
              name
              connectorId
              connectorConfig
              connector {
                id
                name
                image
                version
                specification{
                  changelogUrl
                  connectionSpecification
                  documentationUrl
                }
              }
              catalog {
                streams{
                  defaultCursorField
                  jsonSchema
                  name
                  namespace
                  sourceDefinedCursor
                  sourceDefinedPrimaryKey
                  supportedSyncModes
                }
              }
            }
          }
        }
      `,
      variables: {
        first,
        skip
      }
    })
  }

}
