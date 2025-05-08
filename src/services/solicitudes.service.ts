import Isolicitud from '@/interfaces/solicitud.interface';
import { firestore } from '@/lib/firebase';
import { obtenerPeriodo } from '@/lib/utils';
import { collection, query, where, orderBy, getDocs, Timestamp, serverTimestamp, addDoc } from 'firebase/firestore';

export default class SolicitudesService 
{
    private static db = collection(firestore, 'solicitudes')
    private static db_prospectos = collection(firestore, 'prospectos')
    
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
    public static async newItem(data:Isolicitud):Promise<string>
    {
        const dataProspecto = {
            dni: data.dni,
            nombres: data.nombres.toLocaleUpperCase().trim(),
            apellidos: data.apellidos.toLocaleUpperCase().trim(),
            telefono: data.celular.trim(),
            facultad : data.facultad,
            escuela: data.escuela || '',
            email: data.email,
            codigo: data.codigo || '',
            trabajador : data.trabajador,
            alumno_ciunac : data.alumno_ciunac || false,
            creado: serverTimestamp(),
            modificado : serverTimestamp()
        }
        
        let docRef = null
        try{
			console.log(dataProspecto);
			
          	docRef = await addDoc(this.db_prospectos, dataProspecto)
        }catch(err){
          console.log(err);
        }
        let newID = null

        if(docRef) newID = docRef.id;
        if(docRef){
            const dataSolicitud = {
                solicitud: data.tipo_solicitud,
                apellidos: data.apellidos.toLocaleUpperCase().trim(),
                nombres: data.nombres.toLocaleUpperCase().trim(),
                periodo : obtenerPeriodo(),
                estado:'NUEVO',
                dni:data.dni,
                pago:+data.pago,
                idioma:data.idioma,
                tipo_trabajador: data.tipo_trabajador || '',
                nivel:data.nivel,
                img_dni: data.img_dni,
                img_cert_trabajo: data.trabajador ? data.img_cert_trabajo : '',
                img_cert_estudio: data.alumno_ciunac ? data.img_cert_estudio : '',
                img_voucher: data.img_voucher,
                numero_voucher:data.numero_voucher || '',
                fecha_pago: data.fecha_pago || '',
                manual:false,
		        trabajador: data.trabajador,
                alumno_id: newID,
                certificado_trabajo: data.certificado_trabajo || '',
                creado:serverTimestamp(),
                modificado:serverTimestamp()
            }
            console.log(dataSolicitud);
		
            try{
              const docRef1 = await addDoc(this.db, dataSolicitud)
              return docRef1.id         
            }catch(err){
              console.log(err);
            }            
        } 
        return ''
    }
}