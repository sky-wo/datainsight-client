import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, switchMap, take } from 'rxjs';
import { ConfiguredDataInsightCatalogInput, ConfiguredDataInsightStreamInput, DataInsightDestinationSyncMode, DataInsightStream, DataInsightStreamInput, DataInsightSyncMode } from 'src/app/core/type/graphql-type';
import { JSONSchema7 } from 'json-schema';
import { TaskService } from 'src/app/core/service/task.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ActorService } from 'src/app/core/service/actor.service';

interface ItemData {
  id: number;
  name: string;
  age: number;
  address: string;
}

interface IDataInsightStream {
  id: number;
  stream: DataInsightStream
  properties: { [key: string]: JSONSchema7 }[]
  sourceDefinedCursor?: string
  syncMode: DataInsightSyncMode
}


@Component({
  selector: 'app-select-table',
  templateUrl: './select-table.component.html',
  styleUrls: ['./select-table.component.less']
})
export class SelectTableComponent implements OnInit {

  checked = false;

  indeterminate = false;

  isVisible = false

  selectIds = new Set<number>();

  syncModeItems = [DataInsightSyncMode.FullRefresh, DataInsightSyncMode.Incremental]

  dataSource = new BehaviorSubject<IDataInsightStream[]>([])

  selectModal = 0

  constructor(
    private actorService: ActorService,
    private activateRoute: ActivatedRoute,
    private taskService: TaskService,
    private message: NzMessageService
  ) { }

  ngOnInit(): void {
    const actorId = this.activateRoute.snapshot.paramMap.get("actorId")
    const tableData: IDataInsightStream[] = []
    if (actorId) {
      this.actorService.queryActorById(actorId).valueChanges.subscribe(r => {


        r.data.actor.catalog.streams.forEach((r, index) => {
          let properties: { [key: string]: JSONSchema7 }[] = []
          Object.keys(r.jsonSchema.properties).forEach(res => {
            const pro: { [key: string]: JSONSchema7 } = {}
            pro[res] = r.jsonSchema.properties[res] as JSONSchema7
            properties.push(pro)
          })
          tableData.push({
            id: index,
            stream: r,
            properties: properties,
            syncMode: this.syncModeItems[0]
          })
        })
        this.dataSource.next(tableData)
      })
      this.taskService.toggleActorId(actorId)
    }
  }
  get datasource() {
    return this.dataSource.value
  }

  tableLoading(): boolean {
    return this.dataSource.value.length > 0 ? false : true
  }

  onItemChecked(id: number, checked: boolean): void {
    this.updateCheckedSet(id, checked)
    this.refreshCheckedStatus()
  }

  //提交
  submitTable() {
    const streamInput: ConfiguredDataInsightStreamInput[] = []
    Array.from(this.selectIds).forEach(r => {
      const cursorField: string[] = []
      if (this.datasource[r].sourceDefinedCursor) {
        cursorField.push(this.datasource[r].sourceDefinedCursor!)
      }
      streamInput.push(
        {
          stream: {
            name: this.datasource[r].stream.name,
            jsonSchema: this.datasource[r].stream.jsonSchema,
            defaultCursorField: this.datasource[r].stream.defaultCursorField,
            namespace: this.datasource[r].stream.namespace,
            sourceDefinedCursor: this.datasource[r].stream.sourceDefinedCursor,
            supportedSyncModes: this.datasource[r].stream.supportedSyncModes
          },
          destinationSyncMode: DataInsightDestinationSyncMode.Append,
          syncMode: this.datasource[r].syncMode,
          primaryKey: this.datasource[r].stream.sourceDefinedPrimaryKey,
          cursorField: cursorField
        }
      )
    })
    this.taskService.toggleConfiguredCatalog({
      streams: streamInput
    })
    //展示提交方便测试，后续从Tag模块中选取
    this.taskService.toggleInspectorConfig({
      enabledDataTagIds: []
    })
    this.taskService.addTaskInput$.pipe(take(1), switchMap((r) => this.taskService.addTask(r))).subscribe({
      next: _ => {
        this.message.create("success", `任务创建成功`);
      },
      error: e => {
        console.error(e)
      }
    })


  }

  setSyncMode(index: number, mode: DataInsightSyncMode) {
    const newDataSource = this.datasource
    newDataSource[index].syncMode = mode
    this.dataSource.next(newDataSource)
  }

  setDefinedCursorValue(value: string, index: number) {
    const newDataSource = this.datasource
    newDataSource[index].sourceDefinedCursor = value
    this.dataSource.next(newDataSource)
  }

  onAllChecked(value: boolean): void {
    this.datasource.forEach(item => this.updateCheckedSet(item.id, value));
    this.refreshCheckedStatus();
  }

  refreshCheckedStatus(): void {
    this.checked = this.datasource.every(item => this.selectIds.has(item.id));
    this.indeterminate = this.datasource.some(item => this.selectIds.has(item.id)) && !this.checked;
  }

  updateCheckedSet(id: number, checked: boolean): void {
    if (checked) {
      this.selectIds.add(id);
    } else {
      this.selectIds.delete(id);
    }
  }

  showModal(index: number): void {
    this.selectModal = index
    this.isVisible = true;
  }

  handleOk(): void {
    this.isVisible = false;
  }

  handleCancel(): void {
    this.isVisible = false;
  }
}
