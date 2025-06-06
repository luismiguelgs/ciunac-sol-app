'use client'

import React from 'react';
import { useRouter } from 'next/navigation';
import FormEmail from '@/components/form-email';
import { IVerificationSchema } from '@/schemas/verification.schema';
import DialogInfoAdicional from './dialog-info';
import useStore from '@/hooks/useStore';
import { useTextsStore } from '@/stores/types.stores';
import TypesService from '@/services/types.service';
import { Itexto } from '@/interfaces/types.interface';

export default function FormEmailSolicitud()
{
    let textos = useStore(useTextsStore, (state) => state.textos)
    const router = useRouter();

    React.useEffect(()=>{
        const texts = async () => {
            textos = await TypesService.fetchTypes<Itexto>('textos');
            useTextsStore.setState({ textos: textos })
        }
        if(!textos) texts()
    },[])

    const [open, setOpen] = React.useState(false);
    const [email, setEmail] = React.useState('');

    const action = (data: IVerificationSchema) => {
        setEmail(data.email);
        setOpen(true);
    };

    const redireccionar = (trabajador:boolean, tipo_trabajador:string) => {
        router.push(
            `/solicitud-certificados/proceso?email=${encodeURIComponent(email)}&tipo_trabajador=${encodeURIComponent(tipo_trabajador)}&trabajador=${encodeURIComponent(trabajador)}`);
        setOpen(false);
    };

    return (
        <React.Fragment> 
            <FormEmail action={action} />
            <DialogInfoAdicional open={open} text={textos} action={redireccionar}/>
        </React.Fragment>
    );
}