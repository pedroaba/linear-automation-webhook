import { Ticket } from '@auto-pedroaba/@types/ticket'
import { collections } from '@auto-pedroaba/constants/collections'
import { firestore } from '@auto-pedroaba/lib/firebase/server'
import { Timestamp } from 'firebase-admin/firestore'

export async function createIssue(issueRaw: Ticket) {
  const projectId = issueRaw.data.projectId

  const projectColl = firestore.collection(collections.projects)
  const project = await projectColl.doc(projectId).get()

  if (project.exists) {
    await projectColl.doc(projectId).update({
      ...project.data(),
      updatedAt: Timestamp.now().toMillis(),
    })
  } else {
    await projectColl.doc(projectId).set({
      ...issueRaw.data.project,
      createdAt: Timestamp.now().toMillis(),
      updatedAt: Timestamp.now().toMillis(),
      timeSpent: 0,
    })
  }

  const issueColl = projectColl.doc(projectId).collection(collections.issues)
  const issue = await issueColl.doc(issueRaw.data.id).get()

  if (issue.exists) {
    await issueColl.doc(issueRaw.data.id).update({
      ...issue.data(),
      updatedAt: Timestamp.now().toMillis(),
    })
  } else {
    await issueColl.doc(issueRaw.data.id).set({
      headInfo: {
        url: issueRaw.data.url,
        organizationId: issueRaw.organizationId,
        assignee: issueRaw.data.assignee,
        author: issueRaw.actor,
        priority: {
          label: issueRaw.data.priorityLabel,
          id: issueRaw.data.priority,
        },
        project: issueRaw.data.project,
        status: issueRaw.data.state,
        team: issueRaw.data.team,
      },
      times: {
        startedAt: Timestamp.fromDate(
          new Date(issueRaw.data.startedAt),
        ).toMillis(),
      },
      body: {
        description: {
          plain: issueRaw.data.description,
          json: JSON.parse(issueRaw.data.descriptionData),
        },
      },
      linearId: issueRaw.data.id,
      title: issueRaw.data.title,
      createdAt: Timestamp.fromDate(
        new Date(issueRaw.data.createdAt),
      ).toMillis(),
      updatedAt: Timestamp.fromDate(
        new Date(issueRaw.data.updatedAt),
      ).toMillis(),
    })
  }

  const historyColl = issueColl
    .doc(issueRaw.data.id)
    .collection(collections.history)
  await historyColl.add(issueRaw)

  console.log('Ticket updated successfully', issueRaw)
}
