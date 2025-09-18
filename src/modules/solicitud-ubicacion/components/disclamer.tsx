'use client'

import MyAlert from "@/components/forms/myAlert"
import useStore from "@/hooks/useStore"
import { useTextsStore } from "@/stores/types.stores"
import React from "react"

export default function Disclamer() 
{
    const textos = useStore(useTextsStore, (state) => state.textos)
    return (
        <React.Fragment>
            <div className="grid grid-cols-1 gap-1">
                <MyAlert
                    title='Atención'
                    description={textos?.find(objeto=> objeto.titulo === 'texto_ubicacion_3')?.texto}
                    type='info'
                />
                <MyAlert
                    title='Importante'
                    description={textos?.find(objeto=> objeto.titulo === 'texto_ubicacion_4')?.texto}
                    type='warning'
                />
            </div>
        </React.Fragment>
    )
}
