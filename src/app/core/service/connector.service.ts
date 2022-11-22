import {Injectable} from '@angular/core';
import {Apollo, gql, MutationResult, QueryRef} from 'apollo-angular';
import {Observable} from 'rxjs';
import {Connector, ConnectorInput, ConnectorPage} from '../type/graphql-type';


@Injectable({
  providedIn: 'root'
})
export class ConnectorService {

  constructor(private apollo: Apollo) {
  }

  /**
   * @return  id
   * */
  addConnector(connectorInput: ConnectorInput): Observable<MutationResult<string>> {
    return this.apollo.mutate({
      mutation: gql`
        mutation addConnector($connectorInput: ConnectorInput!) {
          addConnector(connectorInput: $connectorInput)
        }
      `,
      variables: {
        connectorInput
      }
    })
  }

  /**
   * @return  1
   * */
  removeConnectorById(id: string): Observable<MutationResult<number>> {
    return this.apollo.mutate({
      mutation: gql`
        mutation removeConnectorById($id: ID!) {
          removeConnector(id: $id)
        }
      `,
      variables: {
        id
      }
    })
  }

  queryConnectorById(id: string): QueryRef<{ connector: Connector }, { id: string }> {
    return this.apollo.watchQuery({
      query: gql`
        query($id: ID!) {
          connector(id: $id) {
            id
            name
            image
            version
            specification {
              documentationUrl
              changelogUrl
              connectionSpecification
            }
          }
        }
      `,
      variables: {
        id
      }
    })
  }


  pagingQueryConnectors(first: number, skip: number): QueryRef<{ connectors: ConnectorPage }, { first: number, skip: number }> {
    return this.apollo.watchQuery({
      query: gql`
        query ($first: Int!, $skip: Long!) {
          connectors(first: $first, skip: $skip) {
            total
            items {
              id
              name
              image
              version
              specification {
                documentationUrl
                changelogUrl
                connectionSpecification
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
