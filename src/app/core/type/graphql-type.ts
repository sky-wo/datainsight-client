import { gql } from 'apollo-angular';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
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
  JSON: any;
  /** A 64-bit signed integer */
  Long: number;
  /** 事件戳, 从1970-1-1起的毫秒数 */
  Timestamp: any;
};

/**  连接器实例 */
export type Actor = {
  readonly __typename?: 'Actor';
  readonly connector: Maybe<Connector>;
  readonly connectorConfig: Scalars['JSON'];
  readonly connectorId: Scalars['ID'];
  readonly id: Scalars['ID'];
  readonly name: Scalars['String'];
};

export type ActorInput = {
  readonly connectorConfig: Scalars['JSON'];
  readonly connectorId: Scalars['ID'];
  readonly name: Scalars['String'];
};

export type ActorPage = {
  readonly __typename?: 'ActorPage';
  readonly items: ReadonlyArray<Actor>;
  readonly total: Scalars['Long'];
};

export type ConfiguredDataInsightCatalog = {
  readonly __typename?: 'ConfiguredDataInsightCatalog';
  readonly streams: ReadonlyArray<ConfiguredDataInsightStream>;
};

export type ConfiguredDataInsightCatalogInput = {
  readonly streams: ReadonlyArray<ConfiguredDataInsightStreamInput>;
};

export type ConfiguredDataInsightStream = {
  readonly __typename?: 'ConfiguredDataInsightStream';
  readonly cursorField: Maybe<ReadonlyArray<Scalars['String']>>;
  readonly destinationSyncMode: DataInsightDestinationSyncMode;
  readonly primaryKey: Maybe<ReadonlyArray<Scalars['String']>>;
  readonly stream: DataInsightStream;
  readonly syncMode: DataInsightSyncMode;
};

export type ConfiguredDataInsightStreamInput = {
  readonly cursorField: InputMaybe<ReadonlyArray<Scalars['String']>>;
  readonly destinationSyncMode: DataInsightDestinationSyncMode;
  readonly primaryKey: InputMaybe<ReadonlyArray<Scalars['String']>>;
  readonly stream: DataInsightStreamInput;
  readonly syncMode: DataInsightSyncMode;
};

/**  连接器定义 */
export type Connector = {
  readonly __typename?: 'Connector';
  readonly id: Scalars['ID'];
  readonly image: Scalars['String'];
  readonly name: Scalars['String'];
  readonly specification: ConnectorSpecification;
  readonly version: Scalars['String'];
};

export type ConnectorInput = {
  readonly image: Scalars['String'];
  readonly name: Scalars['String'];
  readonly version: Scalars['String'];
};

export type ConnectorPage = {
  readonly __typename?: 'ConnectorPage';
  readonly items: ReadonlyArray<Connector>;
  readonly total: Scalars['Long'];
};

export type ConnectorSpecification = {
  readonly __typename?: 'ConnectorSpecification';
  readonly changelogUrl: Maybe<Scalars['String']>;
  readonly connectionSpecification: Scalars['JSON'];
  readonly documentationUrl: Maybe<Scalars['String']>;
};

export type DataInsightDestinationSyncMode =
  | 'APPEND'
  | 'OVERWRITE';

export type DataInsightStream = {
  readonly __typename?: 'DataInsightStream';
  readonly defaultCursorField: Maybe<ReadonlyArray<Scalars['String']>>;
  readonly jsonSchema: Scalars['JSON'];
  readonly name: Scalars['String'];
  readonly namespace: Maybe<Scalars['String']>;
  readonly sourceDefinedCursor: Maybe<Scalars['Boolean']>;
  readonly sourceDefinedPrimaryKey: Maybe<ReadonlyArray<Scalars['String']>>;
  readonly supportedSyncModes: Maybe<ReadonlyArray<DataInsightSyncMode>>;
};

export type DataInsightStreamInput = {
  readonly defaultCursorField: InputMaybe<ReadonlyArray<Scalars['String']>>;
  readonly jsonSchema: Scalars['JSON'];
  readonly name: Scalars['String'];
  readonly namespace: InputMaybe<Scalars['String']>;
  readonly sourceDefinedCursor: InputMaybe<Scalars['Boolean']>;
  readonly sourceDefinedPrimaryKey: InputMaybe<ReadonlyArray<Scalars['String']>>;
  readonly supportedSyncModes: InputMaybe<ReadonlyArray<DataInsightSyncMode>>;
};

export type DataInsightSyncMode =
  | 'FULL_REFRESH'
  | 'INCREMENTAL';

export type DataRule = {
  readonly __typename?: 'DataRule';
  readonly content: Scalars['JSON'];
  readonly dataTagId: Scalars['ID'];
  readonly id: Scalars['ID'];
};

export type DataRuleInput = {
  readonly content: Scalars['JSON'];
};

export type DataRulesPage = {
  readonly __typename?: 'DataRulesPage';
  readonly items: ReadonlyArray<DataRule>;
  readonly total: Scalars['Long'];
};

export type DataTag = {
  readonly __typename?: 'DataTag';
  readonly alert: Scalars['Boolean'];
  readonly id: Scalars['ID'];
  readonly level: Scalars['Int'];
  readonly name: Scalars['String'];
  readonly parentId: Maybe<Scalars['ID']>;
  readonly rule: DataRule;
  readonly rules: DataRulesPage;
};


export type DataTagRuleArgs = {
  id: Scalars['ID'];
};


export type DataTagRulesArgs = {
  first: Scalars['Int'];
  skip?: Scalars['Long'];
};

export type DataTagInput = {
  readonly alert: Scalars['Boolean'];
  readonly level: Scalars['Int'];
  readonly name: Scalars['String'];
};

export type DataTagsPage = {
  readonly __typename?: 'DataTagsPage';
  readonly items: ReadonlyArray<DataTag>;
  readonly total: Scalars['Long'];
};

export type LogLevel =
  | 'DEBUG'
  | 'ERROR'
  | 'INFO'
  | 'TRACE'
  | 'WARN';

export type Mutation = {
  readonly __typename?: 'Mutation';
  readonly addActor: Scalars['ID'];
  readonly addConnector: Scalars['ID'];
  readonly addDataRule: Scalars['ID'];
  readonly addDataTag: Scalars['ID'];
  readonly addTask: Scalars['ID'];
  readonly cancelTask: Scalars['Int'];
  readonly moveDataRule: Scalars['Int'];
  readonly moveDataTag: Maybe<Scalars['Int']>;
  readonly removeActor: Scalars['Int'];
  readonly removeConnector: Scalars['Int'];
  readonly removeTask: Scalars['Int'];
  readonly startTask: Scalars['Int'];
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
  parentId: InputMaybe<Scalars['ID']>;
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
  newParentId: InputMaybe<Scalars['ID']>;
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
  readonly __typename?: 'Query';
  readonly actor: Actor;
  readonly actors: ActorPage;
  readonly connector: Connector;
  readonly connectors: ConnectorPage;
  readonly dataTag: DataTag;
  /**  查询所有的数据标签 */
  readonly dataTags: DataTagsPage;
  readonly task: Task;
  readonly tasks: TasksPage;
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
  readonly __typename?: 'Task';
  readonly actor: Actor;
  readonly actorId: Scalars['ID'];
  readonly configuredCatalog: ConfiguredDataInsightCatalog;
  readonly id: Scalars['ID'];
  readonly inspectorConfig: TaskInspectorConfig;
  readonly state: TaskState;
  readonly supervisorConfig: Scalars['JSON'];
  readonly taskRun: TaskRun;
  readonly taskRuns: Maybe<TaskRunsPage>;
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
  readonly __typename?: 'TaskCounter';
  /**  全局计数器 */
  readonly items: ReadonlyArray<TaskCounterItem>;
  /**  流计数器 */
  readonly streamItems: ReadonlyArray<TaskStreamCounterItem>;
  /**  流属性计数器 */
  readonly streamPropertyItems: ReadonlyArray<TaskStreamPropertyCounterItem>;
};

export type TaskCounterItem = {
  readonly __typename?: 'TaskCounterItem';
  readonly name: Scalars['String'];
  readonly value: Scalars['Long'];
};

export type TaskInput = {
  readonly actorId: Scalars['ID'];
  readonly configuredCatalog: ConfiguredDataInsightCatalogInput;
  readonly inspectorConfig: TaskInspectorConfigInput;
  readonly supervisorConfig: Scalars['JSON'];
};

export type TaskInspectorConfig = {
  readonly __typename?: 'TaskInspectorConfig';
  readonly enabledDataTagIds: ReadonlyArray<Scalars['ID']>;
};

export type TaskInspectorConfigInput = {
  readonly enabledDataTagIds: ReadonlyArray<Scalars['ID']>;
};

export type TaskLog = {
  readonly __typename?: 'TaskLog';
  readonly eventDate: Scalars['Timestamp'];
  readonly id: Scalars['ID'];
  readonly level: LogLevel;
  readonly message: Scalars['String'];
  readonly taskId: Scalars['ID'];
  readonly taskRunId: Scalars['ID'];
};

export type TaskLogPage = {
  readonly __typename?: 'TaskLogPage';
  readonly items: Maybe<ReadonlyArray<TaskLog>>;
  /**  当继续分页查询时, 应当传入的 after 的值 */
  readonly nextAfter: Scalars['ID'];
};

export type TaskRun = {
  readonly __typename?: 'TaskRun';
  /**  保存的连接器的状态, 此项比较慢, 仅必要时才应查询此项 */
  readonly connectorState: Maybe<TaskRunConnectorState>;
  /**  任务计数器, 此项比较慢, 仅必要时才应查询此项 */
  readonly counter: Maybe<TaskCounter>;
  readonly errorMessage: Maybe<Scalars['String']>;
  readonly id: Scalars['ID'];
  /**
   *  任务日志, 此项比较慢, 仅必要时才应查询此项
   *  first: 返回满足条件的前N个结果
   *  after: 用于分页查询, 返回指定结果之后的结果
   */
  readonly logs: TaskLogPage;
  readonly state: TaskRunState;
  readonly taskId: Scalars['ID'];
};


export type TaskRunLogsArgs = {
  after: InputMaybe<Scalars['ID']>;
  first: Scalars['Int'];
};

export type TaskRunConnectorPerStreamState = {
  readonly __typename?: 'TaskRunConnectorPerStreamState';
  readonly state: Maybe<Scalars['JSON']>;
  readonly stream: Scalars['String'];
};

export type TaskRunConnectorState = {
  readonly __typename?: 'TaskRunConnectorState';
  readonly sharedState: Maybe<Scalars['JSON']>;
  readonly streamStates: Maybe<ReadonlyArray<TaskRunConnectorPerStreamState>>;
};

export type TaskRunState =
  | 'ERROR'
  | 'PAUSED'
  | 'READY'
  | 'RUNNING'
  | 'SUCCESS';

export type TaskRunsPage = {
  readonly __typename?: 'TaskRunsPage';
  readonly items: ReadonlyArray<TaskRun>;
  readonly total: Scalars['Long'];
};

export type TaskState =
  | 'DELETE_PENDING'
  | 'INIT'
  | 'PAUSED'
  | 'READY'
  | 'RUNNING';

export type TaskStreamCounterItem = {
  readonly __typename?: 'TaskStreamCounterItem';
  readonly name: Scalars['String'];
  readonly stream: Scalars['String'];
  readonly value: Scalars['Long'];
};

export type TaskStreamPropertyCounterItem = {
  readonly __typename?: 'TaskStreamPropertyCounterItem';
  readonly name: Scalars['String'];
  readonly property: Scalars['String'];
  readonly stream: Scalars['String'];
  readonly value: Scalars['Long'];
};

export type TasksPage = {
  readonly __typename?: 'TasksPage';
  readonly items: ReadonlyArray<Task>;
  readonly total: Scalars['Long'];
};

export type Actor_MutationVariables = Exact<{
  actorInput: ActorInput;
}>;


export type Actor_Mutation = { readonly __typename?: 'Mutation', readonly addActor: string };

export type AddConnector_MutationVariables = Exact<{
  connectorInput: ConnectorInput;
}>;


export type AddConnector_Mutation = { readonly __typename?: 'Mutation', readonly addConnector: string };

export type Connector_QueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type Connector_Query = { readonly __typename?: 'Query', readonly connector: { readonly __typename?: 'Connector', readonly name: string, readonly specification: { readonly __typename?: 'ConnectorSpecification', readonly documentationUrl: string | null, readonly changelogUrl: string | null, readonly connectionSpecification: any } } };

export type Connectors_QueryVariables = Exact<{
  first: Scalars['Int'];
  skip: Scalars['Long'];
}>;


export type Connectors_Query = { readonly __typename?: 'Query', readonly connectors: { readonly __typename?: 'ConnectorPage', readonly total: number, readonly items: ReadonlyArray<{ readonly __typename?: 'Connector', readonly name: string, readonly image: string, readonly version: string }> } };

export const ADDACROR = gql`
    mutation ($actorInput: ActorInput!) {
  addActor(actorInput: $actorInput)
}
    `;

@Injectable({
  providedIn: 'root'
})
export class MutationAddActor extends Apollo.Mutation<Actor_Mutation, Actor_MutationVariables> {
  override document = ADDACROR;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const ADDCONNECTOR = gql`
    mutation ($connectorInput: ConnectorInput!) {
  addConnector(connectorInput: $connectorInput)
}
    `;

@Injectable({
  providedIn: 'root'
})
export class MutationAddConnector extends Apollo.Mutation<AddConnector_Mutation, AddConnector_MutationVariables> {
  override document = ADDCONNECTOR;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const CONNECTOR = gql`
    query ($id: ID!) {
  connector(id: $id) {
    name
    specification {
      documentationUrl
      changelogUrl
      connectionSpecification
    }
  }
}
    `;

@Injectable({
  providedIn: 'root'
})
export class QueryConnector extends Apollo.Query<Connector_Query, Connector_QueryVariables> {
  override document = CONNECTOR;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const CONNECTORS = gql`
    query ($first: Int!, $skip: Long!) {
      connectors(first: $first, skip: $skip) {
    total
    items {
      id
      name
      image
      version
    }
  }
}
    `;

@Injectable({
  providedIn: 'root'
})
export class QueryConnectors extends Apollo.Query<Connectors_Query, Connectors_QueryVariables> {
  override document = CONNECTORS;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}