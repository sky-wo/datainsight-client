import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, filter, switchMap } from 'rxjs';
import {
  Actor,
  ConfiguredDataInsightStreamInput,
  DataInsightDestinationSyncMode,
  DataInsightStream,
  DataInsightSyncMode
} from 'src/app/core/type/graphql-type';
import { JSONSchema7 } from 'json-schema';
import { CounterService } from 'src/app/core/service/counter.service';
import { Apollo, gql } from "apollo-angular";
import { CreateTaskCommunicationService } from "../create-task-communication.service";

interface ITableRow {
  id: number;
  tableName: string;
  namespace: string;
  //用户选中的sourceDefinedCursor
  chooseSourceDefinedCursor: string;
  //前台展示的sourceDefinedCursor
  sourceDefinedCursor: string[];
  //前台展示的syncmode
  syncMode: ISyncMode[];
  //用户选中的syncmode

  chooseSyncMode: DataInsightSyncMode

  chooseDestinationSyncMode: DataInsightDestinationSyncMode

  primaryKey: string[];

  properties: { [key: string]: JSONSchema7 }[]

  stream: DataInsightStream
}

interface ISyncMode {
  name: string
  syncmode: DataInsightSyncMode
  destinationSyncMode: DataInsightDestinationSyncMode
}

const syncMode: ISyncMode[] = [
  { name: "Full refresh | Append", syncmode: DataInsightSyncMode.FullRefresh, destinationSyncMode: DataInsightDestinationSyncMode.Append },
  { name: "Full refresh | Overwrite", syncmode: DataInsightSyncMode.FullRefresh, destinationSyncMode: DataInsightDestinationSyncMode.Overwrite },
  { name: "Incremental | Append", syncmode: DataInsightSyncMode.Incremental, destinationSyncMode: DataInsightDestinationSyncMode.Append }
]


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

  streamIdSelected = new Set<number>()

  dataSource = new BehaviorSubject<ITableRow[]>([])

  syncModeItems = [DataInsightSyncMode.FullRefresh, DataInsightSyncMode.Incremental]

  tableLoading: boolean = false


  constructor(private createTaskCommunicationService: CreateTaskCommunicationService, private counterService: CounterService, private apollo: Apollo) {
  }

  get datasource() {
    return this.dataSource.value
  }

  ngOnInit(): void {
    this.createTaskCommunicationService.actorIdSource.pipe(filter(r => !!r), switchMap(actotId => {
      //每当新的actor被选择后需要重新加载数据，需将table的loading置为true
      this.tableLoading = true
      //请求actor的catalog
      return this.apollo.watchQuery<{ actor: Actor }>({
        query: gql`
          query($actotId: ID!) {
            actor(id: $actotId) {
              name
              catalog {
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
          }
        `,
        variables: {
          actotId
        }
      }).valueChanges
    })).subscribe(actor => {
      const tableData1: ITableRow[] = []
      actor.data.actor.catalog.streams.forEach((dataInsightStream, index) => {
        //找到表结构
        let properties: { [key: string]: JSONSchema7 }[] = []
        const cursor: string[] = []
        Object.keys(dataInsightStream.jsonSchema.properties).forEach(res => {
          const pro: { [key: string]: JSONSchema7 } = {}
          pro[res] = dataInsightStream.jsonSchema.properties[res] as JSONSchema7
          properties.push(pro)
          cursor.push(res)
        })
        //表命名空间
        const namespance = dataInsightStream.namespace ? dataInsightStream.namespace : ""
        //表主键
        const primaryKey = dataInsightStream.sourceDefinedPrimaryKey ? dataInsightStream.sourceDefinedPrimaryKey : []
        tableData1.push(
          {
            id: index,
            tableName: dataInsightStream.name,
            namespace: namespance,
            sourceDefinedCursor: cursor,
            primaryKey: primaryKey,
            syncMode: syncMode,
            properties: properties,
            stream: dataInsightStream,
            chooseDestinationSyncMode: syncMode[0].destinationSyncMode,
            chooseSyncMode: syncMode[0].syncmode,
            chooseSourceDefinedCursor: ''
          })
      })
      this.dataSource.next(tableData1)
      //请求接收到响应数据后恢复表单
      this.tableLoading = false
    })
  }

  prevStep() {
    this.createTaskCommunicationService.prevStep()
  }

  nextSetp() {
    const configuredDataInsightStreamInputs: ConfiguredDataInsightStreamInput[] = []
    Array.from(this.streamIdSelected).forEach(streamId => {
      let iDataInsightStream = this.datasource[streamId]

      const cursorField = []
      if (iDataInsightStream.chooseSourceDefinedCursor !== '') {
        cursorField.push(iDataInsightStream.chooseSourceDefinedCursor)
      }
      // TODO: DataInsightDestinationSyncMode
      configuredDataInsightStreamInputs.push({
        cursorField: cursorField,
        destinationSyncMode: DataInsightDestinationSyncMode.Append,
        primaryKey: iDataInsightStream.primaryKey,
        stream: {
          name: iDataInsightStream.tableName,
          jsonSchema: iDataInsightStream.stream.jsonSchema,
          defaultCursorField: iDataInsightStream.stream.defaultCursorField,
          namespace: iDataInsightStream.stream.namespace,
          sourceDefinedCursor: iDataInsightStream.stream.sourceDefinedCursor,
          supportedSyncModes: iDataInsightStream.stream.supportedSyncModes
        },
        syncMode: iDataInsightStream.chooseSyncMode
      })
    })

    this.createTaskCommunicationService.announceConfiguredCatalog({
      streams: configuredDataInsightStreamInputs
    })
    this.createTaskCommunicationService.configuredCatalogSource.subscribe(r => console.log(r))
    this.createTaskCommunicationService.nextStep()
  }

  setSyncMode(index: number, mode: ISyncMode) {
    const newDataSource = this.datasource
    newDataSource[index].chooseSyncMode = mode.syncmode
    newDataSource[index].chooseDestinationSyncMode = mode.destinationSyncMode
    this.dataSource.next(newDataSource)
  }


  setDefinedCursorValue(index: number, value: string) {
    const newDataSource = this.datasource
    newDataSource[index].chooseSourceDefinedCursor = value
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
