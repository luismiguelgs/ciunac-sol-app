import { ICertificado } from '@/modules/consulta-certificado/interfaces/certificado.interface';
import { apiFetch } from '@/lib/api.service';

export default class CertificadosService
{
    private static collection = 'certificados'
    
    public static async selectItem(id:string):Promise<ICertificado | undefined>
    {
       const response = await apiFetch<ICertificado>(`${this.collection}/${id}`, 'GET')
       return response
    }
}