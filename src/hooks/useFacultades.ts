'use client'
import { Ifacultad } from '@/interfaces/types.interface'
import TypesService from '@/services/types.service'
import React from 'react'
import useStore from './useStore'
import { useFacultiesStore } from '@/stores/types.stores'

const useFacultades = () => {
    const items = useStore(useFacultiesStore, (state) => state.faculties)
    const [data, setData] = React.useState<Ifacultad[] | undefined>(items)

    React.useEffect(() => {
        const getData = async () => {
            const result = await TypesService.fetchTypes<Ifacultad>('facultades')
            useFacultiesStore.setState({ faculties: result })
            setData(result)
        }
        if(!data) getData()
    }, [])

    return data
}

export default useFacultades