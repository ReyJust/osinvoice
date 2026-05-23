import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Mail01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

export default async function Page() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md">
        
        {/* Header */}
        <CardHeader className="flex flex-col items-center text-center space-y-2">
          <div className="rounded-full bg-primary p-3">
            <HugeiconsIcon icon={Mail01Icon} color="white" />
          </div>

          <CardTitle>Check your email</CardTitle>

          <CardDescription>
            We’ve sent you a magic link to sign in.
          </CardDescription>
        </CardHeader>

        {/* Content */}
        <CardContent className="space-y-4 text-center">
          <p>
            Click the link in your email to continue. You can close this tab
            once you’re signed in.
          </p>

          <div className="space-y-2 pt-4">
            <p className="text-sm text-muted-foreground">Didn’t receive the email?</p>

            <Button variant="outline" className="w-full">
              Resend email
            </Button>
          </div>

          <a
            href="/login"
            className="text-sm text-muted-foreground hover:underline block"
          >
            Back to login
          </a>
        </CardContent>
      </Card>
    </div>
  )
}