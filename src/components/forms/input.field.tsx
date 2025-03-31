'use client'
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "../ui/input";
import React from "react";

interface Props extends React.InputHTMLAttributes<HTMLInputElement>{
    name: string;
	placeholder?: string;
	type?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
	control: any;
	disabled?: boolean;
	inputRef?: React.RefObject<HTMLInputElement>
	label: string;
	description?: string;	
}

export default function InputField({ control, type='text', disabled=false, inputRef, label, description, name, placeholder }: Props)
{
    return (
        <>
            <FormField
                control={control}
                name={name}
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                        <Input 
                            {...field} 
                            type={type}
                            placeholder={placeholder} 
                            disabled={disabled} 
                            ref={inputRef} 
                        />
                    </FormControl>
                    <FormDescription>{description}</FormDescription>
                    <FormMessage />
                    </FormItem>
                )}
            />
        </>
    )
}