import { useState } from "react";
import { Producto } from "../data/Productos";
import { Pedido } from "../data/Pedidos";
import { useFecha } from "./useFecha";
import { useProducts } from "./useProducts";


export function useOrders(productosBase: Producto[]) {

    const { newFecha } = useFecha();
    const { productos, resetProducts } = useProducts();
    
    const [pedidos, setPedidos] = useState<Pedido[]>([]);
    const [total, setTotal] = useState<number>(0);
    const [pedidoSeleccionado, setPedidoSeleccionado] = useState<number | null>(null);
    const [cliente, setCliente] = useState<string>("");
    const [direccion, setDireccion] = useState<string>('');
    const [fecha, setFecha] = useState<string>(newFecha)
    const [resumen, setResumen] = useState<{ [key: string]: {
    cantidad: number;
    importe: number;
    }}>({});

    

    // 1. Calcular total del pedido
    const totalOrder = (productos: Producto[]) => 
        productos.reduce((acc, producto) => acc + producto.importe, 0);

    // 2. Restar los productos anteriores del resumen
    const lessResumen = (beforeOrder: Pedido) => {
        // Actualizar el resumen con los nuevo valores
        const nuevoResumen = { ...resumen };
        beforeOrder.productos.forEach((p) => {
            p.cambio = p.cambio || 0;
            if (p.cantidad > 0 || p.cambio > 0) {
              resumen[p.nombre] = {
                cantidad: (resumen[p.nombre]?.cantidad || 0) - p.cantidad - p.cambio,
                importe: (resumen[p.nombre]?.importe || 0) - p.importe,
              };
            }
          })
        return nuevoResumen;
    }

    // 3. Actualizar resumen con los nuevos productos
    const updateResumen = (productos: Producto[], resumenActual: typeof resumen) => {
        const nuevoResumen = { ...resumenActual };

        productos.forEach((p) => {
            p.cambio = p.cambio || 0;
            if (p.cantidad > 0 || p.cambio > 0) {
                nuevoResumen[p.nombre] = {
                cantidad: (nuevoResumen[p.nombre]?.cantidad || 0) + p.cantidad + p.cambio,
                importe: (nuevoResumen[p.nombre]?.importe || 0) + p.importe,
                };
            }
        });
        return nuevoResumen;
    }


    // 4. Ordenar el Resumen del pedido según productosBase
    const sortResumen = (resumenActual: typeof resumen) => {
        return Object.keys(resumenActual)
            .sort((a, b) => {
                const indexA = productosBase.findIndex((p) => p.nombre === a);
                const indexB = productosBase.findIndex((p) => p.nombre === b);
                return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB);
            })
            .reduce((acc, key) => {
            acc[key] = resumenActual[key];
            return acc;
            }, {} as typeof resumen);
    }

    const updateSortedResumen = (productos: Producto[], resumenActual: typeof resumen) => {
        const updatedResumen = updateResumen(productos, resumenActual);
        return sortResumen(updatedResumen);
    }

    const updateOrder = (
        pedidoAnterior: Pedido,
        productos: Producto[],
        totalPedido: number,
        resumenActual: typeof resumen
    ) => {
        const updatedResumen = lessResumen(pedidoAnterior);
        const sortedResumen = updateSortedResumen(productos, updatedResumen);
        return {
            nuevoPedido: pedidos.map((p) =>
                p.id === pedidoAnterior.id
                ? { ...p, productos, total: totalPedido }
                : p
            ),
            sortedResumen,
            diferenciaTotal: totalPedido - pedidoAnterior.total,
            resumenActual
        }
        
    }

    const createNewOrder = (
        cliente: string,
        direccion: string,
        fecha: string,
        productos: Producto[],
        totalPedido: number,
    ) => {
        return {
            nuevoPedido: {
                id: pedidos.length + 1,
                cliente,
                direccion,
                fecha,
                productos: [...productos],
                total: totalPedido,
            },
            diferenciaTotal: totalPedido,
        }
    }

    // 5. Agregar Pedido Main Function "handleAddPedido"
    const handleAddPedido = () => {
        // if (!cliente || !direccion || !fecha) {
        //   alert("Por favor, complete los datos del cliente.");
        //   return;
        // }
        
        if (productos.reduce((acc, producto) => acc + producto.cantidad, 0) === 0) {
            console.log("No hay productos en el pedido.");
            return;
        }

        const totalPedido = totalOrder(productos);
        let nuevoPedidos = [...pedidos];
        let diferenciaTotal = 0;
        let sortedResumen = resumen;

        if(pedidoSeleccionado !== null) {
            const pedidoAnterior = pedidos.find(p => p.id === pedidoSeleccionado);

            if(pedidoAnterior) {
                const resultado =  updateOrder(pedidoAnterior, productos, totalPedido, sortedResumen);
                nuevoPedidos = resultado.nuevoPedido;
                sortedResumen = resultado.sortedResumen;
                diferenciaTotal = resultado.diferenciaTotal;
            }
        } else {
            const resultado = createNewOrder(cliente, direccion, fecha, productos, totalPedido);
            nuevoPedidos = [...pedidos, resultado.nuevoPedido];
            diferenciaTotal = resultado.diferenciaTotal;
            sortedResumen = updateSortedResumen(productos, resumen);
        }
        console.log("pedidos despues de HandleAddPedido", nuevoPedidos);

        setPedidos(nuevoPedidos);
        setResumen(sortedResumen);
        setTotal(prev => prev + diferenciaTotal);
        setPedidoSeleccionado(null);
        setCliente("");
        setDireccion("");
        setFecha(newFecha);
        resetProducts();
    };
    return {
        pedidos,
        total,
        pedidoSeleccionado,
        cliente,
        direccion,
        fecha,
        resumen,
        setPedidoSeleccionado,
        setCliente,
        setDireccion,
        setFecha,
        setResumen,
        handleAddPedido,
    }
    
  };