import React from "react";
import { Producto } from "../data/Productos";

interface PrintViewProps {
  productos: Producto[];
  pedidoNumero: number;
  fecha: string;
  cliente: string;
  direccion: string;
  onClose: () => void;
}

// Función para dividir productos en columnas cuando sean más de 15
const splitProducts = (productos: Producto[], threshold: number) => {
  if (productos.length <= threshold) return [productos];
  if (productos.length >= threshold * 2) {
    const part = Math.ceil(productos.length / 3);
    return [productos.slice(0, part), productos.slice(part, part * 2), productos.slice(part * 2)];
  }
  const half = Math.ceil(productos.length / 2);
  return [productos.slice(0, half), productos.slice(half)];
};

const PrintView: React.FC<PrintViewProps> = ({ 
  productos, 
  pedidoNumero, 
  fecha, 
  cliente, 
  direccion, 
  onClose 
}) => {
  const productColumns = splitProducts(productos, 20);
  
  return (
    <div className="fixed top-0 left-0 w-full h-screen bg-gray-800 p-8">
      {/* Cabecera del Pedido */}
      <div className="w-full">
        <div className="flex flex-col w-full mx-auto mb-2">
          <header className="w-full flex p-1 mb-2">
            <span className="absolute">{fecha}</span>
            <h2 className="text-lg font-bold mx-auto">Pedido {pedidoNumero}</h2>
          </header>
          <div className="w-full flex flex-col gap-2">
            <p className="p-1"><strong>Cliente:</strong> {cliente}</p>
            <p className="p-1"><strong>Dirección:</strong> {direccion}</p>
          </div>
        </div>

        {/* Tabla de productos */}
        <h2 className="text-lg font-bold text-center mb-2">Productos</h2>
        <div className={`grid ${`grid-cols-${productColumns.length}`
        } ${productColumns.length === 3 ? "grid-flow-col" : ""
        } gap-4`}>
          {productColumns.map((column, index) => (
            <table key={index} className="w-full border-collapse border border-gray-300 text-sm">
              <thead>
                <tr className="bg-gray-500">
                  <th className="border border-gray-300 p-1">Producto</th>
                  <th className="border border-gray-300 p-1">Cantidad</th>
                  <th className="border border-gray-300 p-1">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {column.map((producto, idx) => (
                  producto.cantidad > 0 && (
                    <tr key={idx} className="border border-gray-300">
                      <td className="border border-gray-300 p-1">{producto.nombre}</td>
                      <td className="border border-gray-300 p-1 text-center">{producto.cantidad}</td>
                      <td className="border border-gray-300 p-1 text-center">
                        S/. {producto.cantidad > 0 ? producto.importe : 0}
                      </td>
                    </tr>
                  )
                ))}
              </tbody>
            </table>
          ))}
        </div>

        {/* Total */}
        <div className="mt-2 text-right font-bold text-lg">
          Total S/: {productos.reduce((sum, p) => sum + p.importe, 0).toFixed(2)}
        </div>

        {/* Tabla de Cambios */}
        {/* 🛑 Solo se muestra si hay cambios */}
        {productos.some(p => (p.cambio ?? 0) > 0) && (
          <>
            <h2 className="text-lg font-bold text-center mb-2">Cambios</h2>
            <table className="w-full border-collapse border border-gray-300 text-sm">
              <thead>
                <tr className="bg-gray-500">
                  <th className="border border-gray-300 p-2">Producto</th>
                  <th className="border border-gray-300 p-2">Cantidad</th>
                </tr>
              </thead>
              <tbody>
                {productos.map((p, index) => (
                  (p.cambio ?? 0) > 0 && (
                    <tr key={index} className="border border-gray-300">
                      <td className="border border-gray-300 p-2">{p.nombre}</td>
                      <td className="border border-gray-300 p-2 text-center">{p.cambio}</td>
                    </tr>
                  )
                ))}
              </tbody>
            </table>
          </>
        )}

        {/* 🛑 Botones ocultos al imprimir */}
        <div id="no-print" className="mt-6 flex justify-end space-x-4 print:hidden">
          <button onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded">Cerrar</button>
          <button onClick={() => window.print()} className="bg-blue-500 text-white px-4 py-2 rounded">Imprimir</button>
        </div>
      </div>
    </div>
    
  );
};
console.log("se ejecuta")

export default PrintView;
