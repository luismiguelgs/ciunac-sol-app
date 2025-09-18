import React from 'react'
import { useTextsStore } from '@/stores/types.stores';
import useStore from '@/hooks/useStore';
import { useMask } from '@react-input/mask'
import { basicInfoSchema, IBasicInfoSchema, initialValues } from '../schemas/basic-data.schema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import useSolicitudStore from '@/stores/solicitud.store';
import { NIVEL } from '@/lib/constants';
import { Form } from '@/components/ui/form';
import MyAlert from '@/components/forms/myAlert';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import InputField from '@/components/forms/input.field';
import { SelectLanguage } from '@/components/forms/select-lang.field';
import { MySelect } from '@/components/forms/myselect.field';
import { RadioGroupField } from '@/components/forms/radio-group.field';
import { CloudUpload } from 'lucide-react';
import { StepperControl } from '@/components/stepper';
import UploadImage from '@/components/upload-image';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useSearchParams } from 'next/navigation';

type Props = {
    activeStep: number,
    setActiveStep: React.Dispatch<React.SetStateAction<number>>,
    steps: string[],
    handleNext: (values:IBasicInfoSchema) => void,
}

export default function BasicData({activeStep, setActiveStep, steps, handleNext}:Props) 
{
    const searchParams = useSearchParams();
    const alumno = searchParams.get('alumno_ciunac')

    const textos = useStore(useTextsStore, (state) => state.textos);
    const { solicitud } = useSolicitudStore() 
    const [imageVal, setImageVal] = React.useState<boolean>(false)

    const phoneRef = useMask({ mask: '_________', replacement: { _: /\d/ } });
    //const codeRef = useMask({ mask: '__________', replacement: { _: /\d/ } });
    const dniRef = useMask({ mask: '_________', replacement: { _: /[\da-zA-Z]/ } });
    const lastNamesRef = useMask({ mask: '______________________________', replacement: { _: /^[a-zA-Z \u00C0-\u00FF]*$/ } })
    const namesRef = useMask({ mask: '_______________________________', replacement: { _: /^[a-zA-Z \u00C0-\u00FF]*$/ } })

    const form = useForm<IBasicInfoSchema>({
        resolver: zodResolver(basicInfoSchema),
        defaultValues: {
            tipo_solicitud: initialValues.tipo_solicitud,
            idioma: solicitud?.idioma?? initialValues.idioma,
            nivel: solicitud?.nivel?? initialValues.nivel,
            apellidos: solicitud?.apellidos ?? initialValues.apellidos,
            nombres: solicitud?.nombres ?? initialValues.nombres,
            facultad: solicitud?.facultad ?? initialValues.facultad,
            img_dni: solicitud?.img_dni?? initialValues.img_dni,
            escuela: solicitud?.escuela ?? initialValues.escuela,
            codigo: solicitud?.codigo ?? initialValues.codigo,
            tipo_documento: solicitud?.tipo_documento ?? 'PE01',
            dni: solicitud.dni ?? initialValues.dni,
            celular: solicitud.celular ?? initialValues.celular,
        }
    })

    const onSubmit = (data:IBasicInfoSchema) => {

        if(form.getValues('img_dni')===undefined || form.getValues('img_dni')===''){
			setImageVal(true)
			return
		}else{
			setImageVal(false)
			handleNext(data);
		}	
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" autoComplete="off">
                <MyAlert 
                    title="Atención" 
                    description={textos?.find(objeto=> objeto.titulo === 'texto_ubicacion_2')?.texto}
                    type="warning"
                />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className='col-span-2'>
                        <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
                            <CardHeader>
                                <CardTitle className="text-lg font-bold text-primary">Información Personal</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <InputField
                                        label="Apellidos"
                                        name="apellidos"
                                        inputRef={lastNamesRef}
                                        placeholder="Ingresar primer y segundo apellido..."
                                        control={form.control}
                                    />
                                    <InputField
                                        label="Nombres"
                                        name="nombres"
                                        inputRef={namesRef}
                                        placeholder="Ingresar nombres..."
                                        control={form.control}
                                    />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <SelectLanguage
                                        name="idioma"
                                        control={form.control}
                                        ubicacion={true}
                                    />
                                    <div style={{'paddingTop':-2}}>
                                        <MySelect
                                            name="nivel"
                                            control={form.control}
                                            label="Nivel"
                                            disabled={alumno === 'true' ? false: true}
                                            placeholder='Selecciona un nivel'
                                            options={NIVEL}
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <RadioGroupField
                                        label="Tipo de Documento"
                                        name="tipo_documento"
                                        options={[
                                            { value: "PE01", label: "Documento de Identidad" },
                                            { value: "PE02", label: "Carnet de Extranjería" },
                                            { value: "PE03", label: "Pasaporte" },
                                        ]}
                                        control={form.control}
                                    />
                                    <div style={{'marginTop':-2}}>
                                        <InputField
                                            label="Número de Documento"
                                            name="dni"
                                            inputRef={dniRef}
                                            placeholder="Ingresar número de documento..."
                                            control={form.control}
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <InputField
                                        label="Celular"
                                        name="celular"
                                        inputRef={phoneRef}
                                        type="tel"
                                        control={form.control}
                                        description=""
                                    />
                                    <div style={{'marginTop':-20}}>
                                    {
                                        imageVal ? (
                                            <Alert variant="destructive" className="mt-4">
                                                <AlertTitle>Subida de Archivos</AlertTitle>
                                                <CloudUpload className="mr-2 h-4 w-4"/>
                                                <AlertDescription>
                                                    Completar la subida del archivo al servidor. Se aceptan formatos *.jpg *.png *.pdf.
                                                </AlertDescription>
                                            </Alert>
						                ) : (
                                            <Alert className="mt-4">
                                                <AlertTitle>Subida de Archivos</AlertTitle>
                                                <CloudUpload className="mr-2 h-4 w-4"/>
                                                <AlertDescription>
                                                    Luego de buscar el archivo se subirá al servidor para su revisión. Se aceptan formatos
                                                    *.jpg *.png *.pdf.
                                                </AlertDescription>
                                            </Alert>
						                )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                    <div className='col-span-1'>
                        <UploadImage 
                            form={form}
                            field="img_dni"
                            label="Foto de DNI"
                            dni={form.watch('dni')}
                            folder="dni"
                        />
                    </div>                
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
    )
}
