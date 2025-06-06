import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getFileExtension(url: string): string | null {
	const match = url.match(/\.([a-zA-Z0-9]+)(?=\?|$)/);
	return match ? match[1] : null;
}
export function obtenerPeriodo()
{
    const fechaActual = new Date();
    const mes = fechaActual.getMonth() + 1; // Los meses en JavaScript van de 0 a 11, por lo que sumamos 1 para obtener el mes actual
    const año = fechaActual.getFullYear();

    // Formatear los valores para que tengan dos dígitos si es necesario
    const mesFormateado = String(mes).padStart(2, '0');

    return `${String(año)}${mesFormateado}`
}
export const isPdf = (url:string):boolean=>{
	const path = url.split("/o/")[1];
	const decodedPath = decodeURIComponent(path.split("?")[0]);
	const fileName = decodedPath.split("/").pop();
	return fileName?.endsWith('.pdf')?? false;
}