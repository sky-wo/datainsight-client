import {Injectable} from '@angular/core';
import {Apollo, gql, MutationResult, QueryRef} from "apollo-angular";
import {BehaviorSubject, combineLatest, distinctUntilChanged, filter, map, Observable} from 'rxjs';
import {
  ConfiguredDataInsightCatalog,
  ConfiguredDataInsightCatalogInput,
  Task,
  TaskInput,
  TaskInspectorConfig,
  TasksPage
} from "../type/graphql-type";

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  currentStepSource = new BehaviorSubject<number>(0)
  currentStep$ = this.currentStepSource.asObservable().pipe(
    distinctUntilChanged((pre, next) => pre === next)
  )

  actorIdSource = new BehaviorSubject<string>('')
  configuredCatalogSource = new BehaviorSubject<ConfiguredDataInsightCatalogInput | undefined>(undefined)
  inspectorConfigSource = new BehaviorSubject<TaskInspectorConfig | undefined>(undefined)
  supervisorConfigSource = new BehaviorSubject<string>("")

  taskInput$ = combineLatest(
    [
      this.actorIdSource.asObservable().pipe(filter(r => !!r)),
      this.configuredCatalogSource.asObservable().pipe(filter(r => !!r)),
      this.inspectorConfigSource.asObservable().pipe(filter(r => !!r)),
      this.supervisorConfigSource.asObservable()
    ]
  ).pipe(map(([actorId, catalog, inspector, supervisor]) => {
    const taskInput: TaskInput = {
      actorId: actorId, configuredCatalog: catalog!, inspectorConfig: inspector!, supervisorConfig: supervisor
    }
    return taskInput
  }))

  constructor(private apollo: Apollo) {
  }

  toggleSelectActor(value: string) {
    this.actorIdSource.next(value)
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

  prevStep() {
    this.currentStepSource.next(this.currentStepSource.value - 1)
  }

  nextStep() {
    this.currentStepSource.next(this.currentStepSource.value + 1)
  }


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

  queryTasksAlert(first: number, skip: number): QueryRef<{ tasks: TasksPage }, { first: number, skip: number }> {
    return this.apollo.watchQuery({
      query: gql`
        query ($first: Int!, $skip: Long!) {
          tasks(first: $first, skip: $skip) {
            total
            items{
              id,
              actor{
                name
              }
              counter{
                id,
                streams{
                  id,
                  stream,
                  counters{
                    name,
                    value
                  }
                }
                streamProperties{
                  id,
                  stream,
                  property,
                  counters{
                    name,
                    value
                  }
                }
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

