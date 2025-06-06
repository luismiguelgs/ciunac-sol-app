import { Itexto, Ifacultad, ITipoSolicitud, Icurso } from '@/interfaces/types.interface'
import { firestore } from '@/lib/firebase';
import { collection, getDocs, Timestamp } from 'firebase/firestore';

type CollectionType = Itexto | Ifacultad | Icurso | ITipoSolicitud;
type CollectionName = 'textos' | 'facultades' | 'cursos' | 'certificados'

export default class TypesService
{
    public static async fetchTypes<T extends CollectionType>(collectionName:CollectionName):Promise<T[]>
    {
        try{
            const data = await getDocs(collection(firestore, collectionName))
            const result: T[] = []
            data.forEach((doc)=>{
                result.push({
                    ...doc.data(),
                    id: doc.id,
                    creado: doc.data().creado ? (doc.data().creado as Timestamp).toDate() : null,
                    modificado: doc.data().modificado ? (doc.data().modificado as Timestamp).toDate() : null
                } as unknown as T)
            }) 
            return result
        }
        catch(error){
            console.error("Error al obtener documentos", error)
            throw error
        }
    }
}