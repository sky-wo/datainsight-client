import {Injectable} from '@angular/core';
import {Apollo, gql, MutationResult} from "apollo-angular";
import {DataRuleInput, DataTagInput} from "../type/graphql-type";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PolicyService {

  constructor(private apollo: Apollo) {
  }

  /**
   * @return  id
   * */
  addDataTag(dataTagInput: DataTagInput): Observable<MutationResult<string>> {
    return this.apollo.mutate({
      mutation: gql`
        mutation ($dataTagInput: DataTagInput!) {
          addDataTag(dataTagInput: $dataTagInput)
        }
      `, variables: {
        dataTagInput
      }
    })
  }

  /**
   * @return  id
   * */
  addDataRule(dataRuleInput: DataRuleInput, dataTagId: String): Observable<MutationResult<string>> {
    return this.apollo.mutate({
      mutation: gql`
        mutation ($dataRuleInput: DataRuleInput!, $dataTagId: ID!) {
          addDataRule(dataRuleInput: $dataRuleInput , dataTagId: $dataTagId)
        }
      `, variables: {
        dataRuleInput, dataTagId
      }
    })
  }

  /**
   * @return  1
   * */
  moveDataTag(dataTagId: string, newParentId?: string): Observable<MutationResult<number>> {
    return this.apollo.mutate({
      mutation: gql`
        mutation ($dataTagId: ID!, $newParentId: ID) {
          moveDataTag(dataTagId: $dataTagId,newParentId: $newParentId)
        }
      `, variables: {
        dataTagId, newParentId
      }
    })
  }

  /**
   * @return  1
   * */
  moveDataRule(dataTagId: string, dataRuleId: string, newDataTagId: string): Observable<MutationResult<number>> {
    return this.apollo.mutate({
      mutation: gql`
        mutation ($dataTagId: ID!, $dataRuleId: ID!, $newDataTagId: ID!) {
          moveDataRule(dataRuleId: $dataRuleId, dataTagId: $dataTagId, newDataTagId: $newDataTagId)
        }
      `, variables: {
        dataTagId, dataRuleId, newDataTagId
      }
    })
  }

}

