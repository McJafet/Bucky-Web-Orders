import { useState, useEffect } from "react";

export function useFecha() {
  const obtenerFechaActual = () => {
      const fecha = new Date();
      const day = (fecha.getDate() + 1).toString().padStart(2, '0');
      const month = (fecha.getMonth() + 1).toString().padStart(2, '0');
      const year = fecha.getFullYear();
      return `${year}-${month}-${day}`;
  };

  const [newFecha, setFecha] = useState<string>(obtenerFechaActual());

  useEffect(() => {
      setFecha(obtenerFechaActual());
  }, []);

  return { newFecha };
}