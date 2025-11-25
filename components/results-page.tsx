"use client"

import { useMemo } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CountdownTimer } from "@/components/countdown-timer"
import { ShareSection } from "@/components/share-section"

interface ResultsPageProps {
  data: any
  onStartNew: () => void
}

export function ResultsPage({ data, onStartNew }: ResultsPageProps) {
  const plan = useMemo(() => {
    return generatePreparationPlan(data)
  }, [data])

  const getUrgencyColor = (daysRemaining: number) => {
    if (daysRemaining > 90) return "bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800"
    if (daysRemaining > 60) return "bg-yellow-50 border-yellow-200 dark:bg-yellow-950 dark:border-yellow-800"
    if (daysRemaining > 30) return "bg-orange-50 border-orange-200 dark:bg-orange-950 dark:border-orange-800"
    return "bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800"
  }

  const getUrgencyBadgeColor = (daysRemaining: number) => {
    if (daysRemaining > 90) return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
    if (daysRemaining > 60) return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
    if (daysRemaining > 30) return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100"
    return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
  }

  const getUrgencyMessage = (daysRemaining: number) => {
    const ramadhanDate = new Date(2026, 1, 19) // February 19, 2026
    const criticalStartDate = new Date(ramadhanDate)
    criticalStartDate.setDate(criticalStartDate.getDate() - 90) // 90 days before Ramadhan

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Format the critical date as dd-mm-yyyy
    const formatDate = (date: Date) => {
      const day = String(date.getDate()).padStart(2, "0")
      const month = String(date.getMonth() + 1).padStart(2, "0")
      const year = date.getFullYear()
      return `${day}-${month}-${year}`
    }

    const criticalDateStr = formatDate(criticalStartDate)
    const daysUntilCritical = Math.floor((criticalStartDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

    if (daysUntilCritical > 30) {
      return `Start by ${criticalDateStr} to achieve all goals (${daysUntilCritical} days remaining)`
    } else if (daysUntilCritical > 0) {
      return `URGENT: Start by ${criticalDateStr} (only ${daysUntilCritical} days left)`
    } else if (daysUntilCritical >= -30) {
      return `CRITICAL: You should have started on ${criticalDateStr} - begin immediately`
    } else {
      return `VERY LATE: Ideal preparation window passed - do what you can now`
    }
  }

  const getUrgencyLabel = (daysRemaining: number) => {
    if (daysRemaining > 90) return "Low"
    if (daysRemaining > 60) return "Medium"
    if (daysRemaining > 30) return "High"
    return "Critical"
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-secondary/5 py-8 px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} transition={{ delay: 0.1 }}>
            <CountdownTimer />
          </motion.div>

          <h1 className="text-4xl md:text-5xl font-bold text-balance mt-8 mb-2">
            Assalamu'alaikum, <span className="text-primary">{data.name}</span>!
          </h1>
          <p className="text-xl text-muted-foreground mb-8">Your Personalized Ramadhan 2026 Preparation Plan</p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`inline-block px-6 py-4 rounded-lg border mb-8 ${getUrgencyColor(plan.daysUntilRamadhan)}`}
          >
            <div className="space-y-2">
              <p className="text-sm">
                <span className="font-semibold">Critical Deadline:</span> {getUrgencyMessage(plan.daysUntilRamadhan)}
              </p>
              <div
                className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getUrgencyBadgeColor(plan.daysUntilRamadhan)} w-fit`}
              >
                {getUrgencyLabel(plan.daysUntilRamadhan)} URGENCY
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
        >
          {plan.categories.map((category: any, index: number) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
            >
              <Card className="h-full flex flex-col overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="text-4xl mb-3">{category.icon}</div>
                  <CardTitle className="text-xl">{category.title}</CardTitle>
                  {category.currentStatus && (
                    <p className="text-sm text-muted-foreground mt-2">{category.currentStatus}</p>
                  )}
                  {category.urgency && (
                    <div
                      className={`inline-block mt-2 px-2 py-1 rounded text-xs font-semibold ${getUrgencyBadgeColor(plan.daysUntilRamadhan)} w-fit`}
                    >
                      {category.urgency}
                    </div>
                  )}
                </CardHeader>
                <CardContent className="flex-1 space-y-4 text-sm">
                  {/* Card content sections */}
                  {category.sections.map((section: any, sIdx: number) => (
                    <div key={sIdx} className="space-y-2">
                      {section.title && (
                        <p className="font-semibold text-primary text-xs uppercase tracking-wide">{section.title}</p>
                      )}
                      {Array.isArray(section.content) ? (
                        <ul className="space-y-1 text-xs">
                          {section.content.map((item: string, i: number) => (
                            <li key={i} className="flex gap-2">
                              <span className="text-primary flex-shrink-0">✓</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-muted-foreground">{section.content}</p>
                      )}
                    </div>
                  ))}

                  {/* Warnings if applicable */}
                  {category.warnings && category.warnings.length > 0 && (
                    <div className="pt-2 border-t space-y-2">
                      <p className="font-semibold text-xs text-orange-600 dark:text-orange-400 uppercase">⚠️ Warnings</p>
                      {category.warnings.map((warning: string, i: number) => (
                        <p key={i} className="text-xs text-orange-700 dark:text-orange-300">
                          {warning}
                        </p>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Share Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mb-12"
        >
          <ShareSection userName={data.name} plan={plan} data={data} />
        </motion.div>

        {/* Start New Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center"
        >
          <Button onClick={onStartNew} variant="outline" size="lg" className="px-8 bg-transparent">
            Start New Plan
          </Button>
        </motion.div>
      </motion.div>
    </div>
  )
}

function generatePreparationPlan(data: any) {
  const daysUntilRamadhan = calculateDaysUntilRamadhan()
  const age = calculateAge(data.dateOfBirth)

  // BMI Calculation
  const heightInMeters = data.height / 100
  const bmi = data.weight / (heightInMeters * heightInMeters)
  const bmiCategory = getBMICategory(bmi)

  // Activity Score Calculation (0-5 scale)
  const activityScore = calculateActivityScore(data)

  // BMR and TDEE Calculation
  const bmr = calculateBMR(data.gender, data.weight, data.height, age)
  const activityMultiplier = getActivityMultiplier(activityScore)
  const tdee = bmr * activityMultiplier
  const currentDailyCalories = Math.round(tdee)
  const ramadhanTargetCalories = Math.round(tdee * 0.93)

  // Macro calculations
  const carbs = Math.round((ramadhanTargetCalories * 0.5) / 4)
  const protein = Math.round((ramadhanTargetCalories * 0.25) / 4)
  const fat = Math.round((ramadhanTargetCalories * 0.25) / 9)

  // Hydration Calculation
  const baseWater = data.weight * 35 // ml
  const activityBonus = activityScore >= 3 ? 500 : 0
  const genderBonus = data.gender === "male" ? 200 : 0
  const dailyWaterMl = baseWater + activityBonus + genderBonus
  const dailyWaterLiters = dailyWaterMl / 1000

  // Latest Start Dates
  const now = new Date()

  // Exercise should start 60 days before Ramadhan
  const exerciseStartDate = new Date(now)
  exerciseStartDate.setDate(exerciseStartDate.getDate() + Math.max(0, daysUntilRamadhan - 60))

  // Sleep adjustment should start 45 days before
  const sleepStartDate = new Date(now)
  sleepStartDate.setDate(sleepStartDate.getDate() + Math.max(0, daysUntilRamadhan - 45))

  // Fasting practice should start 90 days before
  const fastingStartDate = new Date(now)
  fastingStartDate.setDate(fastingStartDate.getDate() + Math.max(0, daysUntilRamadhan - 90))

  // Nutrition should start 45 days before
  const nutritionStartDate = new Date(now)
  nutritionStartDate.setDate(nutritionStartDate.getDate() + Math.max(0, daysUntilRamadhan - 45))

  // Hydration should start 30 days before
  const hydrationStartDate = new Date(now)
  hydrationStartDate.setDate(hydrationStartDate.getDate() + Math.max(0, daysUntilRamadhan - 30))

  // Spiritual preparation can start anytime, but critical if close to Ramadhan
  const spiritualStartDate = new Date(now)
  spiritualStartDate.setDate(spiritualStartDate.getDate() + Math.max(0, daysUntilRamadhan - 45))

  // Format date as dd-mm-yyyy
  const formatDateDDMMYYYY = (date: Date) => {
    const day = String(date.getDate()).padStart(2, "0")
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const year = date.getFullYear()
    return `${day}-${month}-${year}`
  }

  // Sleep target
  const sleepTarget = getSleepTarget(data.sleepDuration)

  // Exercise plan logic
  const exercisePlan = getExercisePlan(activityScore, data.expectations, daysUntilRamadhan)

  // Fasting schedule
  const fastingSchedule = getFastingSchedule(daysUntilRamadhan)

  // Expectation mapping
  const expectationLabels: Record<string, string> = {
    "full-fasting": "Full-day fasting",
    taraweh: "Full Taraweh",
    "qiyamul-lail": "Qiyamul Lail",
    "complete-quran": "Complete Quran",
    umrah: "Umrah",
    itikaf: "I'tikaf",
    charity: "Charity/Zakat",
    "work-productivity": "Maintain work productivity",
  }

  const categories = [
    {
      id: "exercise",
      icon: "💪",
      title: "Exercise Plan",
      currentStatus: `You are: ${getActivityLevel(activityScore)}`,
      urgency: getUrgencyLabel(daysUntilRamadhan),
      sections: [
        {
          title: "Your Goals",
          content: data.expectations.map((exp: string) => expectationLabels[exp] || exp).filter((x: string) => x),
        },
        {
          title: "Critical Start Date",
          content: `${formatDateDDMMYYYY(exerciseStartDate)} (60 days before Ramadhan)${daysUntilRamadhan < 60 ? " - DEADLINE APPROACHING" : ""}`,
        },
        exercisePlan.weekPlan,
        {
          title: "Why This Matters",
          content: exercisePlan.whyMatters,
        },
        {
          title: "Success Indicators",
          content: exercisePlan.indicators,
        },
      ],
    },
    {
      id: "sleep",
      icon: "😴",
      title: "Sleep Pattern Adjustment",
      currentStatus: `You sleep: ${data.sleepDuration === "less-6" ? "less than 6" : data.sleepDuration === "6-7" ? "6-7" : data.sleepDuration === "8" ? "8" : "more than 8"} hours`,
      urgency: getUrgencyLabel(daysUntilRamadhan),
      sections: [
        {
          title: "Target Hours",
          content: `${sleepTarget} hours nightly`,
        },
        {
          title: "Critical Start Date",
          content: formatDateDDMMYYYY(sleepStartDate),
        },
        {
          title: "Week 1-2: Establish Routine",
          content: ["Set consistent bedtime", "Track sleep quality", "Adjust room environment"],
        },
        {
          title: "Week 3-6: Stabilize",
          content: ["Maintain new schedule", "Optimize sleep environment", "Prepare for Ramadhan shifts"],
        },
        {
          title: "Why This Matters",
          content:
            "Proper sleep is crucial for Qiyam and maintaining focus. Adjusting early helps your body adapt naturally.",
        },
      ],
      warnings: daysUntilRamadhan < 30 ? ["Limited time - prioritize sleep adjustment immediately"] : [],
    },
    {
      id: "nutrition",
      icon: "🥗",
      title: "Nutrition Intake",
      currentStatus: `Your BMI: ${bmi.toFixed(1)} - ${bmiCategory}`,
      sections: [
        {
          title: "Current Daily Calories",
          content: `${currentDailyCalories} kcal`,
        },
        {
          title: "Ramadhan Target",
          content: `${ramadhanTargetCalories} kcal`,
        },
        {
          title: "Macro Split",
          content: [
            `Carbs: ${Math.round((carbs / (carbs + protein + fat)) * 100)}% (${carbs}g)`,
            `Protein: ${Math.round((protein / (carbs + protein + fat)) * 100)}% (${protein}g)`,
            `Fats: ${Math.round((fat / (carbs + protein + fat)) * 100)}% (${fat}g)`,
          ],
        },
        {
          title: "Critical Start Date",
          content: formatDateDDMMYYYY(nutritionStartDate),
        },
        {
          title: "Sahur Recommendations",
          content: [
            "Whole grains and complex carbs",
            "Protein-rich foods (eggs, dairy, legumes)",
            "Foods with healthy fats",
          ],
        },
        {
          title: "Iftar Recommendations",
          content: [
            "Break fast with dates or water first",
            "Start with light, hydrating foods",
            "Follow with balanced meal after 20 minutes",
          ],
        },
        {
          title: "Practice Now",
          content: "Increase whole grains, reduce processed foods, stay hydrated throughout the day",
        },
        {
          title: "Why This Matters",
          content:
            "Eating nutritious, well-balanced meals builds energy reserves and prepares your digestive system for fasting.",
        },
      ],
    },
    {
      id: "fasting",
      icon: "🌙",
      title: "Fasting Practice Schedule",
      urgency: getUrgencyLabel(daysUntilRamadhan),
      sections: [
        {
          title: "Critical Start Date",
          content: `${formatDateDDMMYYYY(fastingStartDate)} (90 days before - Most Important!)`,
        },
        fastingSchedule.weekPlan,
        {
          title: "Why This Matters",
          content: "Practice fasting prepares your body and mind, making the full month smoother and more manageable.",
        },
        {
          title: "Tips",
          content: [
            "Start with lighter fasts before progressing",
            "Consistency matters more than duration",
            "Keep hydrated during non-fasting hours",
          ],
        },
      ],
      warnings: fastingSchedule.warnings,
    },
    {
      id: "hydration",
      icon: "💧",
      title: "Water Intake Strategy",
      currentStatus: `Daily Target: ${dailyWaterLiters.toFixed(1)} Liters`,
      sections: [
        {
          title: "Critical Start Date",
          content: formatDateDDMMYYYY(hydrationStartDate),
        },
        {
          title: "Drinking Schedule",
          content: [
            `At Sahur: ${(dailyWaterLiters * 0.4).toFixed(1)}L`,
            `After Iftar: ${(dailyWaterLiters * 0.4).toFixed(1)}L`,
            `Before Sleep: ${(dailyWaterLiters * 0.2).toFixed(1)}L`,
          ],
        },
        {
          title: "Week 1-2: Track Current",
          content: "Monitor daily water intake and hydration levels",
        },
        {
          title: "Week 3-6: Meet Daily Target",
          content: `Gradually increase intake to reach ${dailyWaterLiters.toFixed(1)}L per day`,
        },
        {
          title: "Week 7+: Practice 8-Hour Window",
          content: "Practice concentrating water intake into fasting-compatible windows",
        },
        {
          title: "Why This Matters",
          content:
            "Proper hydration supports energy, metabolism, and mental clarity essential for fasting and spiritual practices.",
        },
        {
          title: "Tips",
          content: [
            "Drink water at body temperature for better absorption",
            "Add minerals/electrolytes during preparation",
            "Avoid excessive caffeine during Ramadhan preparation",
          ],
        },
        {
          title: "Success Indicators",
          content: ["Light urine color", "Sustained energy levels", "Clear mental focus"],
        },
      ],
    },
    {
      id: "spiritual",
      icon: "📖",
      title: "Spiritual Readiness",
      sections: getSpiritualSections(data.expectations, formatDateDDMMYYYY(spiritualStartDate)),
    },
  ]

  return {
    daysUntilRamadhan,
    categories,
    bmi: Math.round(bmi * 10) / 10,
    activityScore,
    tdee: Math.round(tdee),
  }
}

function calculateDaysUntilRamadhan() {
  const ramadhanStart = new Date(2026, 1, 19) // February 19, 2026
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  ramadhanStart.setHours(0, 0, 0, 0)

  const diff = Math.floor((ramadhanStart.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  return Math.max(diff, 0)
}

function calculateStartDate(daysRemaining: number) {
  const startDate = new Date()
  startDate.setDate(startDate.getDate() + daysRemaining)
  return startDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

function calculateAge(dateOfBirth: string) {
  const today = new Date()
  const birthDate = new Date(dateOfBirth)
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }

  return age
}

function calculateBMR(gender: string, weight: number, height: number, age: number) {
  // Harris-Benedict formula
  if (gender === "male") {
    return 66 + 13.7 * weight + 5 * height - 6.8 * age
  } else {
    return 655 + 9.6 * weight + 1.8 * height - 4.7 * age
  }
}

function getActivityMultiplier(activityScore: number) {
  const multipliers = [1.2, 1.375, 1.55, 1.725, 1.9]
  return multipliers[Math.min(activityScore, 4)]
}

function calculateActivityScore(data: any) {
  let score = 0
  if (data.activityType === "outdoor") score += 1
  if (data.weeklyWorkoutDays >= 5) score += 3
  else if (data.weeklyWorkoutDays >= 3) score += 2
  else if (data.weeklyWorkoutDays >= 1) score += 1
  if (data.jobType === "manual") score += 1
  if (data.jobType === "healthcare") score += 1
  return Math.min(score, 5)
}

function getActivityLevel(score: number) {
  if (score <= 1) return "Sedentary"
  if (score <= 2) return "Lightly Active"
  if (score <= 3) return "Moderately Active"
  return "Very Active"
}

function getSleepTarget(sleepDuration: string) {
  if (sleepDuration === "less-6" || sleepDuration === "6-7") return 8
  if (sleepDuration === "8") return 8
  return 7.5
}

function getBMICategory(bmi: number) {
  if (bmi < 18.5) return "Underweight"
  if (bmi < 25) return "Normal Weight"
  if (bmi < 30) return "Overweight"
  return "Obese"
}

function getExercisePlan(activityScore: number, expectations: string[], daysUntilRamadhan: number) {
  const hasTaraweh = expectations.includes("taraweh")
  const hasQiyam = expectations.includes("qiyamul-lail")
  const hasUmrah = expectations.includes("umrah")

  let frequency = 3
  let intensity = "Moderate"

  if (daysUntilRamadhan < 14) {
    intensity = "High"
    frequency = Math.min(5, activityScore + 2)
  } else if (daysUntilRamadhan < 30) {
    intensity = "Moderate-High"
    frequency = 4
  } else {
    frequency = Math.max(3, Math.min(5, Math.ceil((activityScore + 1) * 0.8)))
  }

  let whyMatters = "Regular exercise builds endurance and improves metabolic health."
  if (hasTaraweh || hasQiyam) {
    whyMatters += " Taraweh involves 1-2 hours standing - build stamina to prevent discomfort."
  }
  if (hasUmrah) {
    whyMatters += " Umrah requires 5-10km walking in heat while fasting."
  }

  return {
    weekPlan: {
      title: "Progressive Plan",
      content: [
        `Week 1-2: ${frequency} light sessions (30 min)`,
        `Week 3-4: Mix cardio & strength training`,
        `Week 5+: Increase intensity based on progress`,
        `Final week: Recovery & light activity`,
      ],
    },
    whyMatters,
    indicators: [
      "Increased endurance during activity",
      "Better sleep quality",
      "Sustained energy throughout day",
      "Improved cardiovascular health",
    ],
  }
}

function getFastingSchedule(daysUntilRamadhan: number) {
  const weekPlan = {
    title: "Fasting Schedule",
    content: [] as string[],
  }
  let warnings: string[] = []

  if (daysUntilRamadhan >= 90) {
    weekPlan.content = [
      "Month 1 (Week 1-4): Monday & Thursday (2x/week)",
      "Month 2 (Week 5-8): Add Saturday (3x/week)",
      "Month 3 (Week 9+): 4x/week as Ramadhan approaches",
    ]
  } else if (daysUntilRamadhan >= 30) {
    weekPlan.content = ["Week 1-2: 3x/week (e.g., Mon, Wed, Fri)", "Week 3-4: 4x/week", "Week 5+: 5x/week alternating"]
    warnings = ["Moderate urgency - consistent practice essential"]
  } else {
    weekPlan.content = [
      "Immediate: Alternate days (4x/week minimum)",
      "Intensive preparation required",
      "Focus on consistency over duration",
    ]
    warnings = [
      "High risk of fatigue - follow hydration strictly",
      "Consider reducing other activities",
      "Monitor energy levels closely",
    ]
  }

  return { weekPlan, warnings }
}

function getSpiritualSections(expectations: string[], startDate: string) {
  const sections: any[] = [
    {
      title: "Based on Your Expectations",
      content: expectations.length > 0 ? expectations.length + " goals selected" : "No specific expectations",
    },
    {
      title: "Critical Start Date",
      content: startDate,
    },
  ]

  if (expectations.includes("complete-quran")) {
    sections.push(
      {
        title: "Quran Goal",
        content: "Complete Quran recitation (604 pages, ~20 pages daily during Ramadhan)",
      },
      {
        title: "Preparation Now",
        content: ["Week 1-4: 5-10 pages daily", "Week 5+: 15 pages daily", "Build consistency before Ramadhan"],
      },
    )
  }

  if (expectations.includes("taraweh")) {
    sections.push({
      title: "Taraweh Preparation",
      content: [
        "Practice standing for 15-20 minutes",
        "Strengthen legs and lower back",
        "Learn Taraweh du'as and surahs",
      ],
    })
  }

  if (expectations.includes("qiyamul-lail")) {
    sections.push({
      title: "Qiyamul Lail Preparation",
      content: [
        "Practice 2x per week at 2-4 AM",
        "Combine with sleep adjustment plan",
        "Start with 15 minutes, gradually increase",
      ],
    })
  }

  if (sections.length === 2) {
    sections.push({
      title: "Daily Spiritual Practice",
      content: [
        "15+ minutes Quran recitation daily",
        "All 5 daily prayers on time",
        "2 raka'ah tahajjud (night prayer) when possible",
      ],
    })
  }

  sections.push({
    title: "Why This Matters",
    content: "Spiritual groundwork strengthens intention, deepens connection, and maximizes the blessing of Ramadhan.",
  })

  return sections
}

function getUrgencyLabel(daysRemaining: number) {
  if (daysRemaining > 90) return "Low"
  if (daysRemaining > 60) return "Medium"
  if (daysRemaining > 30) return "High"
  return "Critical"
}
