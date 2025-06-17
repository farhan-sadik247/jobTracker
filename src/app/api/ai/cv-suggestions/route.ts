import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(request: NextRequest) {
  try {
    const { jobDescription, currentCV } = await request.json()

    const prompt = `
    Analyze this job description and provide CV optimization suggestions:
    
    Job Description:
    ${jobDescription}
    
    Current CV/Resume content (if provided):
    ${currentCV || "No current CV provided"}
    
    Please provide:
    1. Key skills that should be highlighted
    2. Important keywords to include
    3. Specific improvements or additions
    4. A match score (0-100) based on current alignment
    
    Format your response as JSON with the following structure:
    {
      "skills": ["skill1", "skill2", ...],
      "keywords": ["keyword1", "keyword2", ...],
      "improvements": ["improvement1", "improvement2", ...],
      "matchScore": 85
    }
    `

    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt,
      system: "You are a professional career advisor and CV optimization expert. Provide practical, actionable advice.",
    })

    // Try to parse the JSON response
    let suggestions
    try {
      suggestions = JSON.parse(text)
    } catch {
      // Fallback if AI doesn't return valid JSON
      suggestions = {
        skills: ["Communication", "Problem Solving", "Teamwork"],
        keywords: ["Experience", "Leadership", "Innovation"],
        improvements: ["Add more specific achievements", "Include relevant metrics"],
        matchScore: 70,
      }
    }

    return NextResponse.json(suggestions)
  } catch (error) {
    console.error("AI suggestion error:", error)
    return NextResponse.json(
      {
        error: "Failed to generate suggestions",
        fallback: {
          skills: ["Communication", "Problem Solving"],
          keywords: ["Experience", "Leadership"],
          improvements: ["Add specific achievements"],
          matchScore: 60,
        },
      },
      { status: 500 },
    )
  }
}
