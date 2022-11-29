import {Injectable} from '@angular/core';
import {Apollo, gql, MutationResult, QueryRef} from "apollo-angular";
import {BehaviorSubject, combineLatest, distinctUntilChanged, filter, map, Observable, switchMap, take} from 'rxjs';
import {
  ConfiguredDataInsightCatalog,
  ConfiguredDataInsightCatalogInput,
  TaskInput,
  TaskInspectorConfig
} from "../../core/type/graphql-type";
import {TaskService} from "../../core/service/task.service";

@Injectable({
  providedIn: 'root'
})
export class CreateTaskCommunicationService {

  currentStepSource = new BehaviorSubject<number>(0)
  currentStep$ = this.currentStepSource.asObservable().pipe(
    distinctUntilChanged((pre, next) => pre === next)
  )

  actorIdSource = new BehaviorSubject<string>("")
  configuredCatalogSource = new BehaviorSubject<ConfiguredDataInsightCatalogInput | undefined>(undefined)
  inspectorConfigSource = new BehaviorSubject<TaskInspectorConfig | undefined>(undefined)
  supervisorConfigSource = new BehaviorSubject<string>("")

  taskInput$ = combineLatest(
    [
      this.actorIdSource.asObservable().pipe(filter(r => !!r)),
      this.configuredCatalogSource.asObservable().pipe(filter(r => !!r)),
      this.inspectorConfigSource.asObservable().pipe(filter(r => !!r)),
      this.supervisorConfigSource.asObservable().pipe(filter(r => !!r))
    ]
  ).pipe(map(([actorId, catalog, inspector, supervisor]) => {
    const taskInput: TaskInput = {
      actorId: actorId, configuredCatalog: catalog!, inspectorConfig: inspector!, supervisorConfig: supervisor
    }
    return taskInput
  }))

  constructor(private apollo: Apollo, private taskService: TaskService) {
  }

  announceActorId(value: string) {
    this.actorIdSource.next(value)
  }

  announceConfiguredCatalog(config: ConfiguredDataInsightCatalog) {
    this.configuredCatalogSource.next(config)
  }

  announceInspectorConfig(config: TaskInspectorConfig) {
    this.inspectorConfigSource.next(config)
  }

  announceSupervisorConfig(config: string) {
    this.supervisorConfigSource.next(config)
  }


  createTaskByStep(){

    // TODO : 管理配置
    this.announceSupervisorConfig("666")

    return this.taskInput$.pipe(take(1), switchMap((r) => this.taskService.addTask(r)))
  }

  prevStep() {
    this.currentStepSource.next(this.currentStepSource.value - 1)
  }

  nextStep() {
    this.currentStepSource.next(this.currentStepSource.value + 1)
  }}
