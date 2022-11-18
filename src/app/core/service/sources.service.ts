import {Injectable} from '@angular/core';
import {Apollo, gql, MutationResult, QueryRef} from 'apollo-angular';
import {map, Observable} from 'rxjs';
import {ActorInput, ActorPage, Connector, ConnectorPage} from '../type/graphql-type';

@Injectable({
  providedIn: 'root'
})
export class SourcesService {

  constructor(private apollo: Apollo) {
  }

  connectors(): Observable<{ connectors: ConnectorPage }> {
    return this.apollo.query<{ connectors: ConnectorPage }, { first: number, skip: number }>({
      query: gql`
        query connectors($first: Int!, $skip: Long!) {
          connectors(first: $first, skip: $skip) {
            total
            items {
              id
              name
            }
          }
        }
      `,
      variables: {
        first: 100,
        skip: 0
      }
    }).pipe(
      map(r => r.data)
    )
  }

  connector(id: string): Observable<{ connector: Connector }> {
    return this.apollo.query<{ connector: Connector }, { id: string }>({
      query: gql`
        query connector($id: ID!) {
          connector(id: $id) {
            name
            specification {
              documentationUrl
              changelogUrl
              connectionSpecification
            }
          }
        }
      `,
      variables: {
        id: id,
      }
    }).pipe(
      map(r => r.data)
    )
  }

  actors(first: number, skip: number): QueryRef<{ actors: ActorPage }, { first: number, skip: number }> {
    return this.apollo.watchQuery<{ actors: ActorPage }, { first: number, skip: number }>({
      query: gql`
        query actors($first:Int!,$skip:Long!){
          actors(first:$first,skip:$skip){
            total
            items{
              id,
              name,
              connectorId
              connector{
                name,
                image,
                version
              }
            }
          }
        }
      `,
      variables: {
        first: first,
        skip: skip
      }
    })
  }

  addActor(actorInput: ActorInput): Observable<MutationResult<number>> {
    return this.apollo.mutate<number, { actorInput: ActorInput }>({
      mutation: gql`
        mutation addActor($actorInput: ActorInput!) {
          addActor(actorInput: $actorInput)
        }
      `,
      variables: {
        actorInput: actorInput
      }
    })
  }
}
