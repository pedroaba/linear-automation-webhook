export interface UpdatedFrom {
  updatedAt: string
  sortOrder: number
  prioritySortOrder: number
  stateId: string
  completedAt: string
}

export interface Team {
  id: string
  key: string
  name: string
}

export interface State {
  id: string
  color: string
  name: string
  type: string
}

export interface Project {
  id: string
  name: string
  url: string
}

export interface Assignee {
  id: string
  name: string
  email: string
  avatarUrl: string
}

export interface Data {
  id: string
  createdAt: string
  updatedAt: string
  number: number
  title: string
  priority: number
  boardOrder: number
  sortOrder: number
  prioritySortOrder: number
  startedAt: string
  slaType: string
  addedToProjectAt: string
  addedToTeamAt: string
  labelIds: any[]
  teamId: string
  projectId: string
  previousIdentifiers: any[]
  creatorId: string
  assigneeId: string
  stateId: string
  reactionData: any[]
  priorityLabel: string
  botActor: any
  identifier: string
  url: string
  subscriberIds: string[]
  assignee: Assignee
  project: Project
  state: State
  team: Team
  labels: any[]
  description: string
  descriptionData: string
}

export interface Actor {
  id: string
  name: string
  email: string
  avatarUrl: string
  type: string
}

export interface Ticket {
  action: string
  actor: Actor
  createdAt: string
  data: Data
  updatedFrom: UpdatedFrom
  url: string
  type: string
  organizationId: string
  webhookTimestamp: number
  webhookId: string
}

export type User = Assignee

export type Comment = {
  action: string
  actor: Actor
  createdAt: string
  data: {
    id: string
    issue: {
      id: string
      title: string
    }
    resolvedAt?: string
    issueId: string
    parentId?: string
    body: string
    user: User
    userId: string
    updatedAt: string
    bodyData: string
    authorId: string
  }
  url: string
  type: string
  organizationId: string
  webhookTimestamp: number
  webhookId: string
}
