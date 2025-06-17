import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "../../../lib/mongodb"
import { JobApplication } from "../../../lib/types"


export async function GET(request: NextRequest) {
  try {
    const client = await clientPromise
    const db = client.db("jobtracker")

    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get("userId") || "demo-user"
    const status = searchParams.get("status")
    const search = searchParams.get("search")

    const query: Record<string, unknown> = { userId }

    if (status && status !== "all") {
      query.status = status
    }

    if (search) {
      query.$or = [
        { companyName: { $regex: search, $options: "i" } },
        { jobTitle: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
      ]
    }

    const jobs = await db.collection("jobs").find(query).sort({ createdAt: -1 }).toArray()

    return NextResponse.json(jobs)
  } catch (err) {
    console.error("Failed to fetch jobs:", err)
    return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const client = await clientPromise
    const db = client.db("jobtracker")

    const body = await request.json()
    const jobData: Omit<JobApplication, "_id"> = {
      ...body,
      userId: body.userId || "demo-user",
      applicationDate: new Date(body.applicationDate),
      deadline: body.deadline ? new Date(body.deadline) : undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection("jobs").insertOne(jobData)

    return NextResponse.json({
      success: true,
      id: result.insertedId,
    })
  } catch (err) {
    console.error("Failed to create job:", err)
    return NextResponse.json({ error: "Failed to create job" }, { status: 500 })
  }
}