"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

export function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    const calculateTimeLeft = () => {
      const ramadhanStart = new Date(2026, 1, 19) // February 19, 2026
      const now = new Date()

      const difference = ramadhanStart.getTime() - now.getTime()

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        })
      }
    }

    calculateTimeLeft()
    const interval = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex gap-3 justify-center items-center flex-wrap">
      <TimeUnit value={timeLeft.days} label="Days" />
      <span className="text-xl font-bold text-muted-foreground">:</span>
      <TimeUnit value={timeLeft.hours} label="Hours" />
      <span className="text-xl font-bold text-muted-foreground">:</span>
      <TimeUnit value={timeLeft.minutes} label="Minutes" />
      <span className="text-xl font-bold text-muted-foreground">:</span>
      <TimeUnit value={timeLeft.seconds} label="Seconds" />
    </div>
  )
}

function TimeUnit({ value, label }: { value: number; label: string }) {
  return (
    <motion.div key={value} className="flex flex-col items-center">
      <div className="bg-primary/10 border border-primary/20 rounded-lg px-3 py-2 min-w-14">
        <div className="text-xl md:text-2xl font-bold text-primary">{String(value).padStart(2, "0")}</div>
      </div>
      <p className="text-xs text-muted-foreground mt-1 font-medium">{label}</p>
    </motion.div>
  )
}
