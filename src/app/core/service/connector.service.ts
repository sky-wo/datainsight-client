import {Injectable} from '@angular/core';
import {Apollo, gql, MutationResult} from 'apollo-angular';
import {Observable} from 'rxjs';
import {ConnectorInput} from '../type/graphql-type';

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
        mutation ($connectorInput: ConnectorInput!) {
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
        mutation ($id: ID!) {
          removeConnector(id: $id)
        }
      `,
      variables: {
        id
      }
    })
  }

}
