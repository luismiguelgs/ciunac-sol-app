import Copyright from "@/components/copyright";
import MyAlert from "@/components/forms/myAlert";
import FormEmail from "@/modules/solicitud-beca/components/form-email";
import Image from "next/image";

export default function BecaPage() {
    return (
        <div className="p-4">
             <h2 className="text-2xl font-bold uppercase text-center mb-6">
                Verificación de correo electrónico
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="flex flex-col items-center space-y-4">
                        <Image 
                            src="/images/email-verification.png" 
                            alt="logo" 
                            width={190} 
                            height={190} 
                        />
                        <MyAlert 
                            title="Comprobar tu correo electrónico:"
                            description={<>
                                    Ingresa tu correo electrónico y luego haz click en <strong>COMPROBAR</strong>{' '}
                                    Se te enviará un correo electrónico con un código de verificación.{' '}
                                    El código deberá ser ingresado en la caja de texto <strong>Código de verificación</strong>{' '}
                                    En caso no veas el código en tu bandeja principal, puedes verificar en correos no deseados (SPAM).
                            </>}
                        />
                        <Copyright />
                </div>
                    {/* Right Column */}
                    <FormEmail />
            </div>
        </div>
    )
}
