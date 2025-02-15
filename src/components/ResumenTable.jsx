export function ResumenTable() {
    return (
        <div className="flex flex-col items-center">
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
        </div>
    )
}