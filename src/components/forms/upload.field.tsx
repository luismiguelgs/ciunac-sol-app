// components/FileUploaderCard.tsx
"use client";

import { useRef, useState } from "react";
import { useFormContext, Controller } from "react-hook-form";
import {
  	ref,
  	uploadBytesResumable,
  	getDownloadURL,
} from "firebase/storage";
import { storage } from "@/lib/firebase";
import {
  	Card,
  	CardContent,
  	CardHeader,
  	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { LucideIcon, Upload } from "lucide-react";

interface FileUploaderCardProps {
	name: string;
	label?: string;
	icon: LucideIcon
	dni: string | undefined;
	folder?: string | undefined;
}

export const FileUploaderCard = ({ name, label, icon:Icon, dni, folder='becas' }: FileUploaderCardProps) => {
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [uploading, setUploading] = useState(false);
	const [progress, setProgress] = useState(0);
	const { control, setValue } = useFormContext();

	const handleFileSelect = () => {
		fileInputRef.current?.click();
	};

  	const handleUpload = (file: File, onChange: (url: string) => void) => {
    
		if (folder === 'becas' && file.type !== "application/pdf") {
		alert("Solo se permiten archivos PDF.");
		return;
		}
	
		if (folder !== 'becas' && !["application/pdf", "image/jpeg", "image/png"].includes(file.type)) {
		alert("Solo se permiten archivos PDF, JPG y PNG.");
		return;
		}
		
		const extension = file.name.split('.').pop();
		const filename = `${dni}-${name}.${extension}`;
		const storageRef = ref(storage, `${folder}/${filename}`);
		const uploadTask = uploadBytesResumable(storageRef, file);

		setUploading(true);
		setProgress(0);

		uploadTask.on(
			"state_changed",
			(snapshot) => {
				const percent = Math.round(
				(snapshot.bytesTransferred / snapshot.totalBytes) * 100
				);
				setProgress(percent);
			},
			(error) => {
				console.error("Error al subir:", error);
				setUploading(false);
			},
			async () => {
				const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
				onChange(downloadURL);
				setValue(name, downloadURL);
				setUploading(false);
				setProgress(100);
			}
		);
  	};

	const handleDisabled = ():boolean => {
		if (folder === 'dni') {
			return uploading || String(dni).length < 8
		}else{
			return uploading
		}
	}

	return (
		<Controller
		control={control}
		name={name}
		render={({ field: { value, onChange }, fieldState: { error } }) => (
			<Card className="w-full">
			{(label) && (
				<CardHeader className="flex flex-row items-center gap-2">
					{Icon && <Icon className="h-5 w-5 text-muted-foreground" />}
					<CardTitle className="text-base">{label}</CardTitle>
				</CardHeader>
			)}
			<CardContent className="flex flex-col gap-1">
				<input
					type="file"
					ref={fileInputRef}
					accept={folder === 'becas' ? ".pdf" : ".pdf, .jpg, .jpeg, .png"}
					onChange={(e) => {
						const file = e.target.files?.[0];
						if (file) handleUpload(file, onChange);
					}}
					className="hidden"
				/>

				<Button type="button" onClick={handleFileSelect} disabled={handleDisabled()}>
					<Upload className="w-4 h-4 mr-2" />
					{uploading ? "Subiendo..." : value ? "Reemplazar documento" : "Subir documento"}
				</Button>

				{uploading && <Progress value={progress} className="h-2" />}

				{value && !uploading && (
				<p className="text-sm text-green-600">
					Archivo cargado:{" "}
					<a href={value} target="_blank" className="underline" rel="noopener noreferrer">
					Ver archivo
					</a>
				</p>
				)}

				{error && <p className="text-sm text-red-600">{error.message}</p>}
			</CardContent>
			</Card>
		)}
		/>
	);
};
