import type {ActionPayload} from "app/store/actions";

type ApiCluster = ActionPayload["CLUSTER.STATUS.FETCH.OK"];

// It is more practical to deduce nvpair from one place (so e.g. resource meta
// attributes are skipped).
// 1. The types are the same - typescript infere the type correctly.
// 2. Don't want a formal duty to keep it in sync a new occurrences here.
export type NVPair = NonNullable<
  ApiCluster["node_attr"]
>[keyof ApiCluster["node_attr"]][number];

type AgentAttribute = {
  id: string;
  value: string;
};

export type Issue =
  | {
      severity: "ERROR" | "WARNING";
      message: string;
    }
  | {
      severity: "ERROR" | "WARNING";
      message: string;
      type: "nodes_not_authorized";
      nodeList: string[];
    };

export type StatusSeverity = "OK" | "ERROR" | "WARNING";

type Resource = {
  id: string;
  status: {
    maxSeverity: StatusSeverity;
    infoList: {
      label: string;
      severity: StatusSeverity;
    }[];
  };
  metaAttributes: NVPair[];
  issueList: Issue[];
};

type Primitive = Resource & {
  itemType: "primitive";
  inClone: string | null;
  inGroup: string | null;
  class: string;
  provider: string | null;
  type: string;
  agentName: string;
  instanceAttributes: Record<string, AgentAttribute>;
  utilization: NVPair[];
};

type FenceDevice = {
  id: string;
  itemType: "fence-device";
  status: "RUNNING" | "BLOCKED" | "FAILED" | "DISABLED";
  statusSeverity: StatusSeverity;
  issueList: Issue[];
  agentName: string;
  type: string;
  arguments: Record<string, AgentAttribute>;
};

type Group = Resource & {
  itemType: "group";
  inClone: string | null;
  // unfortunately, fence device can be here and we need to display it somehow
  resources: (Primitive | FenceDevice)[];
};

type Clone = Resource & {
  itemType: "clone";
  // unfortunately, fence device can be here and we need to display it somehow
  member: Primitive | Group | FenceDevice;
  promotable: boolean;
};

type ApiNode = ApiCluster["node_list"][number];

type ApiSbdConfig = Exclude<
  Extract<ApiNode, {sbd_config: unknown}>["sbd_config"],
  null
>;

/*
 status in ApiCLusterStatus is not taken here. There is not real need for it.
*/
export type Cluster = {
  name: string;
  clusterName: string;
  status: "running" | "degraded" | "inoperative" | "offline" | "unknown";
  hasCibInfo: boolean;
  nodeList: ((
    | {
        name: string;
        status: "ONLINE" | "OFFLINE" | "STANDBY";
        statusSeverity: StatusSeverity;
        quorum: boolean;
        quorumSeverity: StatusSeverity;
        issueList: Issue[];
        services: Extract<ApiNode, {services: unknown}>["services"];
        sbd:
          | undefined
          | {
              config: ApiSbdConfig;
              watchdog: string | undefined;
              devices: string[];
            };
      }
    | {
        name: string;
        status: "DATA_NOT_PROVIDED";
        issueList: Issue[];
      }
  ) & {
    // following information are gained from cluster status; we have them even
    // if the node is not reachable
    inMaintenance: boolean;
    inStandby: boolean;
  })[];
  resourceTree: (Primitive | Group | Clone)[];
  fenceDeviceList: FenceDevice[];
  acls: NonNullable<ApiCluster["acls"]>;
  constraints?: NonNullable<ApiCluster["constraints"]>;
  issueList: Issue[];
  summary: {
    nodesSeverity: StatusSeverity;
    resourcesSeverity: StatusSeverity;
    fenceDevicesSeverity: StatusSeverity;
    issuesSeverity: StatusSeverity;
  };
  resourceOnNodeStatusList: {
    resource: {
      id: string;
    };
    node: null | {
      name: string;
    };
    managed: boolean;
    failed: boolean;
    role: string;
    active: boolean;
    orphaned: boolean;
    failureIgnored: boolean;
    nodesRunningOn: number;
    pending: string | null;
    blocked: boolean;
    targetRole?: string;
  }[];
  clusterProperties: Record<string, string>;
  nodeAttr: Record<string, NVPair[]>;
  nodesUtilization: Record<string, NVPair[]>;
};

export type ClusterStatusService = {
  clusterData: Cluster | null;
  load: {
    currently: boolean;
    result: "SUCCESS" | "FORBIDDEN" | "BACKEND_NOT_FOUND" | "NO_DATA_YET";
    when: number;
  };
};
