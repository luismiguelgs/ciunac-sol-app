'use client'
import { Icurso } from '@/interfaces/types.interface'
import TypesService from '@/services/types.service'
import React from 'react'
import useStore from './useStore'
import { useSubjectsStore } from '@/stores/types.stores'

const useSubjects = () => {
    const subjects = useStore(useSubjectsStore, (state) => state.subjects)
    const [data, setData] = React.useState<Icurso[] | undefined>(subjects)

    React.useEffect(() => {
        const getData = async () => {
            const result = await TypesService.fetchTypes<Icurso>('cursos')
            useSubjectsStore.setState({ subjects: result })
            setData(result)
        }
        if(!data) getData()
    }, [subjects])

    return data
}

export default useSubjects