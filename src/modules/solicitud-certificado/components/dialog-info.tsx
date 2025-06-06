import React from 'react'
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { FormProvider, useForm } from 'react-hook-form';
import SwithField from '@/components/forms/switch.field';
import { solicitudCertificadoSchema, initialValues, IsolicitudCertificadoSchema } from '../schemas/solicitud-certificado.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import MyAlert from '@/components/forms/myAlert';
import { Itexto } from '@/interfaces/types.interface';
import { MySelect } from '@/components/forms/myselect.field';

type Props = {
    open: boolean;
    text: Itexto[] | undefined;
    action: (trabajador:boolean, tipo_trabajador: string) => void;
}

export default function DialogInfoAdicional({open, text, action}: Props) 
{
    

    const form = useForm({
        resolver: zodResolver(solicitudCertificadoSchema),
        defaultValues: initialValues
    });

    const onSubmit = (data: IsolicitudCertificadoSchema) => {
        action(data.trabajador, data.tipo_trabajador);
    };
    return (
        <AlertDialog open={open}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Verificación de información adicional</AlertDialogTitle>
                    <AlertDialogDescription>
                        Verificar la siguiente información antes de iniciar el proceso de solicitud.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <FormProvider {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className='space-y-4'>
                            <React.Suspense fallback={<div>Loading...</div>}>
                                <MyAlert 
                                    title='Trabajador UNAC' 
                                    description={text?.find(objeto=> objeto.titulo === 'texto_1_inicio')?.texto} 
                                    type='info'/>
                            </React.Suspense>
                            <div className="flex items-center space-x-2 w-full">
                                <SwithField 
                                    control={form.control} 
                                    name='trabajador' 
                                    label='Trabajador UNAC' 
                                    description='Si es trabajador de la UNAC, seleccione esta opción.'
                                />
                            </div>
                            <MySelect
                                    control={form.control}
                                    name='tipo_trabajador'
                                    placeholder='Seleccione el tipo de trabajador UNAC'
                                    label='Tipo de trabajador'
                                    description='Seleccione que tipo de trabajador es usted.'
                                    disabled={!form.watch('trabajador')}
                                    options={[
                                        { value: 'DOCENTE', label: 'Docente y Familiares' },
                                        { value: 'ADMINISTRATIVO', label: 'Administrativo CAS / Nombrado' },
                                    ]}
                                />
                        </div>
                        <AlertDialogFooter className='pt-2'>
                            <AlertDialogAction type='submit'>Continuar</AlertDialogAction>
                        </AlertDialogFooter>
                    </form>
                </FormProvider>
            </AlertDialogContent>
        </AlertDialog>
    )
}
