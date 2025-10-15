'use client'
import React from "react"
import { Icertificado } from "../interfaces/certificado.interface"
import CertificadosService from "../services/certificados.service"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import pdfImage from '@/assets/pdf.png'
import { Download } from "lucide-react"


export default function DownloadCertificado({item}:{item:any}) {
    const [certificado, setCertificado] = React.useState<Icertificado | null>(null)

    React.useEffect(() => {
        if (!item.id) return
        CertificadosService.selectItemBySolicitud(item.id).then((certificado) => {
            setCertificado(certificado)
        })
    }, [item.id])

    // Descargar certificado virtual item.url?
    const descargarPDF = () => {
        if (!certificado?.url) return

        
        const a = document.createElement('a')
        a.href = certificado?.url
        a.download = `${certificado?.dni}-${certificado?.idioma}-${certificado?.nivel}-${certificado?.fecha_emision?.toLocaleDateString()}.PDF`
        a.click()
    }

    return (
        <div className="flex flex-col gap-2 w-full">
            <div className="flex items-center gap-1">
                <Image
                    src={pdfImage}
                    alt={item.id as string}
                    width={50}
                    height={50}
                    className="cursor-pointer hover:opacity-80 transition-opacity mr-3"
                    onClick={descargarPDF}
                />
                <Button 
                    variant="default"
                    size="lg" 
                    className="flex-1 justify-center cursor-pointer hover:opacity-90 transition-opacity drop-shadow text-base font-semibold gap-2 shadow-md hover:shadow-lg focus-visible:ring-2 focus-visible:ring-primary"
                    onClick={descargarPDF}
                >
                    <Download className="h-4 w-4" />
                    Descargar Certificado
                </Button>
            </div>
            <p className="text-sm font-medium text-destructive pl-2">
                Puede descargar su certificado digital aqui!
            </p>
        </div>
    )
}