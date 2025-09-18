import IcronogramaExam from '../interfaces/cronograma-exam.interface';
import { firestore } from '@/lib/firebase';
import { collection, doc, updateDoc, serverTimestamp, addDoc, deleteDoc, getDoc, getDocs } from 'firebase/firestore'

enum CRUD {
    CREATE = 'create',
    READ = 'read',
    UPDATE = 'update',
    DELETE = 'delete'
}

export default class CronogramaExamService
{
    private static dataCollection = 'cronograma_examenes'
    private static db = collection(firestore, this.dataCollection)

    public static async getAll(): Promise<IcronogramaExam[] | undefined> 
    {
        try{
            const snapShot = await getDocs(this.db);
            const data = snapShot.docs.map((item) => {
                const rawData = item.data();
                return {
                    ...rawData,
                    id: item.id,
                    date: rawData.date?.toDate ? rawData.date.toDate() : null, // Verifica si tiene .toDate()
                    createAt: rawData.createAt?.toDate ? rawData.createAt.toDate().toLocaleString() : null,
                    updateAt: rawData.updateAt?.toDate ? rawData.updateAt.toDate().toLocaleString() : null,
                } as IcronogramaExam;
            });
        
            return data
        }
        catch(err){
            this.errorHandler(err, CRUD.READ)
        }
    }

    public static async getById(id: string): Promise<IcronogramaExam | undefined> 
    {
        try{
            const docRef = doc(firestore, this.dataCollection, id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                return { ...docSnap.data(), id: docSnap.id } as IcronogramaExam;
            }
        }
        catch(err){
            this.errorHandler(err, CRUD.READ)
        }
    }

    public static async create(obj: IcronogramaExam): Promise<undefined | string> {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id , isNew , date, ...rest } = obj
        
        let fechaTimestamp:Date | null = null
        if(date){
            const fecha = new Date(date)
            if(!isNaN(fecha.getTime())){
                fechaTimestamp = fecha
            }else{
                console.error('Fecha no válida')
                throw new Error('Fecha no válida')
            }
        }

        const data = {
            ...rest,
            date: fechaTimestamp,
            createAt: serverTimestamp(),
            updateAt: serverTimestamp()
        }

        let docRef = null
        try{
            docRef = await addDoc(this.db, data)
            console.info('Elemento creado correctamente', docRef.id)
            return docRef.id
        }catch(err){
            this.errorHandler(err, CRUD.CREATE)
        }
    }

    public static async update(id: string, obj: IcronogramaExam): Promise<void> {
        delete obj.isNew
        delete obj.createAt
        // Convertir las fechas en cadena a timestamps, si aplica
        const { date, ...rest } = obj;
        let fechaTimestamp: Date | null = null;        

        if (date) {
            const fecha = new Date(date);
            if (!isNaN(fecha.getTime())) {
                fechaTimestamp = fecha; // Es una fecha válida
            } else {
                console.error('La fecha proporcionada no es válida:', date);
                throw new Error('Fecha inválida');
            }
        }

        const dataToUpdate = doc(firestore, this.dataCollection, id);
      
        try {
            await updateDoc(dataToUpdate, {
                ...(rest.active !== undefined && { active: rest.active }), // Si active existe, lo incluye
                ...(rest.period && { period: rest.period }), // Si period no es nulo ni undefined, lo incluye
                ...(fechaTimestamp && { date: fechaTimestamp }), // Si fecha es válida, la incluye
                updateAt: serverTimestamp(), // Siempre actualiza updateAt
            });
            console.log('Elemento actualizado correctamente');
        } catch (err) {
            this.errorHandler(err, CRUD.UPDATE)
        }
    }
    public static async updateStatus(id: string, status: boolean): Promise<void> {
        const dataToUpdate = doc(firestore, this.dataCollection, id);
        try {
            await updateDoc(dataToUpdate, {
                active: status,
                updateAt: serverTimestamp(),
            });
            console.info('Elemento actualizado correctamente');
        } catch (err) {
            this.errorHandler(err, CRUD.UPDATE)
        }
    }

    public static async delete(id: string): Promise<void> {
        try{
            await deleteDoc(
                doc(firestore,this.dataCollection,id as string)
            );
            console.log('registro borrado', id)
        }
        catch(err){
           this.errorHandler(err, CRUD.DELETE)
        }
    }
    private static errorHandler(err: unknown, operation:string): void {
        if (err instanceof Error) {
            switch (operation){
                case CRUD.CREATE:
                    console.error('Error al crear el elemento:', err.message); 
                    break;
                case CRUD.UPDATE:
                    console.error('Error al actualizar el elemento:', err.message);
                    break;
                case CRUD.DELETE:
                    console.error('Error al borrar el elemento:', err.message);
                    break;
                case CRUD.READ:
                    console.error('Error al cargar el elemento:', err.message);
                    break;
            }
        } else {
            console.error('Error desconocido al actualizar el elemento:', err);
        }
        throw err
    }
}
