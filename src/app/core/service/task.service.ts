import { Injectable } from '@angular/core';
import { Apollo, gql, MutationResult } from 'apollo-angular';
import { BehaviorSubject, combineLatest, combineLatestAll, filter, map, Observable, of, switchMap, take } from 'rxjs';
import { ConfiguredDataInsightCatalog, ConfiguredDataInsightCatalogInput, TaskInput, TaskInspectorConfig } from '../type/graphql-type';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private actorIdSource: BehaviorSubject<string> = new BehaviorSubject<string>("")
  actorId$: Observable<string> = this.actorIdSource.asObservable().pipe(filter(r => r !== ""))

  private configuredCatalogSource: BehaviorSubject<ConfiguredDataInsightCatalogInput | undefined> = new BehaviorSubject<ConfiguredDataInsightCatalogInput | undefined>(undefined)
  configuredCatalog$: Observable<ConfiguredDataInsightCatalog | undefined> = this.configuredCatalogSource.asObservable().pipe(filter(r => r !== undefined))

  private inspectorConfigSource: BehaviorSubject<TaskInspectorConfig | undefined> = new BehaviorSubject<TaskInspectorConfig | undefined>(undefined)
  inspectorConfig$: Observable<TaskInspectorConfig | undefined> = this.inspectorConfigSource.asObservable().pipe(filter(r => r !== undefined))

  private supervisorConfigSource: BehaviorSubject<string> = new BehaviorSubject<string>("")
  supervisorConfig$: Observable<string> = this.supervisorConfigSource.asObservable()

  addTaskInput$!: Observable<TaskInput>;

  constructor(
    private apollo: Apollo
  ) {
    this.addTaskInput$ = combineLatest([this.actorId$, this.configuredCatalog$, this.inspectorConfig$, this.supervisorConfig$]).pipe(
      map(([actorId, catalog, inspector, supervisor]) => {
        const res: TaskInput = {
          actorId: actorId,
          configuredCatalog: catalog!,
          inspectorConfig: inspector!,
          supervisorConfig: supervisor
        }
        return res
      })
    )
  }

  toggleActorId(id: string) {
    this.actorIdSource.next(id)
  }

  toggleConfiguredCatalog(config: ConfiguredDataInsightCatalog) {
    this.configuredCatalogSource.next(config)
  }

  toggleInspectorConfig(config: TaskInspectorConfig) {
    this.inspectorConfigSource.next(config)
  }

  toggleSupervisorConfig(config: string) {
    this.supervisorConfigSource.next(config)
  }

  // createTask() {
  //   this.addTaskInput$.pipe(take(1)).subscribe(r => {
  //     //创建任务
  //     this.addTask(r).
  //   })
  // }


  addTask(taskConfig: TaskInput): Observable<MutationResult<{ addTask: number }>> {
    return this.apollo.mutate<{ addTask: number; }, { taskInput: TaskInput; }>({
      mutation: gql`
        mutation($taskInput: TaskInput!){
            addTask(taskInput: $taskInput)
        }
      `,
      variables: {
        taskInput: taskConfig
      }
    });
  }



}
