import React from 'react'
import Link from 'next/link'
import Isolicitud from '@/interfaces/solicitud.interface'
import { Card, CardContent, CardHeader } from './ui/card'
import Image from 'next/image'
import { Separator } from './ui/separator'

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
    solicitud: Partial<Isolicitud>
    tipo: 'BECA' | 'CERTIFICADO' | 'EXAMEN'
}

export default function DetalleSolicitudCard({solicitud, tipo}:Props) 
{
    if (!solicitud) {
        return <div>Loading...</div>;
    }
    console.log(solicitud)
    return (
        <React.Fragment>
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
                    <CardContent className="space-y-2 relative">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm md:text-base">
                            {detalleSolicitud('Estado', solicitud.estado)}
                            {detalleSolicitud('Tipo de Solicitud', solicitud.tipo_solicitud)}
                            {detalleSolicitud('Apellidos', solicitud.apellidos)}
                            {detalleSolicitud('Nombres', solicitud.nombres)}
                            {detalleSolicitud('Celular', solicitud.celular)}
                            {detalleSolicitud('Tipo de Documento', solicitud.tipo_documento)}
                            {detalleSolicitud('Documento', solicitud.dni)}
                            {detalleSolicitud('Facultad', solicitud.facultad)}
                            {detalleSolicitud('Escuela', solicitud.escuela)}
                            {detalleSolicitud('Código', solicitud.codigo)}
                            {detalleSolicitud('Email', solicitud.email)}
                            {detalleSolicitud('Dirección', solicitud.direccion)}
                            {
                                tipo === 'CERTIFICADO' && (
                                    <React.Fragment>
                                        {detalleSolicitud('Trabajador UNAC', solicitud.trabajador ? 'Sí' : 'No')}
                                        {detalleSolicitud('Alumno antiguo', solicitud.antiguo ? 'Sí' : 'No')}
                                        {detalleSolicitud('Idioma', solicitud.idioma)}
                                        {detalleSolicitud('Nivel', solicitud.nivel)}
                                        {solicitud.img_voucher && detalleSolicitud('Monto Pagado', `S/${solicitud.pago}`)}
                                        {solicitud.img_voucher && detalleSolicitud('Fecha de Pago', solicitud.fecha_pago)}
                                        {solicitud.img_voucher && detalleSolicitud('Número de Voucher', solicitud.numero_voucher)}
                                        {solicitud.img_voucher && detalleSolicitud('Imagen de Voucher', solicitud.img_voucher, true)}
                                        {solicitud.img_cert_trabajo && detalleSolicitud('Certificado de Trabajo', solicitud.img_cert_trabajo, true)}
                                    </React.Fragment>
                                )
                            }
                            {tipo === 'BECA' && (<React.Fragment>
                                {detalleSolicitud('Constancia de Matrícula', solicitud.img_cert_estudio, true)}
                                {detalleSolicitud('Historial Académico', solicitud.img_dni, true)}
                                {detalleSolicitud('Constancia de Tercio / Quinto Superior', solicitud.img_voucher, true)}
                                {detalleSolicitud('Carta de Compromiso', solicitud.img_cert_trabajo, true)}
                                {detalleSolicitud('Declaración Jurada', solicitud.certificado_trabajo, true)}   
                            </React.Fragment>)}
                        </div>
                    </CardContent>
                </Card>
        </React.Fragment>
    )
}
