'use client'
import { ITipoSolicitud } from '@/interfaces/types.interface'
import TypesService from '@/services/types.service'
import React from 'react'
import useStore from './useStore'
import { useDocumentsStore } from '@/stores/types.stores'

const useSolicitudes = () => {
    const subjects = useStore(useDocumentsStore, (state) => state.documents)
    const [data, setData] = React.useState<ITipoSolicitud[] | undefined>(subjects)

    React.useEffect(() => {
        const getData = async () => {
            const result = await TypesService.fetchTypes<ITipoSolicitud>('certificados')
            useDocumentsStore.setState({ documents: result })
            setData(result)
        }
        if(!data) getData()
    }, [])
    return data
}

export default useSolicitudes