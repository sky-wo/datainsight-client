import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {BehaviorSubject, switchMap, take} from 'rxjs';
import {
  ConfiguredDataInsightCatalogInput,
  ConfiguredDataInsightStreamInput,
  DataInsightDestinationSyncMode,
  DataInsightStream,
  DataInsightStreamInput,
  DataInsightSyncMode
} from 'src/app/core/type/graphql-type';
import {JSONSchema7} from 'json-schema';
import {TaskService} from 'src/app/core/service/task.service';
import {NzMessageService} from 'ng-zorro-antd/message';
import {ActorService} from 'src/app/core/service/actor.service';
import {CounterService} from 'src/app/core/service/counter.service';

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

interface ITableCount {
  dataSourceName: string,
  tabelCount: number
}

@Component({
  selector: 'app-select-table',
  templateUrl: './select-table.component.html',
  styleUrls: ['./select-table.component.less']
})
export class SelectTableComponent implements OnInit {

  allCheckBoxTicked = false
  allCheckBoxIndeterminate = false
  dataSourceDetailsModalIsVisible = false
  dataSourceDetailsModalPointsTo = 0

  dataSourceCount!: ITableCount
  streamIdSelected = new Set<number>()
  dataSource = new BehaviorSubject<IDataInsightStream[]>([])
  syncModeItems = [DataInsightSyncMode.FullRefresh, DataInsightSyncMode.Incremental]


  constructor(private actorService: ActorService, private router: Router, private taskService: TaskService, private message: NzMessageService, private counterService: CounterService) {
  }

  get datasource() {
    return this.dataSource.value
  }

  ngOnInit(): void {
    // TODO: actotId

    this.taskService.actorIdSource.subscribe(actotId => {
      if (!!actotId) {
        const tableData: IDataInsightStream[] = []
        this.actorService.queryActorById(actotId).valueChanges.subscribe(actor => {
          //统计数据源表数量
          this.dataSourceCount = {
            dataSourceName: actor.data.actor.name, tabelCount: actor.data.actor.catalog.streams.length
          }

          actor.data.actor.catalog.streams.forEach((dataInsightStream, index) => {
            let properties: { [key: string]: JSONSchema7 }[] = []
            Object.keys(dataInsightStream.jsonSchema.properties).forEach(res => {
              const pro: { [key: string]: JSONSchema7 } = {}
              pro[res] = dataInsightStream.jsonSchema.properties[res] as JSONSchema7
              properties.push(pro)
            })
            tableData.push({
              id: index, stream: dataInsightStream, properties: properties, syncMode: this.syncModeItems[0]
            })
          })
          this.dataSource.next(tableData)
        })
      }

    })
  }

  prevStep() {
    this.taskService.prevStep()
  }

  nextSetp() {
    const configuredDataInsightStreamInputs: ConfiguredDataInsightStreamInput[] = []

    Array.from(this.streamIdSelected).forEach(streamId => {
      let iDataInsightStream = this.datasource[streamId]

      const cursorField = []
      if (iDataInsightStream.sourceDefinedCursor) {
        cursorField.push(iDataInsightStream.sourceDefinedCursor!)
      }

      // TODO: DataInsightDestinationSyncMode
      configuredDataInsightStreamInputs.push({
        cursorField: cursorField,
        destinationSyncMode: DataInsightDestinationSyncMode.Append,
        primaryKey: iDataInsightStream.stream.sourceDefinedPrimaryKey,
        stream: {
          name: iDataInsightStream.stream.name,
          jsonSchema: iDataInsightStream.stream.jsonSchema,
          defaultCursorField: iDataInsightStream.stream.defaultCursorField,
          namespace: iDataInsightStream.stream.namespace,
          sourceDefinedCursor: iDataInsightStream.stream.sourceDefinedCursor,
          supportedSyncModes: iDataInsightStream.stream.supportedSyncModes
        },
        syncMode: iDataInsightStream.syncMode
      })
    })

    this.taskService.toggleConfiguredCatalog({
      streams: configuredDataInsightStreamInputs
    })

    this.taskService.nextStep()

    // TODO:考虑后台返回
    // this.collectTableInfo()
  }


  collectTableInfo() {
    const dataCount = this.counterService.getTableCount
    if (dataCount.has(this.dataSourceCount.dataSourceName) && dataCount.get(this.dataSourceCount.dataSourceName)) {
      const newCount = dataCount.get(this.dataSourceCount.dataSourceName)! + this.dataSourceCount.tabelCount
      dataCount.set(this.dataSourceCount.dataSourceName, newCount)
    } else {
      dataCount.set(this.dataSourceCount.dataSourceName, this.dataSourceCount.tabelCount)
    }
    this.counterService.toggleTableCount(dataCount)
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


  showModal(index: number): void {
    this.dataSourceDetailsModalPointsTo = index
    this.dataSourceDetailsModalIsVisible = true;
  }

  handleOk(): void {
    this.dataSourceDetailsModalIsVisible = false;
  }

  handleCancel(): void {
    this.dataSourceDetailsModalIsVisible = false;
  }

  tableLoading(): boolean {
    return this.dataSource.value.length <= 0
  }

  onItemChecked(id: number, checked: boolean): void {
    this.updateCheckedSet(id, checked)
    this.refreshCheckedStatus()
  }

  onAllChecked(value: boolean): void {
    this.datasource.forEach(item => this.updateCheckedSet(item.id, value));
    this.refreshCheckedStatus();
  }

  refreshCheckedStatus(): void {
    this.allCheckBoxTicked = this.datasource.every(item => this.streamIdSelected.has(item.id));
    this.allCheckBoxIndeterminate = this.datasource.some(item => this.streamIdSelected.has(item.id)) && !this.allCheckBoxTicked;
  }

  updateCheckedSet(id: number, checked: boolean): void {
    if (checked) {
      this.streamIdSelected.add(id);
    } else {
      this.streamIdSelected.delete(id);
    }
  }
}
