import { NextRequest, NextResponse } from "next/server";
import { SEDE_JORNADA } from "../(libs)/constants";
import { getCurretDate_YYYYMMDD } from "../(libs)/util";

type Periodo = {
    Consegutivo : number,
    Nombre : string,
    Fecha_inicio : string,
    Fecha_fin : string,
    Ordenamiento : number,
    Estado: boolean
}

export async function POST(request:NextRequest)
{
    const body = await request.json();
    body.Direccion = 'Lima';
    body.Lugar_nacimiento = '15001';
    body.Lugar_residencia = '15001';
    body.Consecutivo_sedejornada = SEDE_JORNADA;
    body.Consecutivo_periodo = await getPeriod();

    //return NextResponse.json(body);
    
    try{
        const res = await fetch('https://api.q10.com/v1/estudiantes', {
            method: 'POST',
            body: JSON.stringify(body),
            // Request headers
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache',
                'Api-Key': process.env.API_KEY_Q10 || ''
            }
        })
        const data = await res.json();
        //console.log(data);

        //Registrar estudiante
        const register = await registerStudentToProgram(data.Codigo_estudiante, data.Numero_identificacion); 
        if(!register) return NextResponse.json({message:"error"});
        
        return NextResponse.json({register:register, data:data});
    }catch(error){
        return NextResponse.json({error:error});
    }    
    
}
async function registerStudentToProgram(code:string,dni:string){
    
    const body = {
        Codigo_estudiante: code,
        Consecutivo_inscripcion: await getRegister(code),
        Codigo_matricula: dni, //dni de alumno
        Fecha_matricula: getCurretDate_YYYYMMDD(), //fecha actual
        Consecutivo_periodo: await getPeriod(), //buscar el ultimo periodo
        Consecutivo_sede_jornada: SEDE_JORNADA,
        Codigo_nivel: "01",
        Consecutivo_grupo: '',
        Formalizada: true,
        Codigo_condicion_matricula: "N",
        Observaciones: ''
    };

    try{
        const res = await fetch('https://api.q10.com/v1/matriculasProgramas', {
            method: 'POST',
            body: JSON.stringify(body),
            // Request headers
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache',
                'Api-Key': process.env.API_KEY_Q10 || ''
            }
        })
        const data = await res.json();
        console.log(data);
        return data;
    }catch(error){
        console.log(error);
        return null
    }
}


/**
 * Retrieves the Consecutivo_inscripcion value of the first item in the
 * response data from the Q10 API. If an error occurs during the request,
 * it logs the error and returns 0.
 * @param {string} code Codigo_estudiante to query
 * @returns {Promise<number>} Consecutivo_inscripcion value of the first item in the sorted list
 */
async function getRegister(code:string):Promise<number>
{    
    try{
        const res = await fetch(`https://api.q10.com/v1/inscripciones?Codigo_estudiante=${code}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache',
                'Api-Key': process.env.API_KEY_Q10 || ''
            }
        })
        const data = await res.json();
        //Return Consecutivo_inscripcion value of the first item in the sorted list
        return data[0].Consecutivo_inscripcion;
    }catch(error){
        console.log(error);
        return 0
    }
}

/**
 * This function retrieves a list of periods from the Q10 API. It then sorts the
 * response data in descending order by the Ordenamiento field and returns the
 * Consecutivo value of the first item in the sorted list. If an error occurs
 * during the request, it logs the error and returns 0.
 * @returns {Promise<number>} Consecutivo value of the first period in the sorted list
 */
async function getPeriod():Promise<number>
{
    try{
        const res = await fetch('https://api.q10.com/v1/periodos?Limit=30', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache',
                'Api-Key': process.env.API_KEY_Q10 || ''
            }
        })
        const data = await res.json();
        // sorts the response data in descending order by the Ordenamiento field
        const sortedItems = data.sort((a:Periodo, b:Periodo) => b.Ordenamiento - a.Ordenamiento);
        //Return Consecutivo value of the first period in the sorted list
        return sortedItems[0].Consecutivo;
    }catch(error){
        console.log(error);
        return 0;
    }
}