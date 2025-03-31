import { Lock } from "lucide-react"
import ConsultaForm from "./(components)/consulta-form"
import Copyright from "@/components/copyright"

export default function ConsultaSolicitudPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <div className="flex flex-col gap-6">
              <div className="flex justify-center">
                <Lock className="h-12 w-12 text-primary" />
              </div>
              <ConsultaForm />
            </div>
            <Copyright />
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <img
          src="/images/unac.jpg"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  )
}
