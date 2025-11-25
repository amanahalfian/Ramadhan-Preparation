"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { CountdownTimer } from "@/components/countdown-timer"
import { PreparationForm } from "@/components/preparation-form"
import { ResultsPage } from "@/components/results-page"

export default function Home() {
  const [currentPage, setCurrentPage] = useState<"landing" | "form" | "results">("landing")
  const [formData, setFormData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleFormSubmit = async (data: any) => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 2500))
    try {
      // Save to database
      await fetch("/api/save-preparation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).catch(() => {
        // Silently fail if API endpoint not ready
      })
      setFormData(data)
      setCurrentPage("results")
    } catch (error) {
      console.error("Error saving data:", error)
      setFormData(data)
      setCurrentPage("results")
    } finally {
      setIsLoading(false)
    }
  }

  const handleStartNew = () => {
    setFormData(null)
    setCurrentPage("landing")
  }

  if (currentPage === "landing") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background via-background to-secondary/5 flex items-center justify-center px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto text-center"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <CountdownTimer />
          </motion.div>

          {/* Days Until Display */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mb-8">
            <p className="text-xl font-semibold text-primary">
              <DaysUntilDisplay />
            </p>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-6xl font-bold text-balance mb-6 leading-tight"
          >
            Prepare Your Body &amp; Soul for a Blessed Ramadhan
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-lg text-muted-foreground text-balance mb-8"
          >
            Ramadhan begins February 19, 2026
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <Button
              onClick={() => setCurrentPage("form")}
              size="lg"
              className="px-8 py-6 text-lg bg-primary hover:bg-primary/90 rounded-lg"
            >
              Start Your Preparation Journey
            </Button>
          </motion.div>

          {/* Feature highlights */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <div className="p-6 rounded-lg bg-card border border-border">
              <div className="text-3xl mb-2">📋</div>
              <h3 className="font-semibold mb-2">Personalized Plan</h3>
              <p className="text-sm text-muted-foreground">Get recommendations based on your lifestyle</p>
            </div>
            <div className="p-6 rounded-lg bg-card border border-border">
              <div className="text-3xl mb-2">🎯</div>
              <h3 className="font-semibold mb-2">Practical Steps</h3>
              <p className="text-sm text-muted-foreground">Clear, actionable guidance for preparation</p>
            </div>
            <div className="p-6 rounded-lg bg-card border border-border">
              <div className="text-3xl mb-2">🔒</div>
              <h3 className="font-semibold mb-2">Privacy First</h3>
              <p className="text-sm text-muted-foreground">Your data is calculated locally and secure</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-16 pt-8 border-t border-border"
          >
            <p className="text-sm text-muted-foreground">Built with ❤️ for the Ummah</p>
          </motion.div>
        </motion.div>
      </div>
    )
  }

  if (currentPage === "form") {
    return (
      <PreparationForm onSubmit={handleFormSubmit} isLoading={isLoading} onCancel={() => setCurrentPage("landing")} />
    )
  }

  if (currentPage === "results" && formData) {
    return <ResultsPage data={formData} onStartNew={handleStartNew} />
  }

  return null
}

function DaysUntilDisplay() {
  const ramadhanStart = new Date(2026, 1, 19) // February 19, 2026
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  ramadhanStart.setHours(0, 0, 0, 0)

  const diff = Math.floor((ramadhanStart.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  const daysLeft = Math.max(diff, 0)

  return <span>{daysLeft} Days Until Ramadhan 2026</span>
}
