import {Injectable} from '@angular/core';
import {Apollo, gql, MutationResult, QueryRef} from "apollo-angular";
import {Actor, ActorInput, ActorPage} from "../type/graphql-type";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ActorService {

  constructor(private apollo: Apollo) {
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



}
