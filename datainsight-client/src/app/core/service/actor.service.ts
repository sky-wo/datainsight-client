import {Injectable} from '@angular/core';
import {Apollo, gql, MutationResult} from "apollo-angular";
import {ActorInput} from "../type/graphql-type";
import {BehaviorSubject, distinctUntilChanged, Observable} from "rxjs";

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

}
