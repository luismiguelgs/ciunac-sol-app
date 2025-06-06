import {z} from "zod";

const msg = {
	required: "El campo es requerido",
	invalid: (n:number) => `Campo debe tener ${n} digitos`,
}

export const basicInfoSchema = z.object({
    tipo_solicitud: z.string().min(2,msg.required).trim(),
    apellidos: z.string().min(2,msg.required).trim(),
    nombres: z.string().min(2,msg.required).trim(),
    idioma: z.string().min(2,msg.required).trim(),
    nivel : z.string().min(2,msg.required).trim(),
    tipo_documento: z.enum(["PE01","PE02","PE03"]),
    celular: z.string().min(9,msg.required).max(9, msg.invalid(9)).trim(),
    dni: z.string().min(8,msg.required).trim(),
    //opcionales
    estudiante: z.boolean().optional(),
    facultad: z.string().trim(),
    escuela: z.string().trim(),
    codigo: z.string().trim(),
   
}).superRefine((data, ctx) => {
    const reqLength = data.tipo_documento === "PE01" ? 8 : 9;
    if(data.dni.length !== reqLength) ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: msg.invalid(reqLength),
        path: ["dni"]
    });
    
    // Check if estudiante is true and validate facultad, escuela, and codigo
    if (data.estudiante) {
        if (!data.facultad) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: msg.required,
                path: ["facultad"]
            });
        }
        if (!data.escuela) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: msg.required,
                path: ["escuela"]
            });
        }
        if (!data.codigo) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: msg.required,
                path: ["codigo"]
            });
        }
    }
});

export type IBasicInfoSchema = z.infer<typeof basicInfoSchema>;

export const initialValues:IBasicInfoSchema = {
    tipo_solicitud: "",
    idioma: "",
    nivel: "",
    apellidos: "",
    nombres: "",
    facultad: "",
    estudiante: false,
    escuela: "",
    codigo: "",
    tipo_documento: "PE01",
    dni: "",
    celular: "",
}
