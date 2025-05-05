'use client'

import useSubjects from "@/hooks/useSubjects";
import Isolicitud from "@/interfaces/solicitud.interface";
import { NIVEL } from "@/lib/constants";

export default function Subjects({item}:{item: Isolicitud})
{
    const data = useSubjects();
    const subject = data?.find(subject => subject.value === item.idioma)?.label;
    const level = NIVEL?.find(nivel => nivel.value === item.nivel)?.label;
    
    return (
        <p className="text-md text-muted-foreground">
            Idioma: <span className="font-medium">{ subject }</span>{' '}
            Nivel: <span className="font-medium">{level}</span>
        </p>
    )
}