import useStore from '@/hooks/useStore'
import { useTextsStore } from '@/stores/types.stores'
import React from 'react'
import useSolicitudStore from '../stores/solicitud.store'
import { StepperControl } from '@/components/stepper'
import { useForm } from 'react-hook-form'
import { Form } from '@/components/ui/form'
import MyAlert from '@/components/forms/myAlert'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { UploadCloudIcon } from 'lucide-react'
import { FileUploaderCard } from '@/components/forms/upload.field'
import { Card, CardContent } from '@/components/ui/card'
import { isPdf } from '@/lib/utils'
import Image from 'next/image'


type Props = {
    activeStep : number
    steps : string[]
    setActiveStep: React.Dispatch<React.SetStateAction<number>>
    handleNext: (values:{img_cert_trabajo:string, img_cert_estudio: string}) => void
}

export default function Documentos({activeStep, handleNext, steps, setActiveStep}:Props) 
{
    const textos = useStore(useTextsStore, (state) => state.textos);
    const { solicitud } = useSolicitudStore()

    const [validation, setValidation] = React.useState({
        cert_trabajador: false,
        cert_ciunac: false,
    })

    const form = useForm({
        defaultValues: {
            img_cert_trabajo: solicitud.img_cert_trabajo??  '',
            img_cert_estudio: solicitud.img_cert_estudio?? '',
        },
    })

    const onSubmit = (values:{img_cert_trabajo:string, img_cert_estudio: string}) =>{
        if(values.img_cert_trabajo==='' && solicitud.trabajador){
            setValidation({...validation, cert_trabajador: true})
            return
        }
        if(values.img_cert_estudio==='' && solicitud.alumno_ciunac){
            setValidation({...validation, cert_ciunac: true})
            return
        }
        handleNext(values)
    }
    
    return (
        <React.Fragment>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-2">
                <div
                    className={`
                        grid grid-cols-1 
                        ${solicitud.trabajador && solicitud.alumno_ciunac ? 'md:grid-cols-3' : 'md:grid-cols-2'} 
                        gap-4
                    `}
                >
                    {/* Primera columna: MyAlert y Alerts */}
                    <div className="space-y-2">
                        <MyAlert
                            title='Atención'
                            description={textos?.find((objeto) => objeto.titulo === 'texto_1_trabajador')?.texto}
                        />
                        <Alert variant="default">
                            <UploadCloudIcon className="h-4 w-4" />
                            <AlertTitle>Subida de archivos</AlertTitle>
                            <AlertDescription>
                                Luego de buscar el archivo se subirá al servidor para su revisión. Se acepta
                                formatos *.jpg, *.png, *.pdf
                            </AlertDescription>
                        </Alert>

                        {validation.cert_ciunac && (
                        <Alert variant="destructive">
                            <UploadCloudIcon className="h-4 w-4" />
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>
                            Subir la imagen del certificado de estudios CIUNAC
                            </AlertDescription>
                        </Alert>
                        )}

                        {validation.cert_trabajador && (
                        <Alert variant="destructive">
                            <UploadCloudIcon className="h-4 w-4" />
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>
                                Subir la imagen del certificado de trabajador UNAC
                            </AlertDescription>
                        </Alert>
                        )}
                    </div>
                    {/* Segunda y tercera columna: FileUploaderCards */}
                    {solicitud.trabajador && (
                        <div>
                            <Card className='mb-2'>
                                <CardContent className="flex justify-center items-center p-2">
                                {
                                    form.watch('img_cert_trabajo')? (
                                        <React.Fragment>
                                            {isPdf(form.watch('img_cert_trabajo') as string)? (
                                                <Image
                                                    src={'/images/pdf.png'}
                                                    width={250}
                                                    height={250}
                                                    alt="img_cert_trabajo"
                                                    className="rounded-md object-contain h-[250px]"
                                                />
                                            ):(
                                                <Image
                                                    src={form.watch('img_cert_trabajo') ?? '/images/upload.svg'}
                                                    width={250}
                                                    height={250}
                                                    alt="img_cert_trabajo"
                                                    className="rounded-md object-contain h-[250px]"
										        />
                                            )}
                                        </React.Fragment>
                                    ):(
                                        <React.Fragment>
                                            <Image
                                                src={'/images/upload.svg'}
                                                width={250}
                                                height={250}
                                                alt="img_cert_trabajo"
                                                className="rounded-md object-contain h-[250px]"
                                            />
								        </React.Fragment>
                                    )
                                }
                                </CardContent>
                            </Card>
                            <FileUploaderCard
                                name="img_cert_trabajo"
                                label="Certificado de Trabajador UNAC"
                                dni={solicitud.dni}
                                folder='trabajadores'
                                icon={UploadCloudIcon }
                            />
                        </div>
                    )}

                    {solicitud.alumno_ciunac && (
                        <div>
                            <Card className='mb-2'>
                                <CardContent className="flex justify-center items-center p-2">
                                {
                                    form.watch('img_cert_estudio')? (
                                        <React.Fragment>
                                            {isPdf(form.watch('img_cert_estudio') as string)? (
                                                <Image
                                                    src={'/images/pdf.png'}
                                                    width={250}
                                                    height={250}
                                                    alt="img_cert_estudio"
                                                    className="rounded-md object-contain h-[250px]"
                                                />
                                            ):(
                                                <Image
                                                    src={form.watch('img_cert_estudio') ?? '/images/upload.svg'}
                                                    width={250}
                                                    height={250}
                                                    alt="img_cert_estudio"
                                                    className="rounded-md object-contain h-[250px]"
										        />
                                            )}
                                        </React.Fragment>
                                    ):(
                                        <React.Fragment>
                                            <Image
                                                src={'/images/upload.svg'}
                                                width={250}
                                                height={250}
                                                alt="img_cert_estudio"
                                                className="rounded-md object-contain h-[250px]"
                                            />
								        </React.Fragment>
                                    )
                                }
                                </CardContent>
                            </Card>
                            <FileUploaderCard
                                name="img_cert_estudio"
                                label="Certificado de Estudios CIUNAC"
                                dni={solicitud.dni}
                                folder='certificados'
                                icon={UploadCloudIcon}
                            />
                        </div>
                    )}
                </div>


                    {/* Botones de navegación */}
                    <StepperControl 
                        activeStep={activeStep} 
                        steps={steps} 
                        setActiveStep={setActiveStep}
                        type="submit"
                    />
                </form>
            </Form>
        </React.Fragment>
    )
}

