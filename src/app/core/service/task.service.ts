import { Injectable } from '@angular/core';
import { Apollo, gql, MutationResult, QueryRef } from "apollo-angular";
import { BehaviorSubject, combineLatest, distinctUntilChanged, filter, map, Observable } from 'rxjs';
import { Task } from "../type/graphql-type";
import {
  ConfiguredDataInsightCatalog,
  ConfiguredDataInsightCatalogInput,
  TaskInput,
  TaskInspectorConfig,
  TaskRunsPage,
  TasksPage
} from "../type/graphql-type";
import { IStepItems } from './actor.service';


@Injectable({
  providedIn: 'root'
})
export class TaskService {
  stepItems: IStepItems[] = [
    {
      name: "选择actor",
      step: 0
    },
    //后续添加
    // {
    //   name: "选择规则",
    //   step: 1
    // }
    {
      name: "选择表",
      step: 1
    }
  ]

  private currentStepSource = new BehaviorSubject<number>(0)
  currentStep$ = this.currentStepSource.asObservable().pipe(
    distinctUntilChanged((pre, next) => pre === next)
  )

  private selectActorSource = new BehaviorSubject<string>('')
  // selectConnector$ = this.selectConnectorSource.asObservable()


  addTaskInput$!: Observable<TaskInput>;
  private actorIdSource: BehaviorSubject<string> = new BehaviorSubject<string>("")

  actorId$: Observable<string> = this.actorIdSource.asObservable().pipe(filter(r => r !== ""))
  private configuredCatalogSource: BehaviorSubject<ConfiguredDataInsightCatalogInput | undefined> = new BehaviorSubject<ConfiguredDataInsightCatalogInput | undefined>(undefined)

  configuredCatalog$: Observable<ConfiguredDataInsightCatalog | undefined> = this.configuredCatalogSource.asObservable().pipe(filter(r => r !== undefined))
  private inspectorConfigSource: BehaviorSubject<TaskInspectorConfig | undefined> = new BehaviorSubject<TaskInspectorConfig | undefined>(undefined)

  inspectorConfig$: Observable<TaskInspectorConfig | undefined> = this.inspectorConfigSource.asObservable().pipe(filter(r => r !== undefined))
  private supervisorConfigSource: BehaviorSubject<string> = new BehaviorSubject<string>("")

  supervisorConfig$: Observable<string> = this.supervisorConfigSource.asObservable()





  constructor(private apollo: Apollo) {
    this.addTaskInput$ = combineLatest([this.actorId$, this.configuredCatalog$, this.inspectorConfig$, this.supervisorConfig$]).pipe(map(([actorId, catalog, inspector, supervisor]) => {
      const res: TaskInput = {
        actorId: actorId, configuredCatalog: catalog!, inspectorConfig: inspector!, supervisorConfig: supervisor
      }
      return res
    }))
  }

  get getCurrentStep() {
    return this.currentStepSource.value
  }

  get getselectActor() {
    return this.selectActorSource.value
  }

  toggleCurrentStep(value: number) {
    this.currentStepSource.next(value)
  }

  toggleSelectActor(value: string) {
    this.selectActorSource.next(value)
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


  /**
   * @return  id
   * */
  addTask(taskInput: TaskInput): Observable<MutationResult<string>> {
    return this.apollo.mutate({
      mutation: gql`
        mutation ($taskInput: TaskInput!) {
          addTask(taskInput: $taskInput)
        }
      `, variables: {
        taskInput
      }
    })
  }

  /**
   * @return  1
   * */
  startTaskById(id: string): Observable<MutationResult<number>> {
    return this.apollo.mutate({
      mutation: gql`
        mutation ($id: ID!) {
          startTask(id: $id)
        }
      `, variables: {
        id
      }
    })
  }

  /**
   * @return  1
   * */
  cancelTaskById(id: string): Observable<MutationResult<number>> {
    return this.apollo.mutate({
      mutation: gql`
        mutation ($id: ID!) {
          cancelTask(id: $id)
        }
      `, variables: {
        id
      }
    })
  }

  /**
   * @return  1
   * */
  removeTaskById(id: string): Observable<MutationResult<number>> {
    return this.apollo.mutate({
      mutation: gql`
        mutation ($id: ID!) {
          removeTask(id: $id)
        }
      `, variables: {
        id
      }
    })
  }

  queryTaskById(id: string): QueryRef<{ task: Task }, { id: string }> {
    return this.apollo.watchQuery({
      query: gql`
        query($id: ID!) {
          task(id: $id) {
            id
            state
            actorId
            configuredCatalog {
              streams{
                cursorField
                destinationSyncMode
                primaryKey
                stream{
                  defaultCursorField
                  jsonSchema
                  name
                  namespace
                  sourceDefinedCursor
                  sourceDefinedPrimaryKey
                  supportedSyncModes
                }
                syncMode
              }
            }
            inspectorConfig {
              enabledDataTagIds
            }
            supervisorConfig
            actor {
              id
              name
              connectorId
              connectorConfig
              connector{
                id
                image
                name
                specification{
                  changelogUrl
                  connectionSpecification
                  documentationUrl
                }
                version
              }
              catalog{
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
            taskRun(id: 0) {
              id
              taskId
              state
              errorMessage
              #        logs(first: 100, after: 0)
            }
            taskRuns(first: 100, skip: 0) {
              total
              #        items
            }
          }
        }
      `, variables: {
        id
      }
    })
  }


  pagingQueryTasks(first: number, skip: number): QueryRef<{ tasks: TasksPage }, { first: number, skip: number }> {
    return this.apollo.watchQuery({
      query: gql`
        query ($first: Int!, $skip: Long!) {
          tasks(first: $first, skip: $skip) {
            total
            items{
              id,
              state,
              actor{
                name
              }
            }
          }
        }
      `, variables: {
        first, skip
      }
    })
  }

  queryTaskRunsByTaskId(id: string, taskRunFirst: number, skip: number, logsFirst: number, after: string): QueryRef<{ task: Task }, { id: string, taskRunFirst: number, skip: number, logsFirst: number, after: string }> {
    return this.apollo.watchQuery({
      query: gql`
        query($id:ID!,$taskRunFirst:Int!,$skip:Long!,$logsFirst:Int!,$after:ID!){
          task(id:$id){
		        taskRuns (first:$taskRunFirst,skip:$skip){
            total,
            items{
              id,
              taskId,
              state,
              errorMessage,
              logs(first:$logsFirst,after:$after){
                items{
                  id,
                  message,	
                  taskId,
                  taskRunId,
                  level,
                }
              }
              }
            }
          }
        }
      `,
      variables: {
        id: id,
        taskRunFirst: taskRunFirst,
        skip: skip,
        logsFirst: logsFirst,
        after: after
      }
    })
  }
}

