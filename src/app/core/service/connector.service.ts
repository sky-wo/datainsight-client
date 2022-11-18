import {Injectable} from '@angular/core';
import {Apollo, gql, MutationResult, QueryRef} from 'apollo-angular';
import {map, Observable} from 'rxjs';
import {Connector, ConnectorInput, ConnectorPage} from '../type/graphql-type';


@Injectable({
  providedIn: 'root'
})
export class ConnectorService {

  constructor(private apollo: Apollo) {
  }

  pagingQueryConnectors(first: number, skip: number): QueryRef<{ connectors: ConnectorPage }, { first: number, skip: number }> {
    return this.apollo.watchQuery<{ connectors: ConnectorPage }, { first: number, skip: number }>({
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
        first: first,
        skip: skip
      }
    })
  }

  addConnector(connectorInput: ConnectorInput): Observable<MutationResult<number>> {
    return this.apollo.mutate<number, { connectorInput: ConnectorInput }>({
      mutation: gql`
        mutation addConnector($connectorInput: ConnectorInput!) {
          addConnector(connectorInput: $connectorInput)
        }
      `,
      variables: {
        connectorInput: connectorInput
      }
    })
  }

}
