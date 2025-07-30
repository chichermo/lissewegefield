import { LineaMarcado, Medicion, Position, Producto, Tarea, CampoDeportivo, GestorCampos } from '@/types'
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

interface AppState {
  // GPS
  position: Position | null
  accuracy: number
  signal: number
  isActive: boolean
  error: string | null
  isLoading: boolean

  // Gestión de Campos Deportivos
  gestorCampos: GestorCampos
  campoActivo: CampoDeportivo | null

  // Marcado
  lineasMarcado: LineaMarcado[]
  lineaActual: LineaMarcado | null
  progresoMarcado: number
  modoMarcado: 'manual' | 'gps' | 'automatico'

  // Mediciones
  mediciones: Medicion[]
  medicionActual: Medicion | null
  resultadosFIFA: any

  // Productos
  productos: Producto[]
  filtroProductos: string

  // Tareas
  tareas: Tarea[]
  filtroTareas: string

  // UI
  modoOscuro: boolean
  sidebarAbierta: boolean
  notificaciones: string[]
}

const initialState: AppState = {
  // GPS
  position: null,
  accuracy: 0,
  signal: 0,
  isActive: false,
  error: null,
  isLoading: false,

  // Gestión de Campos Deportivos
  gestorCampos: {
    campos: [],
    campoActivo: null,
    campoSeleccionado: null
  },
  campoActivo: null,

  // Marcado
  lineasMarcado: [],
  lineaActual: null,
  progresoMarcado: 0,
  modoMarcado: 'manual',

  // Mediciones
  mediciones: [],
  medicionActual: null,
  resultadosFIFA: {},

  // Productos
  productos: [],
  filtroProductos: '',

  // Tareas
  tareas: [],
  filtroTareas: '',

  // UI
  modoOscuro: false,
  sidebarAbierta: true,
  notificaciones: []
}

interface AppActions {
  // GPS Actions
  setPosition: (position: Position | null) => void
  setAccuracy: (accuracy: number) => void
  setSignal: (signal: number) => void
  setIsActive: (isActive: boolean) => void
  setError: (error: string | null) => void
  setIsLoading: (isLoading: boolean) => void

  // Gestión de Campos Deportivos Actions
  setGestorCampos: (gestor: GestorCampos) => void
  setCampoActivo: (campo: CampoDeportivo | null) => void
  agregarCampo: (campo: Omit<CampoDeportivo, 'id'>) => void
  actualizarCampo: (id: string, datos: Partial<CampoDeportivo>) => void
  eliminarCampo: (id: string) => void
  limpiarCampos: () => void

  // Marcado Actions
  setLineasMarcado: (lineas: LineaMarcado[]) => void
  setLineaActual: (linea: LineaMarcado | null) => void
  setProgresoMarcado: (progreso: number) => void
  setModoMarcado: (modo: 'manual' | 'gps' | 'automatico') => void
  agregarLinea: (linea: Omit<LineaMarcado, 'id'>) => void
  actualizarLinea: (id: number, datos: Partial<LineaMarcado>) => void
  eliminarLinea: (id: number) => void
  completarLinea: (id: number) => void
  reiniciarMarcado: () => void

  // Mediciones Actions
  setMediciones: (mediciones: Medicion[]) => void
  setMedicionActual: (medicion: Medicion | null) => void
  setResultadosFIFA: (resultados: any) => void
  agregarMedicion: (medicion: Omit<Medicion, 'id'>) => void
  actualizarMedicion: (id: string, datos: Partial<Medicion>) => void
  eliminarMedicion: (id: string) => void

  // Productos Actions
  setProductos: (productos: Producto[]) => void
  setFiltroProductos: (filtro: string) => void
  agregarProducto: (producto: Omit<Producto, 'id'>) => void
  actualizarProducto: (id: number, datos: Partial<Producto>) => void
  eliminarProducto: (id: number) => void

  // Tareas Actions
  setTareas: (tareas: Tarea[]) => void
  setFiltroTareas: (filtro: string) => void
  agregarTarea: (tarea: Omit<Tarea, 'id'>) => void
  actualizarTarea: (id: number, datos: Partial<Tarea>) => void
  eliminarTarea: (id: number) => void
  completarTarea: (id: number) => void

  // UI Actions
  setModoOscuro: (modo: boolean) => void
  setSidebarAbierta: (abierta: boolean) => void
  agregarNotificacion: (notificacion: string) => void
  eliminarNotificacion: (index: number) => void
  limpiarNotificaciones: () => void

  // Utility Actions
  resetState: () => void
  exportarDatos: () => void
  importarDatos: (datos: any) => void
}

type AppStore = AppState & AppActions

export const useAppStore = create<AppStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        // GPS Actions
        setPosition: (position) => set({ position }),
        setAccuracy: (accuracy) => set({ accuracy }),
        setSignal: (signal) => set({ signal }),
        setIsActive: (isActive) => set({ isActive }),
        setError: (error) => set({ error }),
        setIsLoading: (isLoading) => set({ isLoading }),

        // Gestión de Campos Deportivos Actions
        setGestorCampos: (gestor) => set({ gestorCampos: gestor }),
        setCampoActivo: (campo) => set({ campoActivo: campo }),
        agregarCampo: (campo) => {
          const nuevoCampo: CampoDeportivo = {
            ...campo,
            id: `campo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
          }
          set((state) => ({
            gestorCampos: {
              ...state.gestorCampos,
              campos: [...state.gestorCampos.campos, nuevoCampo]
            }
          }))
        },
        actualizarCampo: (id, datos) => set((state) => ({
          gestorCampos: {
            ...state.gestorCampos,
            campos: state.gestorCampos.campos.map(campo =>
              campo.id === id ? { ...campo, ...datos } : campo
            )
          }
        })),
        eliminarCampo: (id) => set((state) => ({
          gestorCampos: {
            ...state.gestorCampos,
            campos: state.gestorCampos.campos.filter(campo => campo.id !== id)
          }
        })),
        limpiarCampos: () => set({ 
          gestorCampos: { 
            campos: [], 
            campoActivo: null, 
            campoSeleccionado: null 
          } 
        }),

        // Marcado Actions
        setLineasMarcado: (lineas) => set({ lineasMarcado: lineas }),
        setLineaActual: (linea) => set({ lineaActual: linea }),
        setProgresoMarcado: (progreso) => set({ progresoMarcado: progreso }),
        setModoMarcado: (modo) => set({ modoMarcado: modo }),
        agregarLinea: (linea) => {
          const nuevaLinea: LineaMarcado = {
            ...linea,
            id: Math.max(...get().lineasMarcado.map(l => l.id), 0) + 1
          }
          set((state) => ({
            lineasMarcado: [...state.lineasMarcado, nuevaLinea]
          }))
        },
        actualizarLinea: (id, datos) => set((state) => ({
          lineasMarcado: state.lineasMarcado.map(linea =>
            linea.id === id ? { ...linea, ...datos } : linea
          )
        })),
        eliminarLinea: (id) => set((state) => ({
          lineasMarcado: state.lineasMarcado.filter(linea => linea.id !== id)
        })),
        completarLinea: (id) => set((state) => ({
          lineasMarcado: state.lineasMarcado.map(linea =>
            linea.id === id ? { ...linea, completada: true, progreso: 100 } : linea
          )
        })),
        reiniciarMarcado: () => set({
          lineasMarcado: [],
          lineaActual: null,
          progresoMarcado: 0
        }),

        // Mediciones Actions
        setMediciones: (mediciones) => set({ mediciones }),
        setMedicionActual: (medicion) => set({ medicionActual: medicion }),
        setResultadosFIFA: (resultados) => set({ resultadosFIFA: resultados }),
        agregarMedicion: (medicion) => {
          const nuevaMedicion: Medicion = {
            ...medicion,
            id: `med_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
          }
          set((state) => ({
            mediciones: [...state.mediciones, nuevaMedicion]
          }))
        },
        actualizarMedicion: (id, datos) => set((state) => ({
          mediciones: state.mediciones.map(medicion =>
            medicion.id === id ? { ...medicion, ...datos } : medicion
          )
        })),
        eliminarMedicion: (id) => set((state) => ({
          mediciones: state.mediciones.filter(medicion => medicion.id !== id)
        })),

        // Productos Actions
        setProductos: (productos) => set({ productos }),
        setFiltroProductos: (filtro) => set({ filtroProductos: filtro }),
        agregarProducto: (producto) => {
          const nuevoProducto: Producto = {
            ...producto,
            id: Math.max(...get().productos.map(p => p.id), 0) + 1
          }
          set((state) => ({
            productos: [...state.productos, nuevoProducto]
          }))
        },
        actualizarProducto: (id, datos) => set((state) => ({
          productos: state.productos.map(producto =>
            producto.id === id ? { ...producto, ...datos } : producto
          )
        })),
        eliminarProducto: (id) => set((state) => ({
          productos: state.productos.filter(producto => producto.id !== id)
        })),

        // Tareas Actions
        setTareas: (tareas) => set({ tareas }),
        setFiltroTareas: (filtro) => set({ filtroTareas: filtro }),
        agregarTarea: (tarea) => {
          const nuevaTarea: Tarea = {
            ...tarea,
            id: Math.max(...get().tareas.map(t => t.id), 0) + 1
          }
          set((state) => ({
            tareas: [...state.tareas, nuevaTarea]
          }))
        },
        actualizarTarea: (id, datos) => set((state) => ({
          tareas: state.tareas.map(tarea =>
            tarea.id === id ? { ...tarea, ...datos } : tarea
          )
        })),
        eliminarTarea: (id) => set((state) => ({
          tareas: state.tareas.filter(tarea => tarea.id !== id)
        })),
        completarTarea: (id) => set((state) => ({
          tareas: state.tareas.map(tarea =>
            tarea.id === id ? { ...tarea, estado: 'completada' as const } : tarea
          )
        })),

        // UI Actions
        setModoOscuro: (modo) => set({ modoOscuro: modo }),
        setSidebarAbierta: (abierta) => set({ sidebarAbierta: abierta }),
        agregarNotificacion: (notificacion) => set((state) => ({
          notificaciones: [...state.notificaciones, notificacion]
        })),
        eliminarNotificacion: (index) => set((state) => ({
          notificaciones: state.notificaciones.filter((_, i) => i !== index)
        })),
        limpiarNotificaciones: () => set({ notificaciones: [] }),

        // Utility Actions
        resetState: () => set(initialState),
        exportarDatos: () => {
          const state = get()
          const datos = {
            gestorCampos: state.gestorCampos,
            campoActivo: state.campoActivo,
            lineasMarcado: state.lineasMarcado,
            mediciones: state.mediciones,
            productos: state.productos,
            tareas: state.tareas,
            modoOscuro: state.modoOscuro,
            fecha: new Date().toISOString()
          }
          const blob = new Blob([JSON.stringify(datos, null, 2)], { type: 'application/json' })
          const url = URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = `cancha-inteligente-${new Date().toISOString().split('T')[0]}.json`
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)
          URL.revokeObjectURL(url)
        },
        importarDatos: (datos) => {
          if (datos.gestorCampos) set({ gestorCampos: datos.gestorCampos })
          if (datos.campoActivo) set({ campoActivo: datos.campoActivo })
          if (datos.lineasMarcado) set({ lineasMarcado: datos.lineasMarcado })
          if (datos.mediciones) set({ mediciones: datos.mediciones })
          if (datos.productos) set({ productos: datos.productos })
          if (datos.tareas) set({ tareas: datos.tareas })
          if (datos.modoOscuro !== undefined) set({ modoOscuro: datos.modoOscuro })
        }
      }),
      {
        name: 'cancha-inteligente-storage',
        partialize: (state) => ({
          gestorCampos: state.gestorCampos,
          campoActivo: state.campoActivo,
          lineasMarcado: state.lineasMarcado,
          mediciones: state.mediciones,
          productos: state.productos,
          tareas: state.tareas,
          modoOscuro: state.modoOscuro
        })
      }
    )
  )
)
