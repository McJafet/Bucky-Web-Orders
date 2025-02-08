import { Producto } from './Productos';

export interface Pedido {
    
    id?: number;
    cliente: string;
    direccion: string;
    fecha: string;
    productos: Producto[];
    total: number;
}

const pedidosBase: Pedido[] = [
    {
        cliente: "",
        direccion: "",
        fecha: "",
        productos: [],
        total: 0
    }
]

export default pedidosBase;