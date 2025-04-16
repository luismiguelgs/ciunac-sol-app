'use client'
import { Button } from "@/components/ui/button"
import Image from "next/image"
import pdfImage from '@/assets/pdf.png'
import Isolicitud from '@/interfaces/solicitud.interface'
import CargoPdf from '@/modules/consulta-solicitud/components/cargo-pdf'
import { pdf } from '@react-pdf/renderer'
import { Itexto } from '@/interfaces/types.interface'

type Props = {
    item: Isolicitud
    textos: Itexto[]
}

export default function Download({item, textos}: Props) {
    const descargarPDF = async() => {
        const obj = {
            solicitud: item.tipo_solicitud || 'SOLICITUD DE CERTIFICADO',
            creado: new Date(item.creado as string).toLocaleDateString(),
            apellidos: item.apellidos,
            nombres: item.nombres,
            dni: item.dni,
            idioma: item.idioma,
            nivel: item.nivel,
            pago: item.pago,
            voucher: item.numero_voucher
        }

        const cargoPdfElement = <CargoPdf textos={textos} obj={obj}/>
        const blobPdf = await pdf(cargoPdfElement).toBlob()
        const blobUrl = URL.createObjectURL(blobPdf)
        
        const a = document.createElement('a')
        a.style.display = 'none'
        a.href = blobUrl
        a.download = `${item.dni}-${item.idioma}-${item.nivel}.pdf`

        document.body.appendChild(a)
        a.click()

        document.body.removeChild(a)
        URL.revokeObjectURL(blobUrl)
    }

    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center gap-1">
                <Image
                    src={pdfImage}
                    alt={item.id as string}
                    width={50}
                    height={50}
                    className="cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={descargarPDF}
                />
                <Button 
                    variant="ghost" 
                    className="text-base"
                    onClick={descargarPDF}
                >
                    {`${item.dni}-${item.idioma}-${item.nivel}.PDF`}
                </Button>
            </div>
            <p className="text-sm font-medium text-destructive pl-2">
                Puede descargar su cargo aqui!
            </p>
        </div>
    )
}