import React, { useState } from "react";
import { ColumnDef, useReactTable, getCoreRowModel, flexRender } from "@tanstack/react-table";

// 1️⃣ Definimos el tipo de dato para cada producto
type Producto = {
  nombre: string;
  cantidad: number;
  precioUnitario: number;
  importe: number;
  ventaPorDocena: boolean;
};

// 2️⃣ Creamos una lista base de productos
const productosBase: Producto[] = [
  { nombre: "PAPAS LAYS Fiesta", cantidad: 0, precioUnitario: 0, importe: 0, ventaPorDocena: false},
  { nombre: "PIQUEOS SNAX Fiesta", cantidad: 0, precioUnitario: 0, importe: 0, ventaPorDocena: false},
  { nombre: "DORITOS Fiesta", cantidad: 0, precioUnitario: 0, importe: 0, ventaPorDocena: false},
  { nombre: "CHIZITOS Fiesta", cantidad: 0, precioUnitario: 0, importe: 0, ventaPorDocena: false},
  { nombre: "CHEETOS Fiesta", cantidad: 0, precioUnitario: 0, importe: 0, ventaPorDocena: false},
  { nombre: " ", cantidad: 0, precioUnitario: 0, importe: 0, ventaPorDocena: false},
  { nombre: "PAPAS LAYS HILO", cantidad: 0, precioUnitario: 0, importe: 0, ventaPorDocena: false},
  { nombre: "PIQUEOS SNAX", cantidad: 0, precioUnitario: 0, importe: 0, ventaPorDocena: false},
  { nombre: "TOR TEES NATURAL", cantidad: 0, precioUnitario: 0, importe: 0, ventaPorDocena: false},
  { nombre: "TOR TEES PICANTE", cantidad: 0, precioUnitario: 0, importe: 0, ventaPorDocena: false},
  { nombre: "PAPAS LAYS", cantidad: 0, precioUnitario: 0, importe: 0, ventaPorDocena: false},
  { nombre: "PAPA ONDA PIC.", cantidad: 0, precioUnitario: 0, importe: 0, ventaPorDocena: false},
  { nombre: "DORITOS Q. ATREVIDO", cantidad: 0, precioUnitario: 0, importe: 0, ventaPorDocena: false},
  { nombre: "DORITOS FUEGO", cantidad: 0, precioUnitario: 0, importe: 0, ventaPorDocena: false},
  { nombre: "CHEETOS NATURAL", cantidad: 0, precioUnitario: 0, importe: 0, ventaPorDocena: false},
  { nombre: "CHEETOS PICANTE", cantidad: 0, precioUnitario: 0, importe: 0, ventaPorDocena: false},
  { nombre: "CHEESE TRIS", cantidad: 0, precioUnitario: 0, importe: 0, ventaPorDocena: false},
  { nombre: " ", cantidad: 0, precioUnitario: 0, importe: 0, ventaPorDocena: true},
  { nombre: "PAPAS LAYS HILO", cantidad: 0, precioUnitario: 18, importe: 0, ventaPorDocena: true},
  { nombre: "PIQUOS SNAX", cantidad: 0, precioUnitario: 20, importe: 0, ventaPorDocena: true},
  { nombre: "DORITOS Q. ATREVIDO",cantidad: 0, precioUnitario: 20, importe: 0, ventaPorDocena: true},
  { nombre: "DORITOS PICANTE", cantidad: 0, precioUnitario: 20, importe: 0, ventaPorDocena: true},
  { nombre: "DORITOS FLAMING", cantidad: 0, precioUnitario: 20, importe: 0, ventaPorDocena: true},
  { nombre: "DINAMITA", cantidad: 0, precioUnitario: 20, importe: 0, ventaPorDocena: true},
  { nombre: "CARIBAS CAMOTE", cantidad: 0, precioUnitario: 20, importe: 0, ventaPorDocena: true},
  { nombre: "TOR TEES PICANTE", cantidad: 0, precioUnitario: 20, importe: 0, ventaPorDocena: true},
  { nombre: "TOR TEES NATURAL", cantidad: 0, precioUnitario: 20, importe: 0, ventaPorDocena: true},
  { nombre: "CHICHARRONES", cantidad: 0, precioUnitario: 18, importe: 0, ventaPorDocena: true},
  { nombre: " ", cantidad: 0, precioUnitario: 0, importe: 0, ventaPorDocena: true},
  { nombre: "PAPAS LAYS", cantidad: 0, precioUnitario: 18, importe: 0, ventaPorDocena: true},
  { nombre: "PAPAS LAYS ONDA PIC.", cantidad: 0, precioUnitario: 18, importe: 0, ventaPorDocena: true},
  { nombre: "LAYS POLLO A LA BRASA", cantidad: 0, precioUnitario: 18, importe: 0, ventaPorDocena: true},
  { nombre: "PAPAS ONDA ANTURAL", cantidad: 0, precioUnitario: 18, importe: 0, ventaPorDocena: true},
  { nombre: "PAPAS LAYS HOT", cantidad: 0, precioUnitario: 18, importe: 0, ventaPorDocena: true},
  { nombre: "CHEESE TRIS", cantidad: 0, precioUnitario: 15, importe: 0, ventaPorDocena: true},
  { nombre: "CHEETOS PICANTE", cantidad: 0, precioUnitario: 15, importe: 0, ventaPorDocena: true},
  { nombre: "CHEETOS MEGA QUESO", cantidad: 0, precioUnitario: 15, importe: 0, ventaPorDocena: true},
  { nombre: "CHIZITO", cantidad: 0, precioUnitario: 10, importe: 0, ventaPorDocena: true},
  { nombre: "CHEETOS FLAMING", cantidad: 0, precioUnitario: 15, importe: 0, ventaPorDocena: true},
  { nombre: "CHEETOS BOLIQUESO", cantidad: 0, precioUnitario: 15, importe: 0, ventaPorDocena: true},

  { nombre: "CUATES PICANTE", cantidad: 0, precioUnitario: 10, importe: 0, ventaPorDocena: true},
  { nombre: "CUATES NATURAL", cantidad: 0, precioUnitario: 10, importe: 0, ventaPorDocena: true},
  { nombre: "CUATES TWIST", cantidad: 0, precioUnitario: 10, importe: 0, ventaPorDocena: true},
  { nombre: "CUATES RANCHERITOS", cantidad: 0, precioUnitario: 10, importe: 0, ventaPorDocena: true},
  { nombre: "CHIFLE KARINTO", cantidad: 0, precioUnitario: 18, importe: 0, ventaPorDocena: true},
  { nombre: "MANI TUBULAR SALADO", cantidad: 0, precioUnitario: 15, importe: 0, ventaPorDocena: true},
  { nombre: "MANI TUBULAR CLASICO", cantidad: 0, precioUnitario: 15, importe: 0, ventaPorDocena: true},
  { nombre: "MANI TUBULAR PICANTE", cantidad: 0, precioUnitario: 15, importe: 0, ventaPorDocena: true},
  { nombre: "HABAS TUBULAR", cantidad: 0, precioUnitario: 20, importe: 0, ventaPorDocena: true},
  { nombre: "PAPA BUCKY", cantidad: 0, precioUnitario: 10, importe: 0, ventaPorDocena: true},
  { nombre: "TORTILLA PICANTE", cantidad: 0, precioUnitario: 10, importe: 0, ventaPorDocena: true},
  { nombre: "TORTILLA NATURAL", cantidad: 0, precioUnitario: 10, importe: 0, ventaPorDocena: true},
  { nombre: "NACHO QUESO", cantidad: 0, precioUnitario: 10, importe: 0, ventaPorDocena: true},
  { nombre: "NACHO PICANTE", cantidad: 0, precioUnitario: 10, importe: 0, ventaPorDocena: true},
  { nombre: "SPECIAL CHIP", cantidad: 0, precioUnitario: 10, importe: 0, ventaPorDocena: true},
  { nombre: "BUCKY PAPA PICANTE", cantidad: 0, precioUnitario: 10, importe: 0, ventaPorDocena: true},
  { nombre: "BUCKY PAPA MAYONESA", cantidad: 0, precioUnitario: 10, importe: 0, ventaPorDocena: true},
  { nombre: "CHICHARRON", cantidad: 0, precioUnitario: 10, importe: 0, ventaPorDocena: true},
  { nombre: "CHIFLE SALADO", cantidad: 0, precioUnitario: 10, importe: 0, ventaPorDocena: true},
  { nombre: " ", cantidad: 0, precioUnitario: 0, importe: 0, ventaPorDocena: true},
  { nombre: "CANCHA BUCKY", cantidad: 0, precioUnitario: 10, importe: 0, ventaPorDocena: true},
  { nombre: "CANCHA DULCE BUCKY", cantidad: 0, precioUnitario: 10, importe: 0, ventaPorDocena: true},
  { nombre: "CHEESE BUCKY", cantidad: 0, precioUnitario: 10, importe: 0, ventaPorDocena: true},
  { nombre: "CHEESE PIC BUCKY", cantidad: 0, precioUnitario: 10, importe: 0, ventaPorDocena: true},
  { nombre: " ", cantidad: 0, precioUnitario: 0, importe: 0, ventaPorDocena: true},
  { nombre: "CANCHA SALADA", cantidad: 0, precioUnitario: 10, importe: 0, ventaPorDocena: true},
  { nombre: "CANCHA DULCE", cantidad: 0, precioUnitario: 10, importe: 0, ventaPorDocena: true},
  { nombre: "CHEESE TRICKS", cantidad: 0, precioUnitario: 10, importe: 0, ventaPorDocena: true},
  { nombre: "CHEESE PIC. TRICKS",  cantidad: 0, precioUnitario: 10, importe: 0, ventaPorDocena: true},
  { nombre: " ", cantidad: 0, precioUnitario: 0, importe: 0, ventaPorDocena: true},
  { nombre: "CANCHITA SALADA", cantidad: 0, precioUnitario: 5, importe: 0, ventaPorDocena: true},
  { nombre: "CANCHITA DULCE", cantidad: 0, precioUnitario: 5, importe: 0, ventaPorDocena: true},
  { nombre: "CHEESE", cantidad: 0, precioUnitario: 5, importe: 0, ventaPorDocena: true},
  { nombre: "CHEESE PIC", cantidad: 0, precioUnitario: 5, importe: 0, ventaPorDocena: true},
  { nombre: "STICKS", cantidad: 0, precioUnitario: 5, importe: 0, ventaPorDocena: true},
  { nombre: "STICKS PICANTE", cantidad: 0, precioUnitario: 5, importe: 0, ventaPorDocena: true},
  { nombre: "BOLI TRICKS", cantidad: 0, precioUnitario: 5, importe: 0, ventaPorDocena: true},
  { nombre: "BOLI TRICKS PIC", cantidad: 0, precioUnitario: 5, importe: 0, ventaPorDocena: true},
  { nombre: "RICKY TOY NAT", cantidad: 0, precioUnitario: 10, importe: 0, ventaPorDocena: true},
  { nombre: "RICKY TOY PIC", cantidad: 0, precioUnitario: 10, importe: 0, ventaPorDocena: true}
];

const PedidoTable: React.FC = () => {
  // 3️⃣ Usamos estado para almacenar la lista de productos
  const [productos, setProductos] = useState<Producto[]>(productosBase);


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
      newProductos[index].importe = newProductos[index].cantidad * newProductos[index].precioUnitario;
      if (newProductos[index].ventaPorDocena) {
        newProductos[index].importe = (newProductos[index].cantidad / 12) * newProductos[index].precioUnitario;
      }

      return newProductos; // 🔄 Actualizamos el estado con la nueva lista de productos
    });
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
          value={row.original.precioUnitario || ""}
          onChange={(e) => handleChange(row.index, "precioUnitario", Number(e.target.value))}
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

  return (
    <div className="p-4">
      <div className="p-4 grid grid-cols-2 gap-4">
      <div>
        <h2 className="text-lg font-bold mb-2">Columna 1</h2>
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
                <td className="border p-2">{producto.nombre}</td>
                <td className="border p-2">
                  <input
                    type="number"
                    value={producto.cantidad || ""}
                    onChange={(e) => handleChange(index, "cantidad", Number(e.target.value))}
                    className="border p-1 w-full"
                  />
                </td>
                <td className="border p-2">
                  <input
                    type="number"
                    value={producto.precioUnitario || ""}
                    onChange={(e) => handleChange(index, "precioUnitario", Number(e.target.value))}
                    className="border p-1 w-full"
                  />
                </td>
                <td className="border p-2">{producto.importe.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div>
        <h2 className="text-lg font-bold mb-2">Columna 2</h2>
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
                <td className="border p-2">{producto.nombre}</td>
                <td className="border p-2">
                  <input
                    type="number"
                    value={producto.cantidad || ""}
                    onChange={(e) => handleChange(index + mitad, "cantidad", Number(e.target.value))}
                    className="border p-1 w-full"
                  />
                </td>
                <td className="border p-2">
                  <input
                    type="number"
                    value={producto.precioUnitario || ""}
                    onChange={(e) => handleChange(index + mitad, "precioUnitario", Number(e.target.value))}
                    className="border p-1 w-full"
                  />
                </td>
                <td className="border p-2">{producto.importe.toFixed(2)}</td>
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
          { getResumenProductos(productos).map((resumen) => (
            <tr key={resumen.nombre}>
              <td className="border p-2">{resumen.nombre}</td>
              <td className="border p-2 text-center">{resumen.totalCantidad}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PedidoTable;
