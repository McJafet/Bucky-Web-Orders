import React, { useState, useRef, useEffect } from "react";
import { ColumnDef, useReactTable, getCoreRowModel, flexRender } from "@tanstack/react-table";
import { Pedido } from "../data/Pedidos";
import productosBase, { Producto } from "../data/Productos";
import { useReactToPrint } from "react-to-print";

// 1️⃣ Definimos la tabla de pedidos
const PedidoTable: React.FC = () => {
  let day: string | number = new Date().getDate();
  let month: string | number = new Date().getMonth() + 1;
  const year = new Date().getFullYear();

  if (day < 10) {
    day = `0${day}`;
  }
  if (month < 10) {
    month = `0${month}`;
  }
  // 3️⃣ Usamos estado para almacenar la lista de productos
  const [productos, setProductos] = useState<Producto[]>(productosBase.map(p => ({ ...p })));
  const [width, setWidth] = useState(window.innerWidth);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState<number | null>(null);
  const [cliente, setCliente] = useState<string>("");
  const [direccion, setDireccion] = useState<string>("");
  const [fecha, setFecha] = useState<string>(`${year}-${month}-${day}`);
  const [resumen, setResumen] = useState<{ [key: string]: {
    cantidad: number;
    importe: number;
  }}>({});

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const breakpoint = 740;

  

  // 🛠 Función para manejar cambios en los inputs
  const handleChange = (index: number, field: keyof Producto, value: number) => {
    setProductos((prev) => {
      // 4️⃣ Creamos una copia del estado actual para modificar sin afectar el original
      const newProductos = [...prev];
      newProductos[index] = {
        ...newProductos[index],
        [field]: value, // 🔄 Actualizamos solo el campo que cambió
      };

      // 5️⃣ Recalculamos el importe (cantidad * precio unitario)
      newProductos[index].importe = newProductos[index].cantidad * newProductos[index].precio;
      if (newProductos[index].ventaPorDocena) {
        newProductos[index].importe = (newProductos[index].cantidad / 12) * newProductos[index].precio;
      }

      return newProductos; // 🔄 Actualizamos el estado con la nueva lista de productos
    });
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
          p.id === pedidoSeleccionado ? { ...p, productos, total: totalPedido } : p
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
    setFecha(`${year}-${month}-${day}`);
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

  // 6️⃣ Definimos las columnas para la tabla
  const columns: ColumnDef<Producto>[] = [
    { accessorKey: "nombre", header: "Producto" },
    {
      accessorKey: "cantidad",
      header: "Cantidad",
      cell: ({ row }) => (
        <input
          type="number"
          value={row.original.cantidad || ""}
          onChange={(e) => handleChange(row.index, "cantidad", Number(e.target.value))}
          className="border p-1 w-full"
        />
      ),
    },
    {
      accessorKey: "cambio",
      header: "Cambio",
      cell: ({ row }) => (
        <input
          type="number"
          value={row.original.cambio || ""}
          onChange={(e) => handleChange(row.index, "cambio", Number(e.target.value))}
          className="border p-1 w-full"
        />
      ),
    },
    {
      accessorKey: "precioUnitario",
      header: "P. Unit.",
      cell: ({ row }) => (
        <input
          type="number"
          value={row.original.precio || ""}
          onChange={(e) => handleChange(row.index, "precio", Number(e.target.value))}
          className="border p-1 w-full"
        />
      ),
    },
    {
      accessorKey: "importe",
      header: "Importe",
      cell: ({ row }) => <span>{row.original.importe.toFixed(2)}</span>,
    },
  ];

  // 7️⃣ Configuramos la tabla con React Table
  const table = useReactTable({
    data: productos,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const mitad = Math.ceil(productos.length / 2);
  const productosCol1 = productos.slice(0, mitad);
  const productosCol2 = productos.slice(mitad);

  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrint = useReactToPrint({ contentRef });


  if (width < breakpoint) {
    return (
    <div className="p-4 w-full mx-auto">
        <div ref={contentRef} className="flex-col w-full mx-auto mb-4">
          <header className="w-full flex justify-around p-1 mb-2">
            <h2 className="">Pedido 1</h2>
            <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} className="border p-2" />
          </header>
          <form className="w-full flex flex-col gap-2">
            <input type="text" placeholder="Nombre del Cliente" value={cliente} onChange={(e) => setCliente(e.target.value)} className="border p-2 mr-2" />
            <input type="text" placeholder="Dirección" value={direccion} onChange={(e) => setDireccion(e.target.value)} className="border p-2 mr-2" />
          </form>
        </div>
        <div>
        <button onClick={handleAddPedido} className="col-span-2 bg-blue-500 text-white p-2 mt-4 mb-4">Guardar Pedido</button>
        <table className="border-collapse border w-full">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="border p-1 text-sm">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {productos.map((producto, index) => (
              <tr key={index} className="text-xs">
                <td className="border p-1 ">{producto.nombre}</td>
                <td className="border p-1 ">
                  <input
                    type="number"
                    value={producto.cantidad || ""}
                    onChange={(e) => handleChange(index, "cantidad", Number(e.target.value))}
                  />
                </td>
                <td className="border p-1">
                  <input
                    type="number"
                    value={producto.cambio || ""}
                    onChange={(e) => handleChange(index, "cambio", Number(e.target.value))}
                    className=" p-1 w-full"
                  />
                </td>
                <td className="border p-1 ">
                  <input
                    type="number"
                    value={producto.precio || ""}
                    onChange={(e) => handleChange(index, "precio", Number(e.target.value))}
                  />
                </td>
                <td className="border p-1 ">{producto.importe.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button onClick={handleAddPedido} className="col-span-2 bg-blue-500 text-white p-2 mt-4">Guardar Pedido</button>
      <button onClick={() => reactToPrint()}>Print</button>

      {/* 8️⃣ Mostramos el total general de la venta */}
      <div className="mt-4 text-right font-bold text-lg">
        Total S/: {productos.reduce((sum, p) => sum + p.importe, 0).toFixed(2)}
      </div>

      {/* Tabla Resumen de Productos Vendidos */}
      <h2>Resumen de Productos Vendidos</h2>
      <table className="border w-full">
        <thead>
          { Object.keys(resumen).length > 0 && (
            <tr>
              <th className="border p-2">Producto</th>
              <th className="border p-2">Total Cantidad</th>
            </tr>
            )}
        </thead>
        <tbody>
          { Object.entries(resumen).map(([producto, cantidad]) => (
            <tr key={producto}>
              <td className="border p-2">{producto}</td>
              <td className="border p-2 text-center">{cantidad.cantidad}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3 className="text-md font-bold mt-4">Monto total del Día: S/. {total.toFixed(2)}</h3>

      <h2 className="text-lg font-bold mb-2">Lista de Pedidos Guardados</h2>
      <table className="border-collapse border w-full mb-4">
        <thead>
          <tr>
            <th className="border p-2">Pedido</th>
            <th className="border p-2">Cliente</th>
            <th className="border p-2">Dirección</th>
            <th className="border p-2">Fecha</th>
            <th className="border p-2">Total</th>
          </tr>
        </thead>
        <tbody>
          {pedidos.map((pedido) => (
            <tr key={pedido.id}>
              <td className="border p-2">{pedido.cliente}</td>
              <td className="border p-2">{pedido.direccion}</td>
              <td className="border p-2">{pedido.fecha}</td>
              <td className="border p-2">S/. {pedido.total.toFixed(2)}</td>
              <td className="border flex justify-center"><button onClick={() => pedido.id !== undefined && handlePedido(pedido.id)}>Select</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>)
  }
  
  return (
    <div className="p-4 w-full mx-auto">
      <div ref={contentRef} className="flex-col w-full mx-auto mb-4">
      <div className="flex-col w-full mx-auto mb-4">
      <header className="w-full flex justify-around p-1 mb-2">
          <h2 className="">Pedido {pedidoSeleccionado !== null ? pedidoSeleccionado : pedidos.length + 1}</h2>
          <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} className="border p-2" />
      </header>
          <form className="w-full flex flex-col gap-2">
            <input type="text" placeholder="Nombre del Cliente" value={cliente} onChange={(e) => setCliente(e.target.value)} className="border p-2 mr-2" />
            <input type="text" placeholder="Dirección" value={direccion} onChange={(e) => setDireccion(e.target.value)} className="border p-2 mr-2" />
          </form>
        </div>
      <div className="p-4 grid grid-cols-2 gap-4">
      <h2 className="text-lg font-bold mb-2 col-span-full">Productos</h2>
      <div>
        <table className="border-collapse border w-full">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="border p-2 text-xs">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="text-xs">
            {productosCol1.map((producto, index) => (
              <tr key={index}>
                <td className="border p-1">{producto.nombre}</td>
                <td className="border p-1">
                  <input
                    type="number"
                    value={producto.cantidad || ""}
                    onChange={(e) => handleChange(index, "cantidad", Number(e.target.value))}
                    className=" p-1 w-full"
                  />
                </td>
                <td className="border p-1">
                  <input
                    type="number"
                    value={producto.cambio || ""}
                    onChange={(e) => handleChange(index, "cambio", Number(e.target.value))}
                    className=" p-1 w-full"
                  />
                </td>
                <td className="border p-1">
                  <input
                    type="number"
                    value={producto.precio || ""}
                    onChange={(e) => handleChange(index, "precio", Number(e.target.value))}
                    className=" p-1 w-full"
                  />
                </td>
                <td className="border p-1">{producto.importe.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div>
        <table className="border-collapse border w-full">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="border p-2">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="text-xs">
            {productosCol2.map((producto, index) => (
              <tr key={index + mitad}>
                <td className="border p-1">{producto.nombre}</td>
                <td className="border p-1">
                  <input
                    type="number"
                    value={producto.cantidad || ""}
                    onChange={(e) => handleChange(index + mitad, "cantidad", Number(e.target.value))}
                    className="p-1 w-full"
                  />
                </td>
                <td className="border p-1">
                  <input
                    type="number"
                    value={producto.cambio || ""}
                    onChange={(e) => handleChange(index + mitad, "cambio", Number(e.target.value))}
                    className=" p-1 w-full"
                  />
                </td>
                <td className="border p-1">
                  <input
                    type="number"
                    value={producto.precio || ""}
                    onChange={(e) => handleChange(index + mitad, "precio", Number(e.target.value))}
                    className="p-1 w-full"
                  />
                </td>
                <td className="border p-1">{producto.importe.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </div>
    <button onClick={handleAddPedido} className="col-span-2 bg-blue-500 text-white p-2 mt-4">Guardar Pedido</button>
    <button onClick={() => reactToPrint()}>Print</button>


{/* 8️⃣ Mostramos el total general de la venta */}
<div className="mt-4 text-right font-bold text-lg">
  Total S/: {productos.reduce((sum, p) => sum + p.importe, 0).toFixed(2)}
</div>

{/* Tabla Resumen de Productos Vendidos */}
<h2>Resumen de Productos Vendidos</h2>
<table className="border w-full">
  <thead>
    { Object.keys(resumen).length > 0 && (
      <tr>
        <th className="border p-2">Producto</th>
        <th className="border p-2">Total Cantidad</th>
      </tr>
      )}
  </thead>
  <tbody>
    { Object.entries(resumen).map(([producto, cantidad]) => (
      <tr key={producto}>
        <td className="border p-2">{producto}</td>
        <td className="border p-2 text-center">{cantidad.cantidad}</td>
      </tr>
    ))}
  </tbody>
</table>
<h3 className="text-md font-bold mt-4">Monto total del Día: S/. {total.toFixed(2)}</h3>

<h2 className="text-lg font-bold mb-2">Lista de Pedidos Guardados</h2>
<table className="border-collapse border w-full mb-4">
  <thead>
    <tr>
      <th className="border p-2">Pedido</th>
      <th className="border p-2">Cliente</th>
      <th className="border p-2">Dirección</th>
      <th className="border p-2">Fecha</th>
      <th className="border p-2">Total</th>
    </tr>
  </thead>
  <tbody>
    {pedidos.map((pedido) => (
      <tr key={pedido.id}>
        <td className="border p-2">{pedido.id}</td>
        <td className="border p-2">{pedido.cliente}</td>
        <td className="border p-2">{pedido.direccion}</td>
        <td className="border p-2">{pedido.fecha}</td>
        <td className="border p-2">S/. {pedido.total.toFixed(2)}</td>
        <td className="border flex justify-center"><button onClick={() => pedido.id !== undefined && handlePedido(pedido.id)}>Select</button></td>
      </tr>
    ))}
  </tbody>
</table>
    </div>
  );
};

export default PedidoTable;
