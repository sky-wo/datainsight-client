import { Injectable } from '@angular/core';
import { Apollo, gql, MutationResult, QueryRef } from 'apollo-angular';
import { map, Observable } from 'rxjs';
import { Connector, ConnectorInput, ConnectorPage } from '../type/graphql-type';

const QUERYCONNECTORS = gql`
  query connectors($first: Int!, $skip: Long!) {
  connectors(first: $first, skip: $skip) {
    total
    items {
      id
      name
    }
  }
}
`
const ADDCONNECTOR = gql`
mutation addConnector($connectorInput: ConnectorInput!) {
  addConnector(connectorInput: $connectorInput)
}
`

@Injectable({
  providedIn: 'root'
})
export class ConnectorService {

  constructor(private apollo: Apollo) { }

  connectors(first: number, skip: number): QueryRef<{ connectors: ConnectorPage }, { first: number, skip: number }> {
    return this.apollo.watchQuery<{ connectors: ConnectorPage }, { first: number, skip: number }>({
      query: QUERYCONNECTORS,
      variables: {
        first: first,
        skip: skip
      }
    })
  }
  addConnector(connectorInput: ConnectorInput): Observable<MutationResult<number>> {
    return this.apollo.mutate<number, { connectorInput: ConnectorInput }>({
      mutation: ADDCONNECTOR,
      variables: {
        connectorInput: connectorInput
      }
    })
  }
}
