import { Delete } from "@mui/icons-material";

export enum RiskCategory {
  Routine = 1,
  Non_Routine,
  Transport,
}
export enum MOCTeamRole {
  ChangeLeader = 1,
  Hseq = 2,
  Others = 3,
  SiteInCharge = 4,
  VPHSE = 5,
  VPDIV = 6,
  COHSE = 7,
  DivTransport,
  TransportHse,
  TaskRepresentative,
  HODTransport,
  OperationsInCharge,
  MaintenanceInCharge,
  HSEInCharge,
  SICHOF,
  ProjectInCharge,
  TransportInCharge,
}

export enum RiskRegisterTeamRole {
  ChangeLeader = 1,
  Hseq = 2,
  Others = 3,
  SiteInCharge = 4,
  VPHSE = 5,
  VPDIV = 6,
  COHSE = 7,
  DivTransport,
  TransportHse,
  TaskRepresentative,
  HODTransport,
  OperationsInCharge,
  MaintenanceInCharge,
  HSEInCharge,
  SICHOF,
  ProjectInCharge,
  TransportInCharge,
}

export const RiskRegisterTeamRoleDisplayNames: {
  [key in RiskRegisterTeamRole]: string;
} = {
  [RiskRegisterTeamRole.ChangeLeader]: "Change Leader",
  [RiskRegisterTeamRole.Hseq]: "HSEQ",
  [RiskRegisterTeamRole.Others]: "Others",
  [RiskRegisterTeamRole.SiteInCharge]: "Site In Charge",
  [RiskRegisterTeamRole.VPHSE]: "VP HSE",
  [RiskRegisterTeamRole.VPDIV]: "VP DIV",
  [RiskRegisterTeamRole.COHSE]: "CO HSE",
  [RiskRegisterTeamRole.DivTransport]: "Div Transport",
  [RiskRegisterTeamRole.TransportHse]: "Transport Hse In Charge",
  [RiskRegisterTeamRole.TaskRepresentative]: "Task Representative",
  [RiskRegisterTeamRole.HODTransport]: "HOD/HO Transport HS",
  [RiskRegisterTeamRole.OperationsInCharge]: "Operations In Charge",
  [RiskRegisterTeamRole.MaintenanceInCharge]: "Maintenance In Charge",
  [RiskRegisterTeamRole.HSEInCharge]: "HSE In Charge",
  [RiskRegisterTeamRole.SICHOF]: "SIC/HOF",
  [RiskRegisterTeamRole.ProjectInCharge]: "Project In Charge",
  [RiskRegisterTeamRole.TransportInCharge]: "Transport In Charge",
};

export const RiskCategoryToTeamRoleMapping: {
  [key in RiskCategory]: RiskRegisterTeamRole[];
} = {
  [RiskCategory.Transport]: [
    RiskRegisterTeamRole.DivTransport,
    RiskRegisterTeamRole.TransportHse,
    RiskRegisterTeamRole.TaskRepresentative,
    RiskRegisterTeamRole.HODTransport,
  ],
  [RiskCategory.Routine]: [
    RiskRegisterTeamRole.HSEInCharge,
    RiskRegisterTeamRole.TaskRepresentative,
    RiskRegisterTeamRole.MaintenanceInCharge,
    RiskRegisterTeamRole.SICHOF,
  ],
  [RiskCategory.Non_Routine]: [
    RiskRegisterTeamRole.HSEInCharge,
    RiskRegisterTeamRole.MaintenanceInCharge,
    RiskRegisterTeamRole.TransportInCharge,
    RiskRegisterTeamRole.ProjectInCharge,
  ],
};

export enum RiskActionType {
  None = 0,
  Done = 1,
  Approve = 2,
  Reject = 3,
  SendBack = 4,
  Notify = 5,
}

export enum TaskPopupType {
  Approve = 1,
  Delete,
  Audit,
  SubmitforApproval,
}

export enum RiskRegisterStatus {
  Draft = 0,
  SICApproval,
  Evaluation,
  Approved,
  SICRejected,
}

export enum HIRAStatus {
  Initiation = "Initiation",
  SICApproval = "Site in Charge Approval",
  Evaluation = "Evaluation",
}

export enum SessionStatus {
  Created = 1,
  Started = 2,
  Ended = 3,
  Canceled = 4,
}
export const SessionStatusDisplayNames: {
  [key in SessionStatus]: string;
} = {
  [SessionStatus.Created]: "Awaiting Acceptance",
  [SessionStatus.Started]: "Session Running",
  [SessionStatus.Canceled]: "Cancelled",
  [SessionStatus.Ended]: "Ended",
};

export enum SessionRequestStatus {
  Pending = 1,
  Approved,
  Rejected,
}

export enum ControlMeasuresType {
  Human = 1,
  Technical,
  Organizational,
}

export enum TaskStatusEnum {
  Draft = 0,
  PendingApproval,
  Approved,
  RejectedPendingApproval,
  RejectedPendingReview,
}

export const TaskStatusDisplayNames: {
  [key in TaskStatusEnum]: string;
} = {
  [TaskStatusEnum.Draft]: "Draft",
  [TaskStatusEnum.PendingApproval]: "Pending Approval",
  [TaskStatusEnum.Approved]: "Approved",
  [TaskStatusEnum.RejectedPendingApproval]: "Pending Approval",
  [TaskStatusEnum.RejectedPendingReview]: "Review",
};

export enum RiskClassification {
  HighRisk = 1,
  SignificantRisk,
  AverageRisk,
  LowRisk,
  VeryLowRisk,
}
