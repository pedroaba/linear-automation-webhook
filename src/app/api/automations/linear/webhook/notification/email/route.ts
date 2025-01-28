import { firestore } from '@auto-pedroaba/lib/firebase/server'
import { createIssue } from '@auto-pedroaba/lib/linear/create-issue'
import { Timestamp } from 'firebase-admin/firestore'
import { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  const requestPayload = await request.json()
  const messageType = requestPayload.data.type

  try {
    switch (messageType) {
      case 'issue':
        await createIssue(requestPayload)
        break
      default:
        await firestore.collection('errors').add({
          error: 'Unknown message type',
          data: requestPayload,
          createdAt: Timestamp.now().toMillis(),
        })
    }
  } catch (error: any) {
    await firestore.collection('errors').add({
      error: error.message ? error.message : String(error),
      data: requestPayload,
      createdAt: Timestamp.now().toMillis(),
    })
  }

  return new Response(null, { status: 200 })
}
