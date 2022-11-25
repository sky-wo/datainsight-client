import { Injectable } from '@angular/core';
import { Apollo, gql, MutationResult, QueryRef } from "apollo-angular";
import { Actor, ActorInput, ActorPage } from "../type/graphql-type";
import { BehaviorSubject, distinctUntilChanged, map, Observable } from "rxjs";

export interface IStepItems {
  name: string
  step: number
}

@Injectable({
  providedIn: 'root'
})
export class ActorService {
  // stepItems = ['选择连接器', '创建actor']

  stepItems: IStepItems[] = [
    {
      name: "选择连接器",
      step: 0
    },
    {
      name: "创建actor",
      step: 1
    }
  ]

  private currentStepSource = new BehaviorSubject<number>(0)
  currentStep$ = this.currentStepSource.asObservable().pipe(
    distinctUntilChanged((pre, next) => pre === next)
  )

  private selectConnectorSource = new BehaviorSubject<string>('')
  // selectConnector$ = this.selectConnectorSource.asObservable()

  constructor(private apollo: Apollo) {
  }

  get getCurrentStep() {
    return this.currentStepSource.value
  }

  get getselectConnector() {
    return this.selectConnectorSource.value
  }

  toggleCurrentStep(value: number) {
    this.currentStepSource.next(value)
  }

  toggleSelectConnector(value: string) {
    this.selectConnectorSource.next(value)
  }


















  /**
   * @return  id
   * */
  addActor(actorInput: ActorInput): Observable<MutationResult<{ addActor: number }>> {
    return this.apollo.mutate({
      mutation: gql`
        mutation ($actorInput: ActorInput!) {
          addActor(actorInput: $actorInput)
        }
      `,
      variables: {
        actorInput
      }
    })
  }

  /**
   * @return  1
   * */
  removeActorById(id: string): Observable<MutationResult<number>> {
    return this.apollo.mutate({
      mutation: gql`
        mutation ($id: ID!) {
          removeActor(id: $id)
        }
      `,
      variables: {
        id
      }
    })
  }



  queryActorById(id: string): QueryRef<{ actor: Actor }, { id: string }> {
    return this.apollo.watchQuery({
      query: gql`
        query($id: ID!) {
          actor(id: $id) {
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
      `,
      variables: {
        id
      }
    })
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

  queryActorsName(first: number, skip: number): QueryRef<{ actors: ActorPage }, { first: number, skip: number }> {
    return this.apollo.watchQuery({
      query: gql`
        query ($first: Int!, $skip: Long!) {
          actors(first: $first, skip: $skip) {
            total
            items {
              id
              name
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




  actor(id: string): Observable<{ actor: Actor }> {
    return this.apollo.query<{ actor: Actor }, { id: string }>({
      query: gql`
      query actor($id: ID!) {
        actor(id: $id){
          id
          name
          connectorId
         catalog{
         streams{
              name
              jsonSchema
              supportedSyncModes
              sourceDefinedCursor
              defaultCursorField
              sourceDefinedPrimaryKey
              namespace
            }
          }
        }
      }
     `,
      variables: {
        id: id,
      }
    }).pipe(map(r => r.data))
  }

}
