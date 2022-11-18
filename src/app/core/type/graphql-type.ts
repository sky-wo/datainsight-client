export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** 任意 JSON 对象 */
  JSON: string;
  /** A 64-bit signed integer */
  Long: number;
  /** 事件戳, 从1970-1-1起的毫秒数 */
  Timestamp: string;
};

/**  连接器实例 */
export type Actor = {
  __typename?: 'Actor';
  catalog: DataInsightCatalog;
  connector?: Maybe<Connector>;
  connectorConfig: Scalars['JSON'];
  connectorId: Scalars['ID'];
  id: Scalars['ID'];
  name: Scalars['String'];
};

export type ActorInput = {
  connectorConfig: Scalars['JSON'];
  connectorId: Scalars['ID'];
  name: Scalars['String'];
};

export type ActorPage = {
  __typename?: 'ActorPage';
  items: Array<Actor>;
  total: Scalars['Long'];
};

export type ConfiguredDataInsightCatalog = {
  __typename?: 'ConfiguredDataInsightCatalog';
  streams: Array<ConfiguredDataInsightStream>;
};

export type ConfiguredDataInsightCatalogInput = {
  streams: Array<ConfiguredDataInsightStreamInput>;
};

export type ConfiguredDataInsightStream = {
  __typename?: 'ConfiguredDataInsightStream';
  cursorField?: Maybe<Array<Scalars['String']>>;
  destinationSyncMode: DataInsightDestinationSyncMode;
  primaryKey?: Maybe<Array<Scalars['String']>>;
  stream: DataInsightStream;
  syncMode: DataInsightSyncMode;
};

export type ConfiguredDataInsightStreamInput = {
  cursorField?: InputMaybe<Array<Scalars['String']>>;
  destinationSyncMode: DataInsightDestinationSyncMode;
  primaryKey?: InputMaybe<Array<Scalars['String']>>;
  stream: DataInsightStreamInput;
  syncMode: DataInsightSyncMode;
};

/**  连接器定义 */
export type Connector = {
  __typename?: 'Connector';
  id: Scalars['ID'];
  image: Scalars['String'];
  name: Scalars['String'];
  specification: ConnectorSpecification;
  version: Scalars['String'];
};

export type ConnectorInput = {
  image: Scalars['String'];
  name: Scalars['String'];
  version: Scalars['String'];
};

export type ConnectorPage = {
  __typename?: 'ConnectorPage';
  items: Array<Connector>;
  total: Scalars['Long'];
};

export type ConnectorSpecification = {
  __typename?: 'ConnectorSpecification';
  changelogUrl?: Maybe<Scalars['String']>;
  connectionSpecification: Scalars['JSON'];
  documentationUrl?: Maybe<Scalars['String']>;
};

export type DataInsightCatalog = {
  __typename?: 'DataInsightCatalog';
  streams: Array<DataInsightStream>;
};

export enum DataInsightDestinationSyncMode {
  Append = 'APPEND',
  Dedup = 'DEDUP',
  Overwrite = 'OVERWRITE'
}

export type DataInsightStream = {
  __typename?: 'DataInsightStream';
  defaultCursorField?: Maybe<Array<Scalars['String']>>;
  jsonSchema: Scalars['JSON'];
  name: Scalars['String'];
  namespace?: Maybe<Scalars['String']>;
  sourceDefinedCursor?: Maybe<Scalars['Boolean']>;
  sourceDefinedPrimaryKey?: Maybe<Array<Scalars['String']>>;
  supportedSyncModes?: Maybe<Array<DataInsightSyncMode>>;
};

export type DataInsightStreamInput = {
  defaultCursorField?: InputMaybe<Array<Scalars['String']>>;
  jsonSchema: Scalars['JSON'];
  name: Scalars['String'];
  namespace?: InputMaybe<Scalars['String']>;
  sourceDefinedCursor?: InputMaybe<Scalars['Boolean']>;
  sourceDefinedPrimaryKey?: InputMaybe<Array<Scalars['String']>>;
  supportedSyncModes?: InputMaybe<Array<DataInsightSyncMode>>;
};

export enum DataInsightSyncMode {
  FullRefresh = 'FULL_REFRESH',
  Incremental = 'INCREMENTAL'
}

export type DataRule = {
  __typename?: 'DataRule';
  content: Scalars['JSON'];
  dataTagId: Scalars['ID'];
  id: Scalars['ID'];
};

export type DataRuleInput = {
  content: Scalars['JSON'];
};

export type DataRulesPage = {
  __typename?: 'DataRulesPage';
  items: Array<DataRule>;
  total: Scalars['Long'];
};

export type DataTag = {
  __typename?: 'DataTag';
  alert: Scalars['Boolean'];
  id: Scalars['ID'];
  level: Scalars['Int'];
  name: Scalars['String'];
  parentId?: Maybe<Scalars['ID']>;
  rule: DataRule;
  rules: DataRulesPage;
};


export type DataTagRuleArgs = {
  id: Scalars['ID'];
};


export type DataTagRulesArgs = {
  first: Scalars['Int'];
  skip?: Scalars['Long'];
};

export type DataTagInput = {
  alert: Scalars['Boolean'];
  level: Scalars['Int'];
  name: Scalars['String'];
};

export type DataTagsPage = {
  __typename?: 'DataTagsPage';
  items: Array<DataTag>;
  total: Scalars['Long'];
};

export enum LogLevel {
  Debug = 'DEBUG',
  Error = 'ERROR',
  Info = 'INFO',
  Trace = 'TRACE',
  Warn = 'WARN'
}

export type Mutation = {
  __typename?: 'Mutation';
  addActor: Scalars['ID'];
  addConnector: Scalars['ID'];
  addDataRule: Scalars['ID'];
  addDataTag: Scalars['ID'];
  addTask: Scalars['ID'];
  cancelTask: Scalars['Int'];
  moveDataRule: Scalars['Int'];
  moveDataTag?: Maybe<Scalars['Int']>;
  removeActor: Scalars['Int'];
  removeConnector: Scalars['Int'];
  removeTask: Scalars['Int'];
  startTask: Scalars['Int'];
};


export type MutationAddActorArgs = {
  actorInput: ActorInput;
};


export type MutationAddConnectorArgs = {
  connectorInput: ConnectorInput;
};


export type MutationAddDataRuleArgs = {
  dataRuleInput: DataRuleInput;
  dataTagId: Scalars['ID'];
};


export type MutationAddDataTagArgs = {
  dataTagInput: DataTagInput;
  parentId?: InputMaybe<Scalars['ID']>;
};


export type MutationAddTaskArgs = {
  taskInput: TaskInput;
};


export type MutationCancelTaskArgs = {
  id: Scalars['ID'];
};


export type MutationMoveDataRuleArgs = {
  dataRuleId: Scalars['ID'];
  dataTagId: Scalars['ID'];
  newDataTagId: Scalars['ID'];
};


export type MutationMoveDataTagArgs = {
  dataTagId: Scalars['ID'];
  newParentId?: InputMaybe<Scalars['ID']>;
};


export type MutationRemoveActorArgs = {
  id: Scalars['ID'];
};


export type MutationRemoveConnectorArgs = {
  id: Scalars['ID'];
};


export type MutationRemoveTaskArgs = {
  id: Scalars['ID'];
};


export type MutationStartTaskArgs = {
  id: Scalars['ID'];
};

export type Query = {
  __typename?: 'Query';
  actor: Actor;
  actors: ActorPage;
  connector: Connector;
  connectors: ConnectorPage;
  dataTag: DataTag;
  /**  查询所有的数据标签 */
  dataTags: DataTagsPage;
  task: Task;
  tasks: TasksPage;
};


export type QueryActorArgs = {
  id: Scalars['ID'];
};


export type QueryActorsArgs = {
  first: Scalars['Int'];
  skip?: Scalars['Long'];
};


export type QueryConnectorArgs = {
  id: Scalars['ID'];
};


export type QueryConnectorsArgs = {
  first: Scalars['Int'];
  skip?: Scalars['Long'];
};


export type QueryDataTagArgs = {
  id: Scalars['ID'];
};


export type QueryDataTagsArgs = {
  first: Scalars['Int'];
  skip?: Scalars['Long'];
};


export type QueryTaskArgs = {
  id: Scalars['ID'];
};


export type QueryTasksArgs = {
  first: Scalars['Int'];
  skip?: Scalars['Long'];
};

export type Task = {
  __typename?: 'Task';
  actor: Actor;
  actorId: Scalars['ID'];
  configuredCatalog: ConfiguredDataInsightCatalog;
  /**  保存的连接器的状态, 此项比较慢, 仅必要时才应查询此项 */
  connectorState?: Maybe<TaskRunConnectorState>;
  /**  任务计数器, 此项比较慢, 仅必要时才应查询此项 */
  counter?: Maybe<TaskCounter>;
  id: Scalars['ID'];
  inspectorConfig: TaskInspectorConfig;
  state: TaskState;
  supervisorConfig: Scalars['JSON'];
  taskRun: TaskRun;
  taskRuns?: Maybe<TaskRunsPage>;
};


export type TaskTaskRunArgs = {
  id: Scalars['ID'];
};


export type TaskTaskRunsArgs = {
  first: Scalars['Int'];
  skip?: Scalars['Long'];
};

/**  任务计数器 */
export type TaskCounter = {
  __typename?: 'TaskCounter';
  id: Scalars['ID'];
  /**  流属性计数器, 比较慢, 非必要不要取 */
  streamProperties: Array<TaskStreamPropertyCounter>;
  /**  流计数器, 比较慢, 非必要不要取 */
  streams: Array<TaskStreamCounter>;
};

export type TaskCounterItem = {
  __typename?: 'TaskCounterItem';
  name: Scalars['String'];
  value: Scalars['Long'];
};

export type TaskInput = {
  actorId: Scalars['ID'];
  configuredCatalog: ConfiguredDataInsightCatalogInput;
  inspectorConfig: TaskInspectorConfigInput;
  supervisorConfig: Scalars['JSON'];
};

export type TaskInspectorConfig = {
  __typename?: 'TaskInspectorConfig';
  enabledDataTagIds: Array<Scalars['ID']>;
};

export type TaskInspectorConfigInput = {
  enabledDataTagIds: Array<Scalars['ID']>;
};

export type TaskLog = {
  __typename?: 'TaskLog';
  eventDate: Scalars['Timestamp'];
  id: Scalars['ID'];
  level: LogLevel;
  message: Scalars['String'];
  taskId: Scalars['ID'];
  taskRunId: Scalars['ID'];
};

export type TaskLogPage = {
  __typename?: 'TaskLogPage';
  items?: Maybe<Array<TaskLog>>;
  /**  当继续分页查询时, 应当传入的 after 的值 */
  nextAfter: Scalars['ID'];
};

export type TaskRun = {
  __typename?: 'TaskRun';
  errorMessage?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  /**
   *  任务日志, 此项比较慢, 仅必要时才应查询此项
   *  first: 返回满足条件的前N个结果
   *  after: 用于分页查询, 返回指定结果之后的结果
   */
  logs: TaskLogPage;
  state: TaskRunState;
  taskId: Scalars['ID'];
};


export type TaskRunLogsArgs = {
  after?: InputMaybe<Scalars['ID']>;
  first: Scalars['Int'];
};

export type TaskRunConnectorPerStreamState = {
  __typename?: 'TaskRunConnectorPerStreamState';
  state?: Maybe<Scalars['JSON']>;
  stream: Scalars['String'];
};

export type TaskRunConnectorState = {
  __typename?: 'TaskRunConnectorState';
  sharedState?: Maybe<Scalars['JSON']>;
  streamStates: Array<TaskRunConnectorPerStreamState>;
  type: TaskRunConnectorStateType;
};

export enum TaskRunConnectorStateType {
  Global = 'GLOBAL',
  Stream = 'STREAM'
}

export enum TaskRunState {
  Error = 'ERROR',
  Paused = 'PAUSED',
  Ready = 'READY',
  Running = 'RUNNING',
  Success = 'SUCCESS'
}

export type TaskRunsPage = {
  __typename?: 'TaskRunsPage';
  items: Array<TaskRun>;
  total: Scalars['Long'];
};

export enum TaskState {
  DeletePending = 'DELETE_PENDING',
  Init = 'INIT',
  Paused = 'PAUSED',
  Ready = 'READY',
  Running = 'RUNNING'
}

export type TaskStreamCounter = {
  __typename?: 'TaskStreamCounter';
  counters: Array<TaskCounterItem>;
  id: Scalars['ID'];
  stream: Scalars['String'];
};

export type TaskStreamPropertyCounter = {
  __typename?: 'TaskStreamPropertyCounter';
  counters: Array<TaskCounterItem>;
  id: Scalars['ID'];
  property: Scalars['String'];
  stream: Scalars['String'];
};

export type TasksPage = {
  __typename?: 'TasksPage';
  items: Array<Task>;
  total: Scalars['Long'];
};
