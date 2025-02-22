import React, { useState } from "react";
import { ColumnDef, useReactTable, getCoreRowModel, flexRender } from "@tanstack/react-table";
import { Producto } from "../data/Productos";
import { useResize } from "../hooks/useResize";
import { useProducts } from "../hooks/useProducts";
import PrintView from "./Print";

// 1️⃣ Definimos la tabla de pedidos
const PedidoTable: React.FC = () => {

  const { 
    productos,
    updateProduct,
    // resetProducts,
    // orderProducts,
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
  } = useProducts();
  
  const [showPrintView, setShowPrintView] = useState(false);
  const productosSeleccionados = productos.filter((p) => p.cantidad > 0 || (p.cambio ?? 0 > 0));
  // 🛠 Función para manejar cambios en los inputs
  const handleChange = (index: number, field: keyof Producto, value: string | number) => {
    updateProduct({ index, field, value });

  };

  const addPedido = () => {
    handleAddPedido();
  }

  // 6️⃣ Definimos las columnas para la tabla
  const columns: ColumnDef<Producto>[] = [
    { accessorKey: "nombre",
      header: "Producto",
      cell: ({ row }) => (
        <input
          type="text"
          value={row.original.nombre || ""}
          onChange={(e) => handleChange(row.index, "nombre", e.target.value as string)}
          className="border p-1 w-full"
        />
      ),
    },
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




  if (useResize({ breakpoint: 740 })) {
    return (
      <div>
        <div className="p-4 w-full mx-auto" id="no-print">
          <div className="flex-col w-full mx-auto mb-4">
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
          <button onClick={addPedido} className="col-span-2 bg-blue-500 text-white p-2 mt-4 mb-4">Guardar Pedido</button>
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
                  <td className="border p-1 ">
                    <input
                        type="text"
                        value={producto.nombre || ""}
                        onChange={(e) => handleChange(index, "nombre", e.target.value as string)}
                    />
                  </td>
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
        {/* 8️⃣ Mostramos el total general de la venta */}
        <div className="mt-4 text-right font-bold text-lg">
          Total S/: {productos.reduce((sum, p) => sum + p.importe, 0).toFixed(2)}
        </div>
        <button onClick={addPedido} className="col-span-2 bg-blue-500 text-white p-2 mt-4">Guardar Pedido</button>
        <button onClick={() => setShowPrintView(true)}  >Print</button>
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
              cantidad.cantidad > 0 && (
                <tr key={producto}>
                  <td className="border p-2">{producto}</td>
                  <td className="border p-2 text-center">{cantidad.cantidad}</td>
                </tr>
                )
            ))}
          </tbody>
        </table>
        <h3 className="text-md font-bold mt-4">Monto total del Día: S/. {total.toFixed(2)}</h3>
      </div>
      <div id="#print-section">
        {/* Mostrar el componente de impresión solo si hay productos seleccionados */}
        {showPrintView && (
          <PrintView 
            productos={productosSeleccionados} 
            pedidoNumero={pedidoSeleccionado !== null ? pedidoSeleccionado : pedidos.length + 1}
            fecha={fecha} 
            cliente={cliente} 
            direccion={direccion} 
            onClose={() => setShowPrintView(false)} 
          />
        )}
      </div>
    </div>)
  }

  console.log("se ejecuta")

  
  return (
    <div>
      <main id="no-print" className="p-4 w-full flex flex-col gap-1 itmes-center">
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
                      <td className="border p-1 ">
                        <input
                            type="text"
                            value={producto.nombre || ""}
                            onChange={(e) => handleChange(index, "nombre", e.target.value as string)}
                        />
                      </td>
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
          <table className="border-collapse text-xs border w-full">
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
                  <td className="border p-1 ">
                    <input
                        type="text"
                        value={producto.nombre || ""}
                        onChange={(e) => handleChange(index, "nombre", e.target.value as string)}
                    />
                  </td>
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
      {/* 8️⃣ Mostramos el total general de la venta */}
      <div className="mt-4 text-right font-bold text-lg">
        Total S/: {productos.reduce((sum, p) => sum + p.importe, 0).toFixed(2)}
      </div>
      <div className="flex justify-center gap-4">
        <button onClick={addPedido}>Guardar Pedido</button>
        <button onClick={() => setShowPrintView(true)}  >Print</button>
      </div>
      
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
            cantidad.cantidad > 0 && (
            <tr key={producto}>
              <td className="border p-2">{producto}</td>
              <td className="border p-2 text-center">{cantidad.cantidad}</td>
            </tr>
            )
          ))}
        </tbody>
      </table>
      <h3 className="text-md font-bold mt-4">Monto total del Día: S/. {total.toFixed(2)}</h3>

      </main>
      <div id="print-section">
        {/* Mostrar el componente de impresión solo si hay productos seleccionados */}
        {showPrintView && (
          <PrintView 
            productos={productosSeleccionados} 
            pedidoNumero={pedidoSeleccionado !== null ? pedidoSeleccionado : pedidos.length + 1}
            fecha={fecha} 
            cliente={cliente} 
            direccion={direccion} 
            onClose={() => setShowPrintView(false)} 
          />
        )}
      </div>
    </div>
  );
};

export default PedidoTable;
