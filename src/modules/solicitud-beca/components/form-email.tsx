'use client'
import InputField from '@/components/forms/input.field'
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react'
import ReCAPTCHA from 'react-google-recaptcha';
import { useForm } from 'react-hook-form'
import { initialValues, verificationSchema } from '../schemas/verification.schema';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { CheckCircle, Send } from "lucide-react"
import { useRouter } from 'next/navigation'; // 1. Importa useRouter
import { toast } from 'sonner';
import MyInputOpt from '@/components/forms/input.otp';

export default function FormEmail() 
{
    const router = useRouter(); // 2. Inicializa el router
    const [disabled, setDisabled] = React.useState<boolean>(false);
    const [timeLeft, setTimeLeft] = React.useState<number | null>(null);

    const captchaRef = React.useRef<ReCAPTCHA>(null)

    const form = useForm({
        resolver: zodResolver(verificationSchema),
        defaultValues: initialValues,
    })

    const onSubmit = async (data: typeof initialValues) => {
        if(!captchaRef.current?.getValue()){
            toast.warning('Advertencia',{description: 'Por favor, confirme que no eres un robot'})

        }else{
            const verificationNumber = String(getVerificationNumber()).trim();

            if(verificationNumber === data.code){
                // 3. Redirige a la siguiente página con el email en la URL
                const email = data.email;
                router.push(`/solicitud-beca/proceso?email=${encodeURIComponent(email)}`);
            }
            else{
                toast.warning('Advertencia',{description: 'El código de verificación es incorrecto'})
            }
        }
    }

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    React.useEffect(() => {
        if (timeLeft !== null && timeLeft > 0) {
            const intervalId = setInterval(() => {
                setTimeLeft(prev => prev! - 1);
            }, 1000);

            return () => clearInterval(intervalId); // Clean interval
        }

        if (timeLeft === 0) {
            setDisabled(false); // Enabled after 5 minutes
            setTimeLeft(null); // Stop Timer
        }
    },[timeLeft])

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="p-4">
                <div className="space-y-6 pt-3">
                    <InputField
                        control={form.control}
                        name='email'
                        type="email"
                        disabled={disabled}
                    />
                    <div className="flex flex-col items-center space-y-4">
                            <Button 
                                disabled={disabled}
                                onClick={verifyEmail}
                                type="button"
                                variant="outline"
                                className="w-full md:w-auto"
                            >
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Comprobar
                            </Button>

                            <MyInputOpt 
                                name="code"
                                label="Código de verificación"
                                control={form.control}
                                disabled={disabled}
                                description="Ingresa el código de verificación de 4 dígitos"
                            />
                    </div>
                    {timeLeft !== null && (
                            <p className="text-xl text-center mt-4">
                               Tiempo restante: {formatTime(timeLeft)}
                            </p>
                        )}

                        <div className="flex justify-center p-6">
                            <ReCAPTCHA
                                sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY as string}
                                ref={captchaRef}
                            />
                        </div>
                {/* Contenedor para centrar el botón */}
                <div className="flex justify-center">
                    <Button
                        //disabled={disabled || timeLeft !== null} // Deshabilitar si el temporizador está activo
                        type="submit"
                        className="w-full md:w-auto px-10 py-3 text-md" // Mantenido el padding horizontal (px-10)
                    >
                        <Send className="mr-2 h-5 w-5" /> {/* Icono añadido */}
                        Enviar
                    </Button>
                </div>
            </div>
        </form>
    </Form>
)
    /**
     * Sends an email verification to the user with a random number.
     * Stores the random number and expiration time in localStorage.
     * Starts a 5 minute timer after which the user can request a new verification email.
     */
    async function verifyEmail()  
    {
        const email = form.getValues("email");

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            toast.warning('Verificar Email',{description: 'Por favor, ingrese una dirección de correo electrónico válida'});
            return; // Prevent form submission if email is invalid
        }
        // disable button for 5 minutes
        setDisabled(true)
        setTimeLeft(5 * 60); // start the 5 minute timer
        // generate a random 4-digit number
        const randomNumber = Math.floor(Math.random() * 9000 + 1000);

        // set expiration time to 5 minutes from now
        const expirationTime = new Date().getTime() + 5 * 60 * 1000;

        // save number and expiration time in localStorage
        localStorage.setItem('verificationNumber', JSON.stringify({ randomNumber, expirationTime }));

        // send email verification
        try{
            const response =  await fetch('/api/email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-cache'
                },
                body: JSON.stringify({ type: 'RANDOM', email: email, number: randomNumber })
            })
            if (response.ok) {
                console.log('Email verification sent successfully');
            } else {
                console.error('Failed to send verification email');
            }
        }catch(error){
            console.error('An error occurred while sending the email:', error);
        }
        
        // disable button after 5 minutes (300,000 ms)
        setTimeout(() => {
            setDisabled(false);
        }, 5 * 60 * 1000);
    }
    /**
     * Returns the verification number stored in localStorage if it exists and has not expired.
     * If the number has expired, it is removed from localStorage.
     * @returns {string} The verification number if it exists and has not expired, otherwise an empty string.
     */
    function getVerificationNumber():string {
        const storedData = localStorage.getItem('verificationNumber');
        if (storedData) {
            const { randomNumber, expirationTime } = JSON.parse(storedData);
            const currentTime = new Date().getTime();
            
            // verify if number has expired
            if (currentTime < expirationTime) {
                return randomNumber; // valid number
            } else {
                localStorage.removeItem('verificationNumber'); // Borrar el dato si ha expirado
            }
        }
        return ''; // if it does not exist or has expired
    }
}


