import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { basicInfoSchema, IBasicInfoSchema, initialValues } from "../schemas/basic-data.schema"
import { Form } from "@/components/ui/form"
import { StepperControl } from "@/components/stepper"
import InputField from "@/components/forms/input.field"
import { RadioGroupField } from "@/components/forms/radio-group.field"
import { useMask } from '@react-input/mask';
import useStore from "../stores/solicitud.store"
import SelectFacultad from "@/components/forms/select-facultad.field"
import { MySelect } from "@/components/forms/myselect.field"
import { ESCUELAS } from "@/lib/constants" // Asumiendo que ESCUELAS tiene { value: string, label: string, facultad: string }[]
import React from "react" // Importa React para useEffect

type Props = {
    activeStep : number
    steps : string[]
    setActiveStep: React.Dispatch<React.SetStateAction<number>>
    handleNext: (values:IBasicInfoSchema) => void
}

export default function BasicData({activeStep, handleNext, steps, setActiveStep}:Props)
{
    const { solicitud } = useStore();
    const phoneRef = useMask({ mask: '_________', replacement: { _: /\d/ } });
    const codeRef = useMask({ mask: '__________', replacement: { _: /\d/ } });
    const dniRef = useMask({ mask: '_________', replacement: { _: /\d/ } });
    const lastNamesRef = useMask({ mask: '______________________________', replacement: { _: /^[a-zA-Z \u00C0-\u00FF]*$/ } })
    const namesRef = useMask({ mask: '_______________________________', replacement: { _: /^[a-zA-Z \u00C0-\u00FF]*$/ } })

    const form = useForm<IBasicInfoSchema>({
        resolver: zodResolver(basicInfoSchema),
        defaultValues: {
            apellidos: solicitud?.apellidos ?? initialValues.apellidos,
            nombres: solicitud?.nombres ?? initialValues.nombres,
            facultad: solicitud?.facultad ?? initialValues.facultad,
            escuela: solicitud?.escuela ?? initialValues.escuela,
            codigo: solicitud?.codigo ?? initialValues.codigo,
            tipo_documento: solicitud?.tipo_documento ?? 'PE01',
            direccion: solicitud.direccion ?? initialValues.direccion,
            dni: solicitud.dni ?? initialValues.dni,
            celular: solicitud.celular ?? initialValues.celular,
        }
    })

    // 1. Observa el valor del campo 'facultad'
    const selectedFacultad = form.watch("facultad");

    // 2. Filtra las escuelas basadas en la facultad seleccionada
    const filteredEscuelas = React.useMemo(() => {
        if (!selectedFacultad) {
            return []; // Si no hay facultad seleccionada, no mostrar escuelas
        }
        // Asume que cada escuela en ESCUELAS tiene una propiedad 'facultad' que coincide con el 'value' de la facultad
        return ESCUELAS.filter(escuela => escuela.facultad === selectedFacultad);
    }, [selectedFacultad]);

    // 3. Opcional: Resetea el campo 'escuela' cuando cambia la facultad
    React.useEffect(() => {
        // Solo resetea si la facultad cambia y no es la carga inicial
        if (selectedFacultad !== (solicitud?.facultad ?? initialValues.facultad)) {
             form.resetField("escuela"); // O form.setValue("escuela", '') si prefieres
        }
    }, [selectedFacultad, form, solicitud?.facultad]);


    const onSubmit = (data:IBasicInfoSchema) => {
        handleNext(data)
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="p-4" autoComplete="off">
                {/* Modifica la clase 'gap' para aumentar el espacio vertical */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-5">
                    <InputField
                        label="Apellidos"
                        name="apellidos"
                        inputRef={lastNamesRef}
                        placeholder="Ingresar primer y segundo apellido..."
                        control={form.control}
                    />
                    <InputField
                        label="Nombres"
                        name="nombres"
                        inputRef={namesRef}
                        placeholder="Ingresar nombres..."
                        control={form.control}
                    />
                    <SelectFacultad 
                        name="facultad"
                        control={form.control}
                    />
                    {/* 4. Pasa las escuelas filtradas al componente MySelect */}
                    <MySelect
                        name="escuela"
                        control={form.control}
                        label="Escuela"
                        placeholder={selectedFacultad ? "Selecciona una escuela" : "Selecciona una facultad primero"}
                        options={filteredEscuelas} // Usa las escuelas filtradas
                        disabled={!selectedFacultad} // Deshabilita si no hay facultad seleccionada
                    />
                    <InputField
                        label="Código"
                        name="codigo"
                        inputRef={codeRef}
                        placeholder="Ingresar código..."
                        control={form.control}
                    />
                    <InputField
                        label="Dirección"
                        name="direccion"
                        placeholder="Ingresar dirección..."
                        control={form.control}
                    />
                    <InputField
                        name="celular"
                        inputRef={phoneRef}
                        type="tel"
                        control={form.control}
                        description=""
                    />
                    <RadioGroupField
                        label="Tipo de Documento"
                        name="tipo_documento"
                        options={[
                            { value: "PE01", label: "Documento de Identidad" },
                            { value: "PE02", label: "Carnet de Extranjería" },
                        ]}
                        control={form.control}
                    />
                    <InputField
                        label="Número de Documento"
                        name="dni"
                        inputRef={dniRef}
                        placeholder="Ingresar número de documento..."
                        control={form.control}
                    />
                </div>
                
                {/* Botones de navegación */}
                <StepperControl 
                    activeStep={activeStep} 
                    steps={steps} 
                    setActiveStep={setActiveStep}
                    type="submit"
                />
            </form>
        </Form>
    )
}