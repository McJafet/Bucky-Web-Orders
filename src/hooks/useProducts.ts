import { useState } from "react";
import productosBase, { Producto } from "../data/Productos";
import { Pedido } from "../data/Pedidos";
import { useFecha } from "./useFecha";

export function useProducts() {
    const [productos, setProductos] = useState<Producto[]>(
        productosBase.map(p => ({ ...p }))
    );

    const { newFecha } = useFecha();
    

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

    const updateProduct = ({ index, field, value }: { index: number; field: keyof Producto; value: string | number }) => {
        setProductos((prev) => {
            // 4️⃣ Creamos una copia del estado actual para modificar sin afectar el original
            // const newProductos = [...prev];
            // newProductos[index] = {
            //     ...newProductos[index],
            //     [field]: value, // 🔄 Actualizamos solo el campo que cambió
            // };
            const newProductos = prev.map((p, i) =>
                i === index ? { ...p, [field]: value } : p
            );
            // 5️⃣ Recalculamos el importe (cantidad * precio unitario)
            newProductos[index].importe = newProductos[index].cantidad * newProductos[index].precio;
            if (newProductos[index].ventaPorDocena) {
                newProductos[index].importe = (newProductos[index].cantidad / 12) * newProductos[index].precio;
            }

            return newProductos; // 🔄 Actualizamos el estado con la nueva lista de productos
        });
    };

    const resetProducts = () => {
        setProductos(productosBase.map((p) => ({ ...p })));
    };

    const orderProducts = (pedido: Pedido) => {
        // setProductos(prevProductos => {
        //     return prevProductos.map((p, index) => ({
        //         ...p,
        //         cantidad: pedido.productos[index]?.cantidad ?? 0,
        //         cambio: pedido.productos[index]?.cambio ?? 0,
        //         precio: pedido.productos[index]?.precio ?? p.precio, 
        //         importe: pedido.productos[index]?.importe ?? 0
        //     }));
        // });
        setProductos(prevProductos =>
            prevProductos.map((p) => {
                const productoPedido = pedido.productos.find(pr => pr.id === p.id);
                return productoPedido
                    ? { ...p, ...productoPedido }
                    : { ...p, cantidad: 0, cambio: 0, importe: 0 };
            })
        );
    };

    const handleAddPedido = () => {
        // if (!cliente || !direccion || !fecha) {
        //   alert("Por favor, complete los datos del cliente.");
        //   return;
        // }
    
        if (productos.reduce((acc, producto) => acc + producto.cantidad, 0) === 0) return;
        const totalPedido = productos.reduce((acc, producto) => acc + producto.importe, 0);
        let nuevoPedidos = [...pedidos];
        let diferenciaTotal = 0
        let pedidoAnterior: Pedido | undefined;
    
        if (pedidoSeleccionado !== null) {
    
          // Encontramos pedido existente
          pedidoAnterior = pedidos.find(p => p.id === pedidoSeleccionado)
          
          if (pedidoAnterior) {
            // Restar los productos anteriores del resumen
            pedidoAnterior.productos.forEach((p) => {
              p.cambio = p.cambio || 0;
              if (p.cantidad > 0 || p.cambio > 0) {
                resumen[p.nombre] = {
                  cantidad: (resumen[p.nombre]?.cantidad || 0) - p.cantidad - p.cambio,
                  importe: (resumen[p.nombre]?.importe || 0) - p.importe,
                };
              }
            })
    
            // Actualizar el pedido en la lista
            nuevoPedidos = pedidos.map(p =>
              p.id === pedidoSeleccionado 
              ? { 
                ...p, 
                productos, 
                total: totalPedido,
                cliente,
                direccion,
                fecha
              } 
              : p
            );
    
            // Calcular la diferencia del total del pedido
            diferenciaTotal = totalPedido - pedidoAnterior.total;
          }
        } else {
          const nuevoPedido: Pedido = {
            id: pedidos.length + 1,
            cliente,
            direccion,
            fecha,
            productos: [...productos],
            total: totalPedido,
          };
          nuevoPedidos.push(nuevoPedido)
          diferenciaTotal = totalPedido;
        }
        
        // Actualizar el resumen con los nuevo valores
        const nuevoResumen = { ...resumen };
        productos.forEach((p) => {
          p.cambio = p.cambio || 0;
          if (p.cantidad > 0 || p.cambio > 0) {
            nuevoResumen[p.nombre] = {
              cantidad: (nuevoResumen[p.nombre]?.cantidad || 0) + p.cantidad + p.cambio,
              importe: (nuevoResumen[p.nombre]?.importe || 0) + p.importe,
            };
          }
        });
        const sortedResumen = Object.keys(nuevoResumen)
          .sort((a, b) => {
            const indexA = productosBase.findIndex((p) => p.nombre === a);
            const indexB = productosBase.findIndex((p) => p.nombre === b);
            return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB);
          })
          .reduce((acc, key) => {
          acc[key] = nuevoResumen[key];
          return acc;
          }, {} as typeof nuevoResumen);
    
        setPedidos(nuevoPedidos);
        setResumen(sortedResumen);
        setTotal(prev => prev + diferenciaTotal);
        setPedidoSeleccionado(null);
        setProductos(productosBase.map((p) => ({ ...p })));
        setCliente("");
        setDireccion("");
        setFecha(newFecha);
      };
    
      function handlePedido(pedidoId: number) {
          const pedido = pedidos.find(p => p.id === pedidoId);
          if (pedido) {
            setPedidoSeleccionado(pedidoId)
            setProductos(pedido.productos.map(p => ({ ...p })));
            setFecha(pedido.fecha)
            setCliente(pedido.cliente)
            setDireccion(pedido.direccion)
          }
      }
    
    
    
    return {
        productos,
        updateProduct,
        resetProducts,
        orderProducts,
        pedidos,
        total,
        pedidoSeleccionado,
        cliente,
        direccion,
        fecha,
        resumen,
        handleAddPedido,
        handlePedido,
        setFecha,
        setCliente,
        setDireccion
    }
    
}
console.log("se ejecuta")
