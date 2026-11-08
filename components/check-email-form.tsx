"use client"

import { useEffect, useState, useTransition } from "react"
import { CheckmarkCircle02Icon, Mail01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import { resendSignInEmail } from "@/app/login/actions"
import { useSupabase } from "@/utils/supabase/client"

const RESEND_COOLDOWN = 60

export function CheckEmailForm({ email }: { email: string }) {
  const supabase = useSupabase()
  const [signedIn, setSignedIn] = useState(false)

  const [resendPending, startResend] = useTransition()
  const [resendMessage, setResendMessage] = useState<string | null>(null)
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN)

  // The magic link opens in a new tab and signs in there. Auth cookies are
  // shared across tabs, so re-reading the session here detects that sign-in.
  useEffect(() => {
    if (signedIn) return

    const check = async () => {
      const { data } = await supabase.auth.getSession()
      if (data.session) setSignedIn(true)
    }

    check()
    const interval = setInterval(check, 3000)
    const onVisible = () => document.visibilityState === "visible" && check()
    document.addEventListener("visibilitychange", onVisible)
    window.addEventListener("focus", check)
    return () => {
      clearInterval(interval)
      document.removeEventListener("visibilitychange", onVisible)
      window.removeEventListener("focus", check)
    }
  }, [supabase, signedIn])

  useEffect(() => {
    if (cooldown <= 0) return
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000)
    return () => clearTimeout(t)
  }, [cooldown])

  const resend = () =>
    startResend(async () => {
      const err = await resendSignInEmail(email)
      setResendMessage(err ?? "A new link is on its way.")
      if (!err) setCooldown(RESEND_COOLDOWN)
    })

  if (signedIn) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-col items-center space-y-2 text-center">
          <div className="rounded-full bg-primary p-3">
            <HugeiconsIcon icon={CheckmarkCircle02Icon} color="white" />
          </div>
          <CardTitle>You&apos;re signed in</CardTitle>
          <CardDescription>You can close this tab now.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" className="w-full" asChild>
            <a href="/invoice/new">Continue in this tab</a>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="flex flex-col items-center space-y-2 text-center">
        <div className="rounded-full bg-primary p-3">
          <HugeiconsIcon icon={Mail01Icon} color="white" />
        </div>
        <CardTitle>Check your email</CardTitle>
        <CardDescription>
          {email ? (
            <>
              We sent a sign-in link to{" "}
              <span className="font-medium text-foreground">{email}</span>
            </>
          ) : (
            "We sent you a sign-in link."
          )}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4 text-center">
        <p>Click the link in the email to sign in.</p>

        {email && (
          <div className="space-y-2 pt-4">
            <p className="text-sm text-muted-foreground">
              Didn&apos;t receive the email?
            </p>
            <Button
              variant="outline"
              className="w-full"
              onClick={resend}
              disabled={resendPending || cooldown > 0}
            >
              {resendPending && <Spinner />}
              {cooldown > 0 ? `Resend email (${cooldown}s)` : "Resend email"}
            </Button>
            {resendMessage && (
              <p className="text-sm text-muted-foreground">{resendMessage}</p>
            )}
          </div>
        )}

        <a
          href="/login"
          className="block text-sm text-muted-foreground hover:underline"
        >
          Back to login
        </a>
      </CardContent>
    </Card>
  )
}
