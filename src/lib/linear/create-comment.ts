import { Comment } from '@auto-pedroaba/@types/ticket'
import { collections } from '@auto-pedroaba/constants/collections'
import { Timestamp } from 'firebase-admin/firestore'

import { firestore } from '../firebase/server'

export async function createComment(commentRaw: Comment) {
  const issueId = commentRaw.data.issueId

  const commentColl = firestore.collection(collections.comments)
  const comment = await commentColl.doc(commentRaw.data.id).get()

  const isARootComment = !commentRaw.data.parentId
  const commentAction = commentRaw.data.resolvedAt
    ? 'resolve'
    : commentRaw.action

  if (!isARootComment) {
    const answer = await commentColl
      .doc(commentRaw.data.parentId!)
      .collection(collections.answers)
      .doc(commentRaw.data.id)
      .get()

    if (answer.exists) {
      await commentColl
        .doc(commentRaw.data.parentId!)
        .collection(collections.answers)
        .doc(commentRaw.data.id)
        .update({
          ...answer.data(),
          action: commentAction,
          resolvedAt: commentRaw.data.resolvedAt ?? null,
          body: commentRaw.data.body,
          updatedBy: commentRaw.data.user,
          updatedAt: Timestamp.now().toMillis(),
        })
    } else {
      await commentColl
        .doc(commentRaw.data.parentId!)
        .collection(collections.answers)
        .doc(commentRaw.data.id)
        .set({
          action: commentAction,
          body: commentRaw.data.body,
          linearId: commentRaw.data.id,
          rootComment: isARootComment,
          resolvedAt: commentRaw.data.resolvedAt ?? null,
          updatedBy: commentRaw.data.user,
          url: commentRaw.url,
          issue: commentRaw.data.issue,
          commentId: commentRaw.data.parentId,
          createdAt: Timestamp.now().toMillis(),
          updatedAt: Timestamp.now().toMillis(),
          issueId,
        })
    }
  } else if (comment.exists) {
    await commentColl.doc(commentRaw.data.id).update({
      ...comment.data(),
      action: commentAction,
      body: commentRaw.data.body,
      resolvedAt: commentRaw.data.resolvedAt ?? null,
      updatedBy: commentRaw.data.user,
      updatedAt: Timestamp.now().toMillis(),
    })
  } else {
    const comment = {
      action: commentAction,
      body: commentRaw.data.body,
      rootComment: isARootComment,
      linearId: commentRaw.data.id,
      author: commentRaw.actor,
      updatedBy: commentRaw.data.user,
      resolvedAt: commentRaw.data.resolvedAt ?? null,
      url: commentRaw.url,
      issue: commentRaw.data.issue,
      createdAt: Timestamp.now().toMillis(),
      updatedAt: Timestamp.now().toMillis(),
      issueId,
    }

    await commentColl.doc(commentRaw.data.id).set(comment)
  }

  if (isARootComment) {
    const historyCommentColl = commentColl
      .doc(commentRaw.data.id)
      .collection(collections.history)

    await historyCommentColl.add({
      ...commentRaw,
      createdAt: Timestamp.now().toMillis(),
    })
  } else {
    const historyAnswerColl = commentColl
      .doc(commentRaw.data.parentId!)
      .collection(collections.answers)
      .doc(commentRaw.data.id)
      .collection(collections.history)

    await historyAnswerColl.add({
      ...commentRaw,
      createdAt: Timestamp.now().toMillis(),
    })
  }
}
