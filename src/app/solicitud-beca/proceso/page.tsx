'use client'
import { Stepper } from '@/components/stepper'
import BasicData from '@/modules/solicitud-beca/components/basic-data'
import { useSearchParams } from 'next/navigation' // 1. Importa useSearchParams
import React from 'react' // Asegúrate de importar React si usas JSX
import useSolicitudStore from '@/modules/solicitud-beca/stores/solicitud.store'
import { IBasicInfoSchema } from '@/modules/solicitud-beca/schemas/basic-data.schema'
import Documents from '@/modules/solicitud-beca/components/documents'
import { DocumentsFormValues } from '@/modules/solicitud-beca/schemas/documents.schema'
import Register from '@/modules/solicitud-beca/components/register'

function BecaProcess()
{
    const searchParams = useSearchParams() // 2. Llama al hook
    const email = searchParams.get('email') // 3. Obtén el valor del parámetro 'email'

    const [activeStep, setActiveStep] = React.useState(0);
    const { setSolicitudField } = useSolicitudStore()

    const steps = ["Solicitud de Beca", "Documentos Adjuntos", "Registro"];

    const handleNext = (values:IBasicInfoSchema | DocumentsFormValues) => {
        switch (activeStep) {
            case 0:
                if (isBasicInfoSchema(values)) {
                    setSolicitudField('email', email);
                    setSolicitudField('apellidos', values.apellidos);
                    setSolicitudField('nombres', values.nombres);
                    setSolicitudField('facultad', values.facultad);
                    setSolicitudField('escuela', values.escuela);
                    setSolicitudField('codigo', values.codigo);
                    setSolicitudField('direccion', values.direccion);
                    setSolicitudField('celular', values.celular);
                    setSolicitudField('tipo_documento', values.tipo_documento);
                    setSolicitudField('dni', values.dni);
                }
                break;
            case 1:
                if (isDocumentsFormValues(values)) {
                    setSolicitudField('img_cert_estudio', values.constancia_matricula);
                    setSolicitudField('img_dni', values.historial_academico);
                    setSolicitudField('img_voucher', values.constancia_tercio);
                    setSolicitudField('img_cert_trabajo', values.carta_compromiso);
                    setSolicitudField('certificado_trabajo', values.declaracion_jurada);
                }
                break;
        }
        if(activeStep < steps.length - 1){
            setActiveStep((prevActiveStep) => prevActiveStep + 1)
        }
    };

    return (
        <div className="flex items-center justify-center">
            <Stepper steps={steps} activeStep={activeStep}>
                {/* Contenido de cada paso */}
                <BasicData
                    activeStep={activeStep}
                    setActiveStep={setActiveStep}
                    handleNext={handleNext}
                    steps={steps}
                />
                <Documents 
                    activeStep={activeStep}
                    setActiveStep={setActiveStep}
                    handleNext={handleNext}
                    steps={steps}
                />
                <Register 
                    activeStep={activeStep}
                    setActiveStep={setActiveStep}
                    steps={steps}
                />
            </Stepper>
        </div>
    )
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function isBasicInfoSchema(value: any): value is IBasicInfoSchema {
        return (
            typeof value === 'object' &&
            value !== null &&
            'apellidos' in value &&
            'nombres' in value &&
            'dni' in value
        )
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any  
    function isDocumentsFormValues(value: any): value is DocumentsFormValues {
        return (
            typeof value === 'object' &&
            value !== null &&
            'constancia_matricula' in value &&
            'historial_academico' in value &&
            'constancia_tercio' in value
        )
    }
}
export default function BecaProcessPage()
{
    return (<React.Suspense fallback={<div>Loading...</div>}>
        <BecaProcess />
    </React.Suspense>)
}