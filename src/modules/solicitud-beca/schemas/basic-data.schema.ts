import {z} from "zod";

const msg = {
	required: "El campo es requerido",
	invalid: (n:number) => `Campo debe tener ${n} digitos`,
}

export const basicInfoSchema = z.object({
    apellidos: z.string().min(2,msg.required).trim(),
    nombres: z.string().min(2,msg.required).trim(),
    facultad: z.string().min(1,msg.required).trim(),
    escuela: z.string().min(1,msg.required).trim(),
    codigo: z.string().min(1,msg.required).trim(),
    tipo_documento: z.enum(["PE01","PE02"]),
    direccion: z.string().trim(),
    celular: z.string().min(9,msg.required).max(9, msg.invalid(9)).trim(),
    dni: z.string().trim()
}).superRefine((data, ctx) => {
	const reqLength = data.tipo_documento === "PE01" ? 8 : 9;
	if(data.dni.length !== reqLength) ctx.addIssue({
		code: z.ZodIssueCode.custom,
		message: msg.invalid(reqLength),
		path: ["dni"]
	})	
})

export type IBasicInfoSchema = z.infer<typeof basicInfoSchema>;

export const initialValues:IBasicInfoSchema = {
    apellidos: "",
    nombres: "",
    facultad: "",
    escuela: "",
    codigo: "",
    tipo_documento: "PE01",
    direccion: "",
    dni: "",
    celular: "",
}
