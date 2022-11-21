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


}
