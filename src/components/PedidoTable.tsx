import React, { useState } from "react";
import { ColumnDef, useReactTable, getCoreRowModel, flexRender } from "@tanstack/react-table";
import { Pedido } from "../data/Pedidos";
import productosBase, { Producto } from "../data/Productos";

// 1️⃣ Definimos la tabla de pedidos
const PedidoTable: React.FC = () => {
  // 3️⃣ Usamos estado para almacenar la lista de productos
  const [productos, setProductos] = useState<Producto[]>(productosBase);
  const [width, setWidth] = useState(window.innerWidth);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [total, setTotal] = useState<number>(0);
  // const [pedidoSeleccionado, setPedidoSeleccionado] = useState<Pedido | null>(null);
  const [cliente, setCliente] = useState<string>("");
  const [direccion, setDireccion] = useState<string>("");
  const [fecha, setFecha] = useState<string>("");
  const [resumen, setResumen] = useState<{ [key: string]: {
    cantidad: number;
    importe: number;
  }}>({});


  const breakpoint = 740;

  window.addEventListener("resize", () => setWidth(window.innerWidth));

  

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
    const totalPedido = productos.reduce((acc, producto) => acc + producto.importe, 0);
    const nuevoPedido: Pedido = {
      id: pedidos.length + 1,
      cliente,
      direccion,
      fecha,
      productos: [...productos],
      total: totalPedido,
    };
    setPedidos((prev) => [...prev, nuevoPedido]);

    const nuevoResumen = { ...resumen };
    let nuevoTotal = 0;
    productos.forEach((p) => {
      if (p.cantidad > 0) {
        nuevoResumen[p.nombre] = {
          cantidad: (nuevoResumen[p.nombre]?.cantidad || 0) + p.cantidad,
          importe: (nuevoResumen[p.nombre]?.importe || 0) + p.importe,
        };
        nuevoTotal += p.importe;
      }
    });
    setResumen(nuevoResumen);
    setTotal((prev) => prev + nuevoTotal);
    setProductos(productosBase.map((p) => ({ ...p })));
    setCliente("");
    setDireccion("");
    setFecha("");
  };


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


  // 🛠 Función para obtener el resumen de productos vendido
  const getResumenProductos = (productos: Producto[]) => {
    const resumen = productos
      .filter((p) => p.cantidad > 0)
      .reduce((acc, p) => {
        const index = acc.findIndex((r) => r.nombre === p.nombre);
        if (index === -1) {
          acc.push({ nombre: p.nombre, totalCantidad: p.cantidad });
        } else {
          acc[index].totalCantidad += p.cantidad;
        }
        return acc;
      }, [] as { nombre: string; totalCantidad: number }[]);
    return resumen;
  };

  const mitad = Math.ceil(productos.length / 2);
  const productosCol1 = productos.slice(0, mitad);
  const productosCol2 = productos.slice(mitad);

  if (width < breakpoint) {
    return (
    <div className="p-4 w-full mx-auto">
        <div className="flex-col w-full mx-auto mb-4">
          <header className="w-full flex justify-around p-1 mb-2">
            <h2 className="">Pedido 1</h2>
            <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} className="border p-2" />
          </header>
          <nav className="w-full flex flex-col gap-2">
            <input type="text" placeholder="Nombre del Cliente" value={cliente} onChange={(e) => setCliente(e.target.value)} className="border p-2 mr-2" />
            <input type="text" placeholder="Dirección" value={direccion} onChange={(e) => setDireccion(e.target.value)} className="border p-2 mr-2" />
        
          </nav>
        </div>
        <div>
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
              <tr key={index}>
                <td className="border p-1 text-xs">{producto.nombre}</td>
                <td className="border p-1 text-xs">
                  <input
                    type="number"
                    value={producto.cantidad || ""}
                    onChange={(e) => handleChange(index, "cantidad", Number(e.target.value))}
                  />
                </td>
                <td className="border p-1 text-xs">
                  <input
                    type="number"
                    value={producto.precio || ""}
                    onChange={(e) => handleChange(index, "precio", Number(e.target.value))}
                  />
                </td>
                <td className="border p-1 text-xs">{producto.importe.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button onClick={handleAddPedido} className="col-span-2 bg-blue-500 text-white p-2 mt-4">Guardar Pedido</button>

      {/* 8️⃣ Mostramos el total general de la venta */}
      <div className="mt-4 text-right font-bold text-lg">
        Total S/: {productos.reduce((sum, p) => sum + p.importe, 0).toFixed(2)}
      </div>

      {/* Tabla Resumen de Productos Vendidos */}
      <h2>Resumen de Productos Vendidos</h2>
      <table className="border w-full">
        <thead>
          { getResumenProductos(productos).length > 0 && (
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
              <td className="border p-2">#{pedido.id}</td>
              <td className="border p-2">{pedido.cliente}</td>
              <td className="border p-2">{pedido.direccion}</td>
              <td className="border p-2">{pedido.fecha}</td>
              <td className="border p-2">S/. {pedido.total.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>)
  }
  
  return (
    <div className="p-4 w-full mx-auto">
      <div className="flex-col w-full mx-auto mb-4">
          <header className="w-full flex justify-around p-1 mb-2">
            <h2 className="">Pedido 1</h2>
            <label htmlFor="date" >Fecha:
              <input type="date" id="date" className="ml-2" />
            </label>
          </header>
          <nav className="w-full flex flex-col gap-2">
            <label htmlFor="name" className="p-1 flex gap-2">Nombre:
              <input type="text" id="name" className="ml-2 w-md border-1"/>
            </label>
            <label htmlFor="adress" className="p-1 flex">Dirección:
              <input type="text" id="adress" className="ml-2 w-md border-1"/>
            </label>
          </nav>
        </div>
      <div className="p-4 grid grid-cols-2 gap-4">
      <h2 className="text-lg font-bold mb-2 col-span-full">Productos</h2>
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
          <tbody>
            {productosCol1.map((producto, index) => (
              <tr key={index}>
                <td className="border p-2 text-sm">{producto.nombre}</td>
                <td className="border p-2">
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
                    value={producto.precio || ""}
                    onChange={(e) => handleChange(index, "precio", Number(e.target.value))}
                    className=" p-1 w-full"
                  />
                </td>
                <td className="border p-2">{producto.importe.toFixed(2)}</td>
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
          <tbody>
            {productosCol2.map((producto, index) => (
              <tr key={index + mitad}>
                <td className="border p-2 text-sm">{producto.nombre}</td>
                <td className="border p-2">
                  <input
                    type="number"
                    value={producto.cantidad || ""}
                    onChange={(e) => handleChange(index + mitad, "cantidad", Number(e.target.value))}
                    className="p-1 w-full"
                  />
                </td>
                <td className="border p-2">
                  <input
                    type="number"
                    value={producto.precio || ""}
                    onChange={(e) => handleChange(index + mitad, "precio", Number(e.target.value))}
                    className="p-1 w-full"
                  />
                </td>
                <td className="border p-2">{producto.importe.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    <button onClick={handleAddPedido} className="col-span-2 bg-blue-500 text-white p-2 mt-4">Guardar Pedido</button>

{/* 8️⃣ Mostramos el total general de la venta */}
<div className="mt-4 text-right font-bold text-lg">
  Total S/: {productos.reduce((sum, p) => sum + p.importe, 0).toFixed(2)}
</div>

{/* Tabla Resumen de Productos Vendidos */}
<h2>Resumen de Productos Vendidos</h2>
<table className="border w-full">
  <thead>
    { getResumenProductos(productos).length > 0 && (
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
      <th className="border p-2">Total</th>
    </tr>
  </thead>
  <tbody>
    {pedidos.map((pedido) => (
      <tr key={pedido.id}>
        <td className="border p-2">Pedido #{pedido.id}</td>
        <td className="border p-2">S/. {pedido.total.toFixed(2)}</td>
      </tr>
    ))}
  </tbody>
</table>
    </div>
  );
};

export default PedidoTable;
