export interface Itexto{
    id?:string,
    titulo:string,
    texto:string,
    creado?:string,
    modificado?:string
}
interface Ibase {
    id?:string,
    value:string,
    label:string,
    creado?:string,
    modificado?:string
}
export type Ifacultad = Ibase
export type Icurso = Ibase 
export interface ITipoSolicitud extends Ibase{
    precio: number
}

export interface Irow{
    id:number,
    ciclo:string,
    mes:string,
    anno:string,
    profesor?:string
}
export interface IformData{
    ciclo:string,
    mes:string,
    anno:string,
    profesor:string
}