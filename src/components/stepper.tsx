"use client";

import React from "react";
import { Button } from "@/components/ui/button"

// Definir las props que el componente Stepper recibirá
interface StepperProps {
    steps: string[]; // Array de las etiquetas de cada paso
    children: React.ReactNode[]; // El contenido de cada paso
    activeStep: number; // El paso actual
}

export const Stepper: React.FC<StepperProps> = ({ steps, children, activeStep}) => {
    
    return (
        <div className="w-full max-w-5xl mx-auto p-2">
            {/* Encabezado del Stepper */}
            <div className="flex justify-center items-center relative w-full px-2 md:px-4">
                <div className="grid grid-cols-3 w-full max-w-2xl gap-4">
                    {steps.map((label, index) => (
                    <div key={index} className="flex flex-col items-center relative">
                        {/* Círculo del paso */}
                        <div
                        className={`w-8 md:w-10 h-8 md:h-10 flex items-center justify-center rounded-full border-2 
                            ${index <= activeStep ? "bg-primary border-primary text-primary-foreground" : "bg-background border-muted-foreground text-muted-foreground"}`}
                        >
                        {index + 1}
                        </div>
                        <span className="mt-2 text-xs md:text-sm text-center">{label}</span>
                        {/* Connecting line */}
                        {index < steps.length - 1 && (
                            <div 
                                className={`absolute top-4 md:top-5 left-[calc(50%+1.5rem)] md:left-[calc(50%+2rem)] w-[calc(100%-2rem)] md:w-[calc(100%-3rem)] h-[2px] 
                                    ${index < activeStep ? "bg-primary" : "bg-border"}`}
                            />
                        )}
                    </div>
                    ))}
                </div>
            </div>

            {/* Contenido del paso actual */}
            <div className="mt-8 p-4 border rounded">
                {children[activeStep]}
            </div>           
        </div>
    );
};

interface StepperControlProps {
    activeStep: number;
    steps: string[];
    setActiveStep: React.Dispatch<React.SetStateAction<number>>;
    type?: "button" | "submit";
    disabled?: boolean; 
}

export function StepperControl({ activeStep, steps, setActiveStep, type = "button" , disabled=false}: StepperControlProps) {
    const handleNext = () => {
        if (type === "button") {
            setActiveStep(prev => prev + 1);
        }
        // If type is submit, the form's onSubmit handler will handle the step change
    }

    return (
        <div className="mt-8 flex justify-between">
            <Button
                onClick={() => setActiveStep(prev => prev - 1)}
                disabled={activeStep === 0 || disabled}
                variant="outline"
                type="button"
            >
                Anterior
            </Button>
            <Button
                onClick={type === "button" ? handleNext : undefined}
                disabled={disabled}
                type={type}
            >
                {activeStep === steps.length - 1 ? "Finalizar" : "Siguiente"}
            </Button>
        </div>
    )
}