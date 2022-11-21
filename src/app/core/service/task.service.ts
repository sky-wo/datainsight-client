import {Injectable} from '@angular/core';
import {Apollo, gql, MutationResult, QueryRef} from "apollo-angular";
import {TaskInput, TasksPage} from "../type/graphql-type";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private apollo: Apollo) {
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
      `,
      variables: {
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
      `,
      variables: {
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
      `,
      variables: {
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
      `,
      variables: {
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
      `,
      variables: {
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
            items {
              id
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

