import { firestore } from '@/lib/firebase';
import { collection, doc, getDocs, query, where, Timestamp, updateDoc, serverTimestamp } from 'firebase/firestore';
import { Icertificado } from '../interfaces/certificado.interface';

export enum Collection{
    Certificados = 'registro_certificados',
    CertificadosDetalle = 'registro_certificados_detalle'
}

export default class CertificadosService {
    private static db(collectionName: Collection){
        return collection(firestore, collectionName)
    }

    // Busca un certificado por id_solicitud y retorna un único item (o null si no existe)
    public static async selectItemBySolicitud(id_solicitud: string): Promise<Icertificado | null> {
        try {
            const q = query(
                this.db(Collection.Certificados),
                where('id_solicitud', '==', id_solicitud)
            )
            const querySnapshot = await getDocs(q)
            if (querySnapshot.empty) return null

            const docSnap = querySnapshot.docs[0]
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const data = docSnap.data() as any

            if (data.creado instanceof Timestamp) data.creado = data.creado.toDate()
            if (data.modificado instanceof Timestamp) data.modificado = data.modificado.toDate()
            if (data.fecha_emision instanceof Timestamp) data.fecha_emision = data.fecha_emision.toDate()
            if (data.fecha_conclusion instanceof Timestamp) data.fecha_conclusion = data.fecha_conclusion.toDate()
            if (data.fecha_aceptacion instanceof Timestamp) data.fecha_aceptacion = data.fecha_aceptacion.toDate()

            return {
                ...data,
                id: docSnap.id,
            } as Icertificado
        } catch (err) {
            if (err instanceof Error) {
                console.error('Error al buscar por id_solicitud:', err.message)
            } else {
                console.error('Error desconocido al buscar por id_solicitud:', err)
            }
            return null
        }
    }

    public static async updateStatus(collectionName: Collection, id:string, aceptacion: boolean):Promise<void>
    {
        const docRef = doc(firestore, collectionName, id)
        try{
            await updateDoc(docRef, {
                aceptacion: aceptacion,
                modificado: serverTimestamp()
            })
        }catch(err){
            if (err instanceof Error) {
                console.error('Error al actualizar el elemento:', err.message);
            } else {
                console.error('Error desconocido al actualizar el elemento:', err);
            }
        }
    }
}