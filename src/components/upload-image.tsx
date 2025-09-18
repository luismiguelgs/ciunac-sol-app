'use client'
import React from 'react'
import { Card, CardContent } from './ui/card'
import { UseFormReturn } from 'react-hook-form'
import { isPdf } from '@/lib/utils'
import Image from 'next/image'
import { FileUploaderCard } from './forms/upload.field'
import { CloudUpload } from 'lucide-react'

type Props = {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
    form: UseFormReturn<any>;
    field: string;
    label: string;
    dni: string;
    folder: string;
}

export default function UploadImage({form,field, label, dni, folder}:Props) 
{
    return (
        <div>
			<Card className='mb-2'>
				<CardContent className="flex justify-center items-center p-4">
				{
					form.watch(field) ? (
						<React.Fragment>
							{
                                isPdf(form.watch(field) as string) ? (
								    <Image
									    src={'/images/pdf.png'}
									    width={250}
									    height={250}
									    alt={label}
									    className="rounded-md object-contain h-[250px]"
								    />
							    ):(
									<Image
										src={form.watch(field) ?? '/images/upload.svg'}
										width={250}
										height={250}
										alt={label}
										className="rounded-md object-contain h-[250px]"
									/>
								)
                            }
						</React.Fragment>
					):(
						<React.Fragment>
							<Image
								src={'/images/upload.svg'}
								width={250}
								height={250}
								alt={label}
								className="rounded-md object-contain h-[250px]"
							/>
						</React.Fragment>
					)
				}
				</CardContent>
			</Card>
			<FileUploaderCard
                name={field}
                label={label}
                dni={dni}
				folder={folder}
                icon={CloudUpload}
            />
		</div>
    )
}
