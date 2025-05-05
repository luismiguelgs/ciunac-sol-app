import React from 'react';
import {storage } from '@/lib/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

export default class StorageService
{
    public static async uploadDocument(
		name: string, 
		data:Blob, 
		setEnviar:React.Dispatch<React.SetStateAction<boolean>>, 
      	setProgress:React.Dispatch<React.SetStateAction<number>>, 
      	ubicacion:string, 
	): Promise<string | null>
  	{
		return new Promise((resolve, reject) => {
			const storageRef = ref(storage, `${ubicacion}/${name}`);
			const uploadTask = uploadBytesResumable(storageRef, data);

			uploadTask.on('state_changed', (snapshot)=>{
				const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
				setProgress(progress)
			},
			(error)=>{
				console.log(error.message);
				reject(error)
			},
			async ()=>{
				try{
					const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
					setEnviar(false)
					console.log('Archivo disponible en... ', downloadUrl);
					resolve(downloadUrl);
				}catch(err){
					console.error("Error al obtener el URL", err);
					reject(err)
				}
			});
		});
	}
}
