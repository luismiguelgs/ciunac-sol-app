import { Itexto, Ifacultad, Icurso, ITipoSolicitud } from "@/interfaces/types.interface";
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface TextsState {
		textos: Itexto[]
		setTextos: (textos:Itexto[]) => void
}
	
export const useTextsStore = create<TextsState>()(
	persist(
		(set) => ({
			textos: [],
			setTextos: (textos) => set({ textos: textos }),//set({ bears: get().bears + 1 }),
		}),
		{
			name: 'text-storage', // name of item in the storage (must be unique)
			storage: createJSONStorage(() => sessionStorage), // (optional) by default the 'localStorage' is used
			partialize: (state) => ({ textos: state.textos }),
		},
	),
)


interface DocsState {
	documents: ITipoSolicitud[]
	setDocuments: (docs:ITipoSolicitud[]) => void
}

export const useDocumentsStore = create<DocsState>()(
  	persist(
		(set) => ({
			documents: [],
			setDocuments: (docs) => set({ documents: docs }),//set({ bears: get().bears + 1 }),
		}),
		{
			name: 'documents-storage', // name of item in the storage (must be unique)
			storage: createJSONStorage(() => sessionStorage), // (optional) by default the 'localStorage' is used
			partialize: (state) => ({ documents: state.documents }),
		},
	),
)

interface FacusState {
    faculties: Ifacultad[]
    setFaculties: (docs:Ifacultad[]) => void
}
  
export const useFacultiesStore = create<FacusState>()(
    persist(
      (set) => ({
        faculties: [],
        setFaculties: (facus) => set({ faculties: facus }),//set({ bears: get().bears + 1 }),
      }),
      {
        name: 'faculties-storage', // name of item in the storage (must be unique)
        storage: createJSONStorage(() => sessionStorage), // (optional) by default the 'localStorage' is used
        partialize: (state) => ({ documents: state.faculties }),
      },
    ),
)
interface SubjectsState {
    subjects: Icurso[]
    setSubjects: (subs:Icurso[]) => void
}
  
export const useSubjectsStore = create<SubjectsState>()(
    persist(
      (set) => ({
        subjects: [],
        setSubjects: (subs) => set({ subjects: subs }),
      }),
      {
        name: 'faculties-storage', // name of item in the storage (must be unique)
        storage: createJSONStorage(() => sessionStorage), // (optional) by default the 'localStorage' is used
        partialize: (state) => ({ documents: state.subjects }),
      },
    ),
)