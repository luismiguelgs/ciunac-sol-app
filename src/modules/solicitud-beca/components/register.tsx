import { StepperControl } from '@/components/stepper'
import React from 'react'
import useStore from "../stores/solicitud.store"
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import Image from 'next/image'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { finalSchema, IFinalSchema, initialValues } from '../schemas/final.schema'
import { Form } from '@/components/ui/form'
import SwithField from '@/components/forms/switch.field'
import MyAlert from '@/components/forms/myAlert'
import { toast } from "sonner"
import SolicitudesService from '@/services/solicitudes.service'
import Isolicitud from '@/interfaces/solicitud.interface'
import EmailService from '@/services/email.service'
import GeneralDialog from '@/components/dialogs/general-dialog'
import { Button } from '@/components/ui/button'
import { Loader2 } from "lucide-react"
import { useRouter } from 'next/navigation'
import { ExternalLink } from 'lucide-react'; // Asegúrate de importar el icono que deseas usar

function detalleSolicitud(titulo:string, valor:string|undefined, link:boolean = false) {
    return (
        <div className="flex justify-between items-center">
            <span className="font-semibold">{titulo}:</span>
            {
                link ? (
                    <Link href={valor as string} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">Ver documento</Link>
                ) : (<span>{valor}</span>)
            }
        </div>
    )
}

type Props = {
    activeStep : number
    steps : string[]
    setActiveStep: React.Dispatch<React.SetStateAction<number>>
}

export default function Register({activeStep, setActiveStep, steps}:Props) 
{
    const router = useRouter()
    const [loading, setLoading] = React.useState<boolean>(false)
    const [open, setOpen] = React.useState<boolean>(false)
    const [state, setState] = React.useState<'SAVE'|'EMAIL'|'ERROR'>('SAVE')
    const [message, setMessage] = React.useState<React.ReactNode>('')
   
    const { solicitud } = useStore();
   

    const form = useForm<IFinalSchema>({
        resolver: zodResolver(finalSchema),
        defaultValues: initialValues,
    })

    const onSubmit = async (data: IFinalSchema) => {
        if(!data.info || !data.terminos){
            toast.error('Verificar Información',{
                description: 'Por favor, verifica que se confirma que todos los datos son correctos, y/o acepta los términos.'
            })
        }else{
            setLoading(true)
            setState('SAVE')
            setOpen(true)
            //guarda la informacion en la base de datos
            const response = await SolicitudesService.newItem(solicitud as Isolicitud)
            if(!response){
                setState('ERROR')
                setMessage('Error al guardar la solicitud')
                setOpen(true)
                return
            }else{
                setState('EMAIL')
                setMessage('Solicitud guardada correctamente')
                //envia un correo electronico confirmando la recepcion de la solicitud
                await EmailService.sendEmailBeca(solicitud.email as string, response as string )
                setOpen(false)
            }
            
            //redirecciona al usuario a la pagina final de la solicitud
            router.push('/solicitud-beca/finalizar')
        }
    }

    if (!solicitud) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <div className="grid grid-cols-1 gap-6">
                <MyAlert 
                    title='Verifica tus datos'
                    description='Verifica que los datos ingresados sean correctos para poder finalizar con el proceso de solicitud.'
                    type='warning'
                />
                <Card className="shadow-lg relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center opacity-5">
                        <Image
                            src='/images/logo-ciunac-trans.png'
                            alt="CIUNAC Logo"
                            fill
                            priority
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-contain"
                        />
                    </div>
                    <CardHeader>
                        <h2 className="text-2xl font-bold text-center md:text-left relative">
                            Datos de la Solicitud
                        </h2>
                        <Separator className="my-4" />
                    </CardHeader>
                    <CardContent className="space-y-4 relative">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm md:text-base">
                            {detalleSolicitud('Tipo de Solicitud', solicitud.tipo_solicitud)}
                            {detalleSolicitud('Apellidos', solicitud.apellidos)}
                            {detalleSolicitud('Nombres', solicitud.nombres)}
                            {detalleSolicitud('Celular', solicitud.celular)}
                            {detalleSolicitud('Dirección', solicitud.direccion)}
                            {detalleSolicitud('Código', solicitud.codigo)}
                            {detalleSolicitud('Tipo de Documento', solicitud.tipo_documento)}
                            {detalleSolicitud('Documento', solicitud.dni)}
                            {detalleSolicitud('Facultad', solicitud.facultad)}
                            {detalleSolicitud('Escuela', solicitud.escuela)}
                            {detalleSolicitud('Email', solicitud.email)}
                            {detalleSolicitud('Estado', solicitud.estado)}
                            {detalleSolicitud('Constancia de Matrícula', solicitud.img_cert_estudio, true)}
                            {detalleSolicitud('Historial Académico', solicitud.img_dni, true)}
                            {detalleSolicitud('Constancia de Tercio / Quinto Superior', solicitud.img_voucher, true)}
                            {detalleSolicitud('Carta de Compromiso', solicitud.img_cert_trabajo, true)}
                            {detalleSolicitud('Declaración Jurada', solicitud.certificado_trabajo, true)}   
                        </div>
                    </CardContent>
                </Card>
            </div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="p-4">
                    <SwithField 
                        name='info'
                        label="Confirmo que los datos son correctos"
                        control={form.control}
                        description='Los datos consignados estan correctos y los documentos adjuntos son los verídicos.'
                    />
                    <div className='mt-4'>
                        <SwithField 
                        name='terminos'
                        label="Acepto los términos y condiciones"
                        control={form.control}
                        description='Declaro que conozco el reglamento respecto a becas CIUNAC' 
                        />
                    </div>
                    <div className="flex justify-end items-center mt-2">
                        <Link href='https://ciunac.unac.edu.pe/reglamento/' target="_blank" rel="noopener noreferrer" className="text-blue-500 underline flex items-center">
                            Ver Reglamento <ExternalLink className="ml-1 w-4 h-4" />
                        </Link>
                    </div>
                    <StepperControl 
                        activeStep={activeStep} 
                        steps={steps} 
                        setActiveStep={setActiveStep}
                        type="submit"
                        disabled={loading}
                    />
                </form>
            </Form>
            <GeneralDialog 
				open={open} 
				setOpen={setOpen}
				title="Espere, procesando información..." 
				description={state === 'EMAIL'? "Enviando correo electrónico" : state === 'SAVE'? "Guardando información" : "Error al procesar la solicitud"}
			>
				<div className="flex items-center justify-between gap-6 p-4">
					<Image 
						src={state === 'EMAIL' ? "/images/send-email.png" : state === 'SAVE' ? "/images/save-student.png" : "/images/error.png"}
						alt="Estado del proceso"
						width={120}
						height={120}
						className="flex-shrink-0"
					/>
					<div className="flex flex-col items-center space-y-4">
						{ state !== 'ERROR' ? (<>
							<Loader2 className="h-16 w-16 animate-spin text-primary" />
							<span className="text-sm text-muted-foreground">
								Espere por favor, estamos procesando su solicitud. Esto puede tomar unos minutos.
							</span>
						</>):(<>
							<span className="text-sm text-muted-foreground font-bold">
								{message}
							</span>
							<Button
								className="mt-4"
								type="button"
								color="primary"
								onClick={()=>setOpen(false)}
							>
								Cerrar
							</Button>
						</>)}
					</div>
				</div>
			</GeneralDialog>
        </div>
    )
}
