"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Share2, Linkedin, Instagram, Twitter, Copy, Check, Download } from "lucide-react"
import { motion } from "framer-motion"
import { useState } from "react"

interface ShareSectionProps {
  userName: string
  plan: any
  data: any
}

export function ShareSection({ userName, plan, data }: ShareSectionProps) {
  const [copied, setCopied] = useState(false)

  const shareText = `Preparing for Ramadhan 2026 starting Feb 19! My personalized plan helps me build fitness, adjust sleep, and strengthen my iman.

My Goals:
${data.expectations
  .map((exp: string) => {
    const labels: Record<string, string> = {
      "full-fasting": "Full-day fasting",
      taraweh: "Full Taraweh prayers",
      "qiyamul-lail": "Qiyamul Lail",
      "complete-quran": "Complete Quran",
      umrah: "Umrah",
      itikaf: "I'tikaf",
      charity: "Charity/Zakat",
      "work-productivity": "Maintain work productivity",
    }
    return `• ${labels[exp] || exp}`
  })
  .join("\n")}

Days until Ramadhan: ${plan.daysUntilRamadhan}
Start by: ${calculateStartDate(plan.daysUntilRamadhan)}

Start your plan now!`

  const socialLinks = [
    {
      name: "LinkedIn",
      icon: Linkedin,
      color: "hover:bg-blue-100 hover:text-blue-700 dark:hover:bg-blue-900",
      url: `https://www.linkedin.com/feed/?v=&rnid=&quickEdit=&shareActive=true&text=${encodeURIComponent(shareText)}`,
    },
    {
      name: "Instagram",
      icon: Instagram,
      color: "hover:bg-pink-100 hover:text-pink-700 dark:hover:bg-pink-900",
      url: `https://www.instagram.com/`,
    },
    {
      name: "Twitter/X",
      icon: Twitter,
      color: "hover:bg-sky-100 hover:text-sky-700 dark:hover:bg-sky-900",
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`,
    },
  ]

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error("Failed to copy:", error)
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5 text-primary" />
            Share Your Preparation Journey
          </CardTitle>
          <CardDescription>Inspire others to prepare spiritually and physically for Ramadhan 2026</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Preview Card */}
          <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-lg p-6 border border-primary/20">
            <h3 className="font-semibold text-lg mb-3 text-primary">My Ramadhan 2026 Preparation Plan</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>
                <span className="font-semibold text-foreground">{plan.daysUntilRamadhan}</span> days until Ramadhan
              </p>
              <p>
                <span className="font-semibold text-foreground">Start by:</span>{" "}
                {calculateStartDate(plan.daysUntilRamadhan)}
              </p>
              <div className="pt-3 border-t space-y-1">
                <p className="font-semibold text-foreground text-xs uppercase">Key Milestones:</p>
                {data.expectations.slice(0, 3).map((exp: string, i: number) => {
                  const labels: Record<string, string> = {
                    "full-fasting": "Full-day fasting",
                    taraweh: "Full Taraweh prayers",
                    "qiyamul-lail": "Qiyamul Lail",
                    "complete-quran": "Complete Quran",
                    umrah: "Umrah",
                    itikaf: "I'tikaf",
                    charity: "Charity/Zakat",
                    "work-productivity": "Maintain work productivity",
                  }
                  return (
                    <p key={i} className="text-xs">
                      • {labels[exp] || exp}
                    </p>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Share Buttons */}
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-3">Share on social media:</p>
              <div className="grid grid-cols-3 gap-3">
                {socialLinks.map((social) => {
                  const Icon = social.icon
                  return (
                    <motion.a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full"
                    >
                      <Button variant="outline" size="sm" className={`w-full ${social.color} transition-colors`}>
                        <Icon className="h-4 w-4 mr-2" />
                        <span className="hidden sm:inline text-xs">{social.name}</span>
                      </Button>
                    </motion.a>
                  )
                })}
              </div>
            </div>

            <Button className="w-full bg-primary hover:bg-primary/90" onClick={handleCopyToClipboard}>
              {copied ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Copied to Clipboard!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy to Clipboard
                </>
              )}
            </Button>

            {/* Download options placeholder */}
            <div className="grid grid-cols-2 gap-3 pt-2 border-t">
              <Button variant="outline" size="sm" className="w-full bg-transparent" disabled>
                <Download className="h-4 w-4 mr-2" />
                <span className="text-xs">Download PDF</span>
              </Button>
              <Button variant="outline" size="sm" className="w-full bg-transparent" disabled>
                <Download className="h-4 w-4 mr-2" />
                <span className="text-xs">Save as Image</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

function calculateStartDate(daysRemaining: number) {
  const startDate = new Date()
  startDate.setDate(startDate.getDate() + daysRemaining)
  return startDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })
}
