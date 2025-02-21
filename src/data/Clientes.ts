export interface Cliente {
    id?: string,
    nombre: string,
    direccion: string,
    tipo: string,
    saldo: number
}

const clientesBase: Cliente[] = [
    {
        nombre: "",
        direccion: "",
        tipo: "Normal",
        saldo: 0
    }
]

export default clientesBase