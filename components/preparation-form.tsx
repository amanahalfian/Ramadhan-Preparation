"use client"

import { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"
import { motion } from "framer-motion"

const formSchema = z.object({
  name: z.string().min(2, "Please enter your name"),
  dateOfBirth: z.string().refine((date) => {
    const d = new Date(date)
    const year = d.getFullYear()
    return year >= 1940 && year <= 2010 && d < new Date()
  }, "Please select your date of birth"),
  gender: z.array(z.string()).min(1, "Please select at least one gender identity"),
  height: z
    .string()
    .transform(Number)
    .pipe(z.number().min(100, "Height must be between 100-250 cm").max(250, "Height must be between 100-250 cm")),
  weight: z
    .string()
    .transform(Number)
    .pipe(z.number().min(30, "Weight must be between 30-200 kg").max(200, "Weight must be between 30-200 kg")),
  jobType: z.enum(["office", "healthcare", "teacher", "manual", "retail", "student", "stay-at-home", "other"]),
  activityType: z.array(z.string()).min(1, "Please select at least one activity type"),
  activityTypeCustom: z.string().max(100, "Custom activity type must be 100 characters or less").optional(),
  weeklyWorkoutDays: z.string().transform(Number).pipe(z.number().min(0).max(7)),
  sleepDuration: z.array(z.string()).min(1, "Please select at least one sleep duration"),
  sleepDurationCustom: z.string().max(100, "Custom sleep duration must be 100 characters or less").optional(),
  expectations: z.array(z.string()).min(1, "Please select at least one Ramadhan goal"),
  customExpectation: z.string().max(500, "Custom expectation must be 500 characters or less").optional(),
})

type FormData = z.infer<typeof formSchema>

interface PreparationFormProps {
  onSubmit: (data: FormData) => void
  isLoading: boolean
  onCancel: () => void
}

export function PreparationForm({ onSubmit, isLoading, onCancel }: PreparationFormProps) {
  const [step, setStep] = useState(1)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    control,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      gender: [],
      activityType: [],
      sleepDuration: [],
      expectations: [],
    },
  })

  const formValues = watch()

  const handleNext = async () => {
    setStep(step + 1)
  }

  const handlePrev = () => {
    if (step > 1) setStep(step - 1)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-secondary/5 py-8 px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-balance mb-4">Your Profile</h1>
          <p className="text-lg text-muted-foreground text-balance">
            Help us create your personalized preparation plan
          </p>
        </div>

        <div className="flex gap-2 mb-8 justify-center">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className={`h-2 flex-1 max-w-12 rounded-full transition-all ${i <= step ? "bg-primary" : "bg-border"}`}
            />
          ))}
        </div>
        <p className="text-center text-sm text-muted-foreground mb-8">Step {step} of 3</p>

        <form onSubmit={handleSubmit(onSubmit)}>
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {step === 1 && (
              <PersonalDataSection register={register} errors={errors} formValues={formValues} control={control} />
            )}
            {step === 2 && (
              <DailyActivitiesSection
                register={register}
                errors={errors}
                setValue={setValue}
                formValues={formValues}
                control={control}
              />
            )}
            {step === 3 && (
              <RamadhanExpectationsSection
                control={control}
                errors={errors}
                register={register}
                formValues={formValues}
              />
            )}
          </motion.div>

          {/* Navigation Buttons */}
          <div className="flex gap-4 mt-8">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
              className="flex-1 bg-transparent"
            >
              Cancel
            </Button>
            {step > 1 && (
              <Button
                type="button"
                variant="outline"
                onClick={handlePrev}
                disabled={isLoading}
                className="flex-1 bg-transparent"
              >
                Previous
              </Button>
            )}
            {step < 3 && (
              <Button type="button" onClick={handleNext} disabled={isLoading} className="flex-1">
                Next
              </Button>
            )}
            {step === 3 && (
              <Button type="submit" disabled={isLoading} className="flex-1">
                {isLoading ? (
                  <>
                    <Spinner className="mr-2 h-4 w-4" />
                    Calculating your personalized plan...
                  </>
                ) : (
                  "Generate My Plan"
                )}
              </Button>
            )}
          </div>
        </form>
      </motion.div>
    </div>
  )
}

function PersonalDataSection({ register, errors, formValues, control }: any) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Section 1: Personal Data</CardTitle>
        <CardDescription>Tell us about yourself</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" {...register("name")} placeholder="Your full name" className="mt-2" />
          {errors.name && <p className="text-sm text-destructive mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <Label htmlFor="dateOfBirth">Date of Birth (DD-MM-YYYY)</Label>
          <Input id="dateOfBirth" type="date" {...register("dateOfBirth")} className="mt-2" />
          {errors.dateOfBirth && <p className="text-sm text-destructive mt-1">{errors.dateOfBirth.message}</p>}
        </div>

        <div>
          <Label className="mb-3 block">Gender Identity</Label>
          <div className="space-y-3">
            {[
              { value: "female", label: "Female" },
              { value: "male", label: "Male" },
            ].map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <Controller
                  name="gender"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      id={`gender-${option.value}`}
                      checked={field.value?.includes(option.value)}
                      onCheckedChange={(checked) => {
                        const value = field.value || []
                        if (checked) {
                          field.onChange([...value, option.value])
                        } else {
                          field.onChange(value.filter((v) => v !== option.value))
                        }
                      }}
                    />
                  )}
                />
                <Label htmlFor={`gender-${option.value}`} className="font-normal cursor-pointer mb-0">
                  {option.label}
                </Label>
              </div>
            ))}
          </div>
          {errors.gender && <p className="text-sm text-destructive mt-2">{errors.gender.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="height">Height (cm)</Label>
            <Input
              id="height"
              type="number"
              {...register("height")}
              placeholder="170"
              className="mt-2"
              min="100"
              max="250"
            />
            {errors.height && <p className="text-sm text-destructive mt-1">{errors.height.message}</p>}
          </div>
          <div>
            <Label htmlFor="weight">Weight (kg)</Label>
            <Input
              id="weight"
              type="number"
              {...register("weight")}
              placeholder="70"
              className="mt-2"
              min="30"
              max="200"
            />
            {errors.weight && <p className="text-sm text-destructive mt-1">{errors.weight.message}</p>}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function DailyActivitiesSection({ register, errors, setValue, formValues, control }: any) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Section 2: Daily Activities</CardTitle>
        <CardDescription>Tell us about your lifestyle</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label htmlFor="jobType">Job Type</Label>
          <Select onValueChange={(value) => setValue("jobType", value)} defaultValue={formValues.jobType}>
            <SelectTrigger id="jobType" className="mt-2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="office">Office Worker (Desk Job)</SelectItem>
              <SelectItem value="healthcare">Healthcare Professional</SelectItem>
              <SelectItem value="teacher">Teacher/Educator</SelectItem>
              <SelectItem value="manual">Manual Labor/Construction</SelectItem>
              <SelectItem value="retail">Retail/Service Industry</SelectItem>
              <SelectItem value="student">Student</SelectItem>
              <SelectItem value="stay-at-home">Stay-at-home Parent</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          {errors.jobType && <p className="text-sm text-destructive mt-1">{errors.jobType.message}</p>}
        </div>

        <div>
          <Label className="mb-3 block">Activity Types</Label>
          <div className="space-y-3">
            {[
              { value: "indoor", label: "Indoor Activities" },
              { value: "outdoor", label: "Outdoor Activities" },
              { value: "other", label: "Other" },
            ].map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <Controller
                  name="activityType"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      id={`activity-${option.value}`}
                      checked={field.value?.includes(option.value)}
                      onCheckedChange={(checked) => {
                        const value = field.value || []
                        if (checked) {
                          field.onChange([...value, option.value])
                        } else {
                          field.onChange(value.filter((v) => v !== option.value))
                        }
                      }}
                    />
                  )}
                />
                <Label htmlFor={`activity-${option.value}`} className="font-normal cursor-pointer mb-0">
                  {option.label}
                </Label>
              </div>
            ))}
          </div>
          {formValues.activityType?.includes("other") && (
            <Input {...register("activityTypeCustom")} placeholder="Please specify" className="mt-3" />
          )}
          {errors.activityType && <p className="text-sm text-destructive mt-2">{errors.activityType.message}</p>}
        </div>

        <div>
          <Label htmlFor="weeklyWorkoutDays">Weekly Workout Days</Label>
          <Select
            onValueChange={(value) => setValue("weeklyWorkoutDays", value)}
            defaultValue={formValues.weeklyWorkoutDays?.toString() || "0"}
          >
            <SelectTrigger id="weeklyWorkoutDays" className="mt-2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                <SelectItem key={i} value={i.toString()}>
                  {i} days per week
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.weeklyWorkoutDays && (
            <p className="text-sm text-destructive mt-1">{errors.weeklyWorkoutDays.message}</p>
          )}
        </div>

        <div>
          <Label className="mb-3 block">Sleep Duration</Label>
          <div className="space-y-3">
            {[
              { value: "less-6", label: "Less than 6 hours" },
              { value: "6-7", label: "6-7 hours" },
              { value: "8", label: "8 hours" },
              { value: "more-8", label: "More than 8 hours" },
              { value: "other", label: "Other" },
            ].map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <Controller
                  name="sleepDuration"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      id={`sleep-${option.value}`}
                      checked={field.value?.includes(option.value)}
                      onCheckedChange={(checked) => {
                        const value = field.value || []
                        if (checked) {
                          field.onChange([...value, option.value])
                        } else {
                          field.onChange(value.filter((v) => v !== option.value))
                        }
                      }}
                    />
                  )}
                />
                <Label htmlFor={`sleep-${option.value}`} className="font-normal cursor-pointer mb-0">
                  {option.label}
                </Label>
              </div>
            ))}
          </div>
          {formValues.sleepDuration?.includes("other") && (
            <Input
              {...register("sleepDurationCustom")}
              placeholder="Please specify (e.g., 9-10 hours)"
              className="mt-3"
            />
          )}
          {errors.sleepDuration && <p className="text-sm text-destructive mt-2">{errors.sleepDuration.message}</p>}
        </div>
      </CardContent>
    </Card>
  )
}

function RamadhanExpectationsSection({ control, errors, register, formValues }: any) {
  const expectations = [
    { id: "full-fasting", label: "Full-day fasting (29-30 days)" },
    { id: "taraweh", label: "Full Taraweh prayers (every night)" },
    { id: "qiyamul-lail", label: "Qiyamul Lail (night prayers)" },
    { id: "complete-quran", label: "Complete Quran recitation" },
    { id: "umrah", label: "Umrah during Ramadhan" },
    { id: "itikaf", label: "I'tikaf (last 10 days)" },
    { id: "charity", label: "Charity/Zakat distribution" },
    { id: "work-productivity", label: "Maintain full work productivity" },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Section 3: Ramadhan Expectations</CardTitle>
        <CardDescription>What are your goals for Ramadhan?</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <Label>Select your expectations (choose at least one)</Label>
          {expectations.map((expectation) => (
            <div key={expectation.id} className="flex items-center space-x-2">
              <Controller
                name="expectations"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    id={expectation.id}
                    checked={field.value?.includes(expectation.id)}
                    onCheckedChange={(checked) => {
                      const value = field.value || []
                      if (checked) {
                        field.onChange([...value, expectation.id])
                      } else {
                        field.onChange(value.filter((v) => v !== expectation.id))
                      }
                    }}
                  />
                )}
              />
              <Label htmlFor={expectation.id} className="font-normal cursor-pointer mb-0">
                {expectation.label}
              </Label>
            </div>
          ))}
          {errors.expectations && <p className="text-sm text-destructive mt-2">{errors.expectations.message}</p>}
        </div>

        <div>
          <Label htmlFor="customExpectation">Custom Expectation (Optional)</Label>
          <Textarea
            id="customExpectation"
            {...register("customExpectation")}
            placeholder="Any other goals? (e.g., memorize specific surahs, volunteer work)"
            className="mt-2 min-h-24"
            maxLength={500}
          />
          {errors.customExpectation && (
            <p className="text-sm text-destructive mt-1">{errors.customExpectation.message}</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
