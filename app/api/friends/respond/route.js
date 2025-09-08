import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const body = await request.json()
    
    if (!body.request_id || !body.action) {
      return NextResponse.json(
        { error: 'Request ID and action are required' },
        { status: 400 }
      )
    }

    if (!['accept', 'reject'].includes(body.action)) {
      return NextResponse.json(
        { error: 'Action must be either accept or reject' },
        { status: 400 }
      )
    }

    // Mock response for friend request handling
    return NextResponse.json({
      success: true,
      action: body.action,
      request_id: body.request_id
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to respond to friend request' },
      { status: 500 }
    )
  }
}