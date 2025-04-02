export interface Iexamen{
    id?:string,
    salon: string,
    codigo: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fecha_examen: any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fecha_final: any,
    idioma: string,
    nivel: string,
    profesor_id: string,
    profesor?: string,
    estado: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    hora_inicial?: any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    hora_final?: any,
    calificacion_id: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    creado?: any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    modificado?: any
}
export interface IexamenNotas{
    id?: string,
    examen_id: string,
    solicitud_id:string,
    idioma: string,
    nivel: string,
    apellidos: string,
    nombres: string,
    dni: string,
    numero_voucher: string,
    monto: number,
    nota: number,
    ubicacion: string,
    terminado: boolean,
}