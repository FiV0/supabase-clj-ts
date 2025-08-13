import { GalleryVerticalEnd } from "lucide-react"
import { SignUpForm } from "@/components/signup-form"

interface SignUpPageProps {
  onSuccess: () => void
  onLoginClick: () => void
}

export function SignUpPage({ onSuccess, onLoginClick }: SignUpPageProps) {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-4" />
            </div>
            Supabase Hello World
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <SignUpForm onSuccess={onSuccess} onLoginClick={onLoginClick} />
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
          <div className="text-center">
            <GalleryVerticalEnd className="mx-auto mb-4 size-16 opacity-20" />
            <p className="text-sm">Join Supabase Hello World</p>
          </div>
        </div>
      </div>
    </div>
  )
}