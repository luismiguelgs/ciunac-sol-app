import { firestore } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore'
import { Iexamen, IexamenNotas } from '../interfaces/examen.interface';

export default class SolicitudesExamenService
{
    private static db_examenes = collection(firestore, 'examenes')
    private static db_notas = collection(firestore, 'notas_ubicacion')

    //Examenes - funciones ****************************************
    public static async fetchItems():Promise<Iexamen[]>{
        try{
            const snapShot = await getDocs(this.db_examenes)
            const data = snapShot.docs.map((item)=>{
                return{
                    ...item.data(),
                    id: item.id,
                    fecha_examen: item.data().fecha_examen ? new Date(item.data().fecha_examen.seconds * 1000) : null,
                    fecha_final: item.data().fecha_final ? new Date(item.data().fecha_final.seconds * 1000) : null,
                    creado: item.data().creado ? new Date(item.data().creado.seconds * 1000) : null,
                    modificado: item.data().modificado ? new Date(item.data().modificado.seconds * 1000) : null,
                } as Iexamen
            })
            return data
        }
        catch(err){
            if (err instanceof Error) {
                console.error('Error al actualizar el elemento:', err.message);
            } else {
                console.error('Error desconocido al actualizar el elemento:', err);
            }
            throw err
        }
    }
    //Calificaciones Detalle - funciones ************************
    public static async fetchItemsDetail(dni: string):Promise<IexamenNotas[]>
    {
        console.info('fetchItemsDetail', dni)
        try{
            const q = query(this.db_notas,where('dni','==',dni))
            const snapShot = await getDocs(q)
            
            const data = snapShot.docs.map((item)=>{
                return{
                    ...item.data(),
                    id: item.id,
                } as IexamenNotas
            })
            return data
        }
        catch(err){
            if (err instanceof Error) {
                console.error('Error al actualizar el elemento:', err.message);
            } else {
                console.error('Error desconocido al actualizar el elemento:', err);
            }
            throw err
        }
    }
}