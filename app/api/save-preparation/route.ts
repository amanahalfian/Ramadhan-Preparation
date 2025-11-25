import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    const requiredFields = [
      "name",
      "dateOfBirth",
      "gender",
      "height",
      "weight",
      "jobType",
      "activityType",
      "weeklyWorkoutDays",
      "sleepDuration",
      "expectations",
    ]

    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 })
      }
    }

    // Validate expectations array is not empty
    if (!Array.isArray(data.expectations) || data.expectations.length === 0) {
      return NextResponse.json({ error: "At least one expectation must be selected" }, { status: 400 })
    }

    // TODO: Replace with your actual database integration
    // Example with Supabase:
    // const { data: savedData, error } = await supabase
    //   .from('ramadhan_preparations')
    //   .insert([{
    //     name: data.name,
    //     date_of_birth: data.dateOfBirth,
    //     gender: data.gender,
    //     height: data.height,
    //     weight: data.weight,
    //     job_type: data.jobType,
    //     activity_type: data.activityType,
    //     weekly_workout_days: data.weeklyWorkoutDays,
    //     sleep_duration: data.sleepDuration,
    //     expectations: data.expectations,
    //     custom_expectation: data.customExpectation || null,
    //     created_at: new Date().toISOString(),
    //   }])

    console.log("[API] Preparation data received:", {
      name: data.name,
      jobType: data.jobType,
      expectations: data.expectations.length,
    })

    return NextResponse.json({
      success: true,
      message: "Preparation data saved successfully",
      data: {
        name: data.name,
        timestamp: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error("[API] Error saving preparation:", error)
    return NextResponse.json({ error: "Failed to save preparation data" }, { status: 500 })
  }
}
