'use client'
import { Document, Page, StyleSheet, Image, Text } from "@react-pdf/renderer"
import logoCiunac from '@/assets/logo-ciunac.jpg'
import React from "react"
import { Itexto } from '@/interfaces/types.interface'

const styles = StyleSheet.create({
    page:{
        paddingTop:45,
        paddingBottom:65,
        paddingHorizontal: 45
    },
    image:{
		marginBottom: 50,
		marginHorizontal: 10,
		width: 200,
	},
    title:{
        fontSize: 22,
        textAlign: 'center',
        marginBottom: 15
    },
    text: {
        margin: 12,
        fontSize: 12,
        textAlign: 'justify',
    },
    data: {
        marginHorizontal:12,
        marginVertical:5,
        fontSize: 13,
        textAlign: 'justify'
    }
})

type Props = {
    textos: Itexto[],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    obj: any
}
export default function CargoPdf({textos, obj}:Props) 
{
    function message(text:string, textos:Itexto[]):string{
        const objEncontrado = textos.find(objeto=> objeto.titulo === text)
        if (!objEncontrado) {
            console.warn(`Texto no encontrado para el título: ${text}`);
            return '';
        }
        return objEncontrado.texto;
    }

    return (
        <Document>
                <Page size='A4' style={styles.page}>
                    <Image style={styles.image} src={logoCiunac.src}/>
                    <Text style={styles.title}>CARGO PARA LA ENTREGA DE CERTIFICADOS</Text>
                    <Text style={styles.text}>SE HA COMPLETADO EL PROCEDIMIENTO!</Text>
                    <Text style={styles.text}>
                        {message('texto_1_final',textos)}
                    </Text>
                    <Text style={styles.data}>{`Tipo de Documento: ${obj.solicitud.toLocaleUpperCase()}`}</Text>
                    <Text style={styles.data}>{`Fecha de Ingreso: ${obj.creado}`}</Text>
                    <Text style={styles.data}>{`Apellidos: ${obj.apellidos.toLocaleUpperCase()}`}</Text>
                    <Text style={styles.data}>{`Nombres: ${obj.nombres.toLocaleUpperCase()}`}</Text>
                    <Text style={styles.data}>{`DNI: ${obj.dni.toLocaleUpperCase()}`}</Text>
                    <Text style={styles.data}>{`Idioma: ${obj.idioma.toLocaleUpperCase()}`}</Text>
                    <Text style={styles.data}>{`Nivel: ${obj.nivel.toLocaleUpperCase()}`}</Text>
                    <Text style={styles.data}>{`Pago: S/${obj.pago}`}</Text>
                    <Text style={styles.data}>{`Número de Voucher: ${obj.voucher}`}</Text>
                    <Text style={styles.text}>Plazo de entrega: 10 dias hábiles</Text>
                    <Text style={styles.text}>
                        {message('texto_1_disclamer',textos)}
                    </Text>
                    <Text style={styles.text}>
                        {message('texto_2_disclamer',textos)}
                    </Text>
                </Page>
        </Document>
    )
}