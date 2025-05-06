'use client'

export enum DocumentType {
    PE01 = "PE01", //DNI
    PE02 = "PE02" //CE
}
export const DocumentTypeMap: Record<DocumentType, string> = {
    [DocumentType.PE01]: "DNI",
    [DocumentType.PE02]: "C.E."
}
export enum Gender {
    F = "F", //Femenino
    M = "M" //Masculino
}
export const GenderTypeMap: Record<Gender, string> = {
    [Gender.F]: "FEMENINO",
    [Gender.M]: "MASCULINO"
}

export const NIVEL = [
    {value:'BASICO',label:'BÁSICO'},
    {value:'INTERMEDIO',label:'INTERMEDIO'},
    {value:'AVANZADO',label:'AVANZADO'},
]

export const ESCUELAS = [
    {value:'ENFERMERIA',label:'E.PROFESIONAL DE ENFERMERIA', facultad: 'FCS'},
    {value:'ADMINISTRACION',label:'E.PROFESIONAL DE ADMINISTRACIÓN', facultad: 'FCA'},
    {value:'CONTABILIDAD',label:'E. PROFESIONAL DE CONTABILIDAD', facultad: 'FCC'},
    {value:'ECONOMIA',label:'E.PROFESIONAL DE ECONOMÍA', facultad: 'FCE'},
    {value:'ELECTRICA',label:'E.PROFESIONAL DE INGENIERÍA ELÉCTRICA', facultad: 'FIEE'},
    {value:'ELECTRONICA',label:'E.PROFESIONAL DE INGENIERÍA ELECTRÓNICA', facultad: 'FIEE'},
    {value:'INDUSTRIAL',label:'E.PROFESIONAL DE INGENIERÍA INDUSTRIAL', facultad: 'FIIS'},
    {value:'SISTEMAS',label:'E.PROFESIONAL DE INGENIERÍA DE SISTEMAS', facultad: 'FIIS'},
    {value:'MECANICA',label:'E.PROFESIONAL DE INGENIERÍA MECÁNICA', facultad: 'FIME'},
    {value:'ENERGIA',label:'E.PROFESIONAL DE INGENIERÍA EN ENERGÍA', facultad: 'FIME'},
    {value:'AMBIENTAL',label:'E.PROFESIONAL DE INGENIERÍA AMBIENTAL Y RECURSOS NATURALES', facultad: 'FIARN'},
    {value:'FISICA',label:'E.PROFESIONAL DE FÍSICA', facultad: 'FCNM'},
    {value:'MATEMATICA',label:'E.PROFESIONAL DE MATEMÁTICA', facultad: 'FCNM'},
    {value:'DATOS',label:'E.PROFESIONAL DE CIENCIA DE DATOS', facultad: 'FCNM'},
    {value:'QUIMICA',label:'E.PROFESIONAL DE INGENIERÍA QUÍMICA', facultad: 'FIQ'},
    {value:'PESQUERA',label:'E.PROFESIONAL DE INGENIERÍA PESQUERA', facultad: 'FIPA'},
    {value:'ALIMENTOS',label:'E.PROFESIONAL DE INGENIERÍA DE ALIMENTOS', facultad: 'FIPA'},
    {value: 'EDUCACION_FISICA', label: 'E.PROFESIONAL DE EDUCACIÓN FÍSICA', facultad: 'FCED'},    
]