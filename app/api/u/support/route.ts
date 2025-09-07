import dbConnect from '@/lib/dbConnect'
import { NextResponse } from 'next/server'
import  SupportRequest from "../../../../models/ContactSchme";

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, subject, category, message } = body

    if (!email || !subject || !category || !message) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    await dbConnect()
    await SupportRequest.create({ email, subject, category, message })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[SUPPORT_API_ERROR]', error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
