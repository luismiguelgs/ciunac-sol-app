import { firestore } from '@/lib/firebase';
import { collection, doc, getDoc, getDocs, query, where, Timestamp } from 'firebase/firestore'
import { Icertificado, IcertificadoDetalle } from '@/modules/consulta-certificado/interfaces/certificado.interface';

export enum Collection{
    Certificados = 'registro_certificados',
    CertificadosDetalle = 'registro_certificados_detalle'
}

export default class CertificadosService
{
    // Funciones Generales *************************************
    private static db(collectionName: Collection){
        return collection(firestore, collectionName)
    }
    
    public static async selectItem(id:string):Promise<Icertificado | undefined>
    {
        const docRef = doc(firestore, Collection.Certificados, id)
        try{
            const snapShot = await getDoc(docRef)
            if(snapShot.exists()){
                const data = snapShot.data()
                return {
                    ...data,
                    id: snapShot.id,
                    fecha_emision: (data.fecha_emision as Timestamp).toDate(),
                    fecha_conclusion: (data.fecha_conclusion as Timestamp).toDate(),
                } as Icertificado
            }
        }catch(err){
            if (err instanceof Error) {
                console.error(err.message);
            } else {
                console.error("An unknown error occurred");
            }
            return undefined
        }
    }
    //Calificaciones Detalle - funciones ************************
    public static async fetchItemsDetail(itemId: string):Promise<IcertificadoDetalle[]>{
        try{
            const q = query(this.db(Collection.CertificadosDetalle),where('id_certificado','==',itemId))
            const snapShot = await getDocs(q)
            
            const data = snapShot.docs.map((item)=>{
                return{
                    ...item.data(),
                    id: item.id,
                } as IcertificadoDetalle
            })
            return data
        }
        catch(err){
            if (err instanceof Error) {
                console.error(err.message);
            } else {
                console.error("An unknown error occurred");
            }
            throw err
        }
    }
}