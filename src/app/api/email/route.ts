import { NextRequest, NextResponse } from "next/server";
import { FOOTER, HEAD } from "../(libs)/constants";
import nodemailer from 'nodemailer';

type Body = {
    type:string,
    email:string,
    number?:number,
    user?:string
}

export async function POST(request:NextRequest)
{ 
    const body:Body = await request.json();
    const transporter = getCredentials();
    try{
        const mailData = {
            from: process.env.EMAIL_USER,
            to: body.email,
            subject: getBodyEmail(body)?.subject,
            text: getBodyEmail(body)?.text,
            html: getBodyEmail(body)?.body, // html body
        };
        await transporter.sendMail(mailData);
        return NextResponse.json({"message":"success"},{status:200})
    } catch(error){
        return NextResponse.json({error:error}, {status:500})
    }
}

function getCredentials() { 
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    return transporter
}
function getBodyEmail(body:Body){
    switch(body.type){
        case "RANDOM":
            return {
                body:`<!DOCTYPE html>
                        <html>
                            ${HEAD}
                        <body>
                            <img src="https://ciunac.unac.edu.pe/wp-content/uploads/2024/04/cropped-WhatsApp-Image-2024-04-19-at-2.48.00-PM-2.jpeg" alt="logo" width="200px"/>
                            <h1>COMPROBACIÓN DE CORREO</h1>
                            <p>Ingrese el siguente numero para verificar su correo:</p>
                            <h1 style="color:blue"> ${body.number}</h1>
                            <p>Regrese al proceso de registro para completar el proceso. Este código expirará en 5 minutos</p>
                            <p>Si el código expira, puedes solicitar otro en la aplicación</p>
                            <hr>
                            ${FOOTER}
                        </body>
                        </html>`,
                subject:"CIUNAC - COMPROBACIÓN DE CORREO",
                text:`Ingrese el siguente numero para verificar su correo: ${body.number}`
            }
        case "REGISTER":
            return { 
                body:`<!DOCTYPE html>
                        <html>
                            ${HEAD}
                        <body>
                            <h1>REGISTRO EXITOSO</h1>
                            <p>Usted ha sido registrado exitosamente</p>
                            <h2>DATOS DE INICIO DE SESION &#128273;</h2>
                            <span>&#128204;</span><a href="https://ciunac.q10.com/">ACESO AL SISTEMA</a>
                            <p>Usuario: <b>${body.user}</b></p>
                            <p>Contraseña: <b>${body.user}</b></p>
                            <h2>VER HORARIOS Y MEMORIZAR LA SECCIÓN &#128198;</h2>
                            <ul>
                                <li><a href="https://ciunac.unac.edu.pe/idioma-ingles/">INGLÉS</a></li>
                                <li><a href="https://ciunac.unac.edu.pe/idioma-portugues/">PORTUGUÉS</li>
                                <li><a href="https://ciunac.unac.edu.pe/idioma-italiano/">ITALIANO</a></li>
                                <li><a href="https://ciunac.unac.edu.pe/idioma-frances/">FRANCÉS</a></li>
                                <li><a href="https://ciunac.unac.edu.pe/idioma-quechua/">QUECHUA</a></li>
                            </ul>
                            <h2>MANUAL DE MATRÍCULA &#128215;</h2>
                            <span>&#128209;</span><a href="https://drive.google.com/file/d/17KaBoMyK7yHcS6nnBTkBWDcHkUKbnwDe/view?usp=drive_web">MANUAL DE MATRÍCULA CIUNAC ACTUALIZADO.PDF</a><br>
                            <span>&#127916;</span><a href="https://drive.google.com/file/d/1BzBfyHuCemruBb1iCFV7sKjI6193naUo/view?usp=drive_web">VIDEO TUTORIAL - MATRÍCULA	CIUNAC.MP4</a>
                            ${FOOTER}
                        </body>
                        </html>`,
                subject:"CIUNAC - REGISTRO EXITOSO",
                text:`Usted ha sido registrado exitosamente USUARIO: ${body.user} CONTRASEÑA: ${body.user}`
            }
        case "BECA":
            return {
                body:`<!DOCTYPE html>
                        <html>
                            ${HEAD}
                        <body>
                            <img src="https://ciunac.unac.edu.pe/wp-content/uploads/2024/04/cropped-WhatsApp-Image-2024-04-19-at-2.48.00-PM-2.jpeg" alt="logo" width="200px"/>
                            <h1>CONFIRMACIÓN DE REGISTRO PARA BECA CIUNAC</h1>
                            <p>Estimad@ estudiante:</p>
                            <p>Le informamos que hemos recibido correctamente su solicitud de beca a través del sistema del CIUNAC.
                                Nuestro equipo revisará su documentación y, en caso de requerir información adicional, nos pondremos en contacto con usted por este medio.
                                Agradecemos su interés y participación en el programa de becas.
                            </p>
                            <p>Su codigo es: ${body.user}</p>
                            <hr>
                            ${FOOTER}
                        </body>
                        </html>`,
                subject:"CIUNAC - CONFIRMACIÓN DE REGISTRO PARA SOLICITUD DE BECA",
                text:`Este es el codigo de su transacción: ${body.user}`
            }
        case "CERTIFICADO":
            return {
                body:`<!DOCTYPE html>
                        <html>
                            ${HEAD}
                        <body>
                            <img src="https://ciunac.unac.edu.pe/wp-content/uploads/2024/04/cropped-WhatsApp-Image-2024-04-19-at-2.48.00-PM-2.jpeg" alt="logo" width="200px"/>
                            <h1>CONFIRMACIÓN DE REGISTRO SOLICITUD DE CERTIFICADO/CONSTANCIA</h1>
                            <p>Estimad@ estudiante:</p>
                            <p>Le informamos que hemos recibido correctamente su solicitud de beca a través del sistema del CIUNAC.
                                Nuestro equipo revisará su documentación y, en caso de requerir información adicional, nos pondremos en contacto con usted por este medio.
                                atentos a sus inquietudes.
                            </p>
                            <p>Su codigo de transacción es: ${body.user}</p>
                            <p>Puede revisar el estado de su solicitud con su documento de identidad, adicionalmente aqui también puede 
                            obtener su cargo</p>
                            <a href="https://ciunac.unac.edu.pe/reporte-certificado-virtual/">Consulta de Solicitud</a>
                            <hr>
                            ${FOOTER}
                        </body>
                        </html>`,
                subject:"CIUNAC - CONFIRMACIÓN DE REGISTRO PARA SOLICITUD DE CERTIFICADO O CONSTANCIA",
                text:`Este es el codigo de su transacción: ${body.user}`
            }
    }
    
}