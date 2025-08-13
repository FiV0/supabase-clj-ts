import { GalleryVerticalEnd } from "lucide-react"
import { LoginForm } from "@/components/login-form"

interface LoginPageProps {
  onSuccess: () => void
  onSignUpClick: () => void
}

export function LoginPage({ onSuccess, onSignUpClick }: LoginPageProps) {
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
            <LoginForm onSuccess={onSuccess} onSignUpClick={onSignUpClick} />
          </div>
        </div>
      </div>
      <div className="bg-white relative hidden lg:block border-l border-border">
        <div className="absolute inset-0 flex items-center justify-center">
          <img 
            src="/supabase_clj_ts.png" 
            alt="Supabase Clojure TypeScript" 
            className="h-64 w-auto object-contain"
          />
        </div>
      </div>
    </div>
  )
}