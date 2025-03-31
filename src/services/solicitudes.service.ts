import { firestore } from '@/lib/firebase';
import { collection, query, where, orderBy, getDocs, Timestamp } from 'firebase/firestore';

export default class SolicitudesService 
{
    private static db = collection(firestore, 'solicitudes')
    
    public static async searchItemByDni(dni:string){
		
        const q = query(
            this.db,
            where('dni','==',dni) , 
            orderBy('creado','desc')
        )
        // Obtenemos los documentos que cumplen la consulta
        const  querySnapshot = await getDocs(q)

        // Devolvemos un array con los datos de los documentos, incluyendo el ID
        return querySnapshot.docs.map((doc) => {
            const data = doc.data();
            // Agregamos el campo 'id' al objeto data
            data.creado = (data.creado as Timestamp).toDate();
			data.modificado = (data.modificado as Timestamp).toDate();
            data.id = doc.id;
            return data;
        });
    }
}