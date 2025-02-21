export interface Producto {
    id?: number;
    nombre: string;
    cantidad: number;
    cambio?: number;
    precio: number;
    importe: number;
    ventaPorDocena: boolean;
}

const productosBase: Producto[] = [
    { nombre: "PAPAS LAYS FIESTA", cantidad: 0, cambio: 0, precio: 6, importe: 0, ventaPorDocena: false},
    { nombre: "PIQUEOS SNAX FIESTA", cantidad: 0, cambio: 0, precio: 6, importe: 0, ventaPorDocena: false},
    { nombre: "DORITOS FIESTA", cantidad: 0, cambio: 0, precio: 6, importe: 0, ventaPorDocena: false},
    { nombre: "CHIZITOS FIESTA", cantidad: 0, cambio: 0, precio: 4.5, importe: 0, ventaPorDocena: false},
    { nombre: "CHEETOS FIESTA", cantidad: 0, cambio: 0, precio: 5, importe: 0, ventaPorDocena: false},
    { nombre: " ", cantidad: 0, cambio: 0, precio: 0, importe: 0, ventaPorDocena: false},
    { nombre: "PAPAS LAYS HILO BOLSAZA", cantidad: 0, cambio: 0, precio: 2.5, importe: 0, ventaPorDocena: false},
    { nombre: "PIQUEOS SNAX BOLSAZA", cantidad: 0, cambio: 0, precio: 3, importe: 0, ventaPorDocena: false},
    { nombre: "TOR TEES NATURAL BOLSAZA", cantidad: 0, cambio: 0, precio: 3, importe: 0, ventaPorDocena: false},
    { nombre: "TOR TEES PICANTE BOLSAZA", cantidad: 0, cambio: 0, precio: 3, importe: 0, ventaPorDocena: false},
    { nombre: "PAPAS LAYS BOLSAZA", cantidad: 0, cambio: 0, precio: 2.5, importe: 0, ventaPorDocena: false},
    { nombre: "PAPA ONDA PIC. BOLSAZA", cantidad: 0, cambio: 0, precio: 2.5, importe: 0, ventaPorDocena: false},
    { nombre: "DORITOS Q. ATREVIDO BOLSAZA", cantidad: 0, cambio: 0, precio: 3, importe: 0, ventaPorDocena: false},
    { nombre: "DORITOS FUEGO BOLSAZA", cantidad: 0, cambio: 0, precio: 3, importe: 0, ventaPorDocena: false},
    { nombre: "CHEETOS NATURAL BOLSAZA", cantidad: 0, cambio: 0, precio: 2.5, importe: 0, ventaPorDocena: false},
    { nombre: "CHEETOS PICANTE BOLSAZA", cantidad: 0, cambio: 0, precio: 2.5, importe: 0, ventaPorDocena: false},
    { nombre: "CHEESE TRIS BOLSAZA", cantidad: 0, cambio: 0, precio: 2.5, importe: 0, ventaPorDocena: false},
    { nombre: " ", cantidad: 0, cambio: 0, precio: 0, importe: 0, ventaPorDocena: true},
    { nombre: "PAPAS LAYS HILO", cantidad: 0, cambio: 0, precio: 18, importe: 0, ventaPorDocena: true},
    { nombre: "PIQUOS SNAX", cantidad: 0, cambio: 0, precio: 20, importe: 0, ventaPorDocena: true},
    { nombre: "DORITOS Q. ATREVIDO",cantidad: 0, cambio: 0, precio: 20, importe: 0, ventaPorDocena: true},
    { nombre: "DORITOS PICANTE", cantidad: 0, cambio: 0, precio: 20, importe: 0, ventaPorDocena: true},
    { nombre: "DORITOS FLAMING", cantidad: 0, cambio: 0, precio: 20, importe: 0, ventaPorDocena: true},
    { nombre: "DINAMITA", cantidad: 0, cambio: 0, precio: 20, importe: 0, ventaPorDocena: true},
    { nombre: "CARIBAS CAMOTE", cantidad: 0, cambio: 0, precio: 20, importe: 0, ventaPorDocena: true},
    { nombre: "TOR TEES PICANTE", cantidad: 0, cambio: 0, precio: 20, importe: 0, ventaPorDocena: true},
    { nombre: "TOR TEES NATURAL", cantidad: 0, cambio: 0, precio: 20, importe: 0, ventaPorDocena: true},
    { nombre: "CHICHARRONES", cantidad: 0, cambio: 0, precio: 18, importe: 0, ventaPorDocena: true},
    { nombre: " ", cantidad: 0, cambio: 0, precio: 0, importe: 0, ventaPorDocena: true},
    { nombre: "PAPAS LAYS", cantidad: 0, cambio: 0, precio: 18, importe: 0, ventaPorDocena: true},
    { nombre: "PAPAS LAYS ONDA PIC.", cantidad: 0, cambio: 0, precio: 18, importe: 0, ventaPorDocena: true},
    { nombre: "LAYS POLLO A LA BRASA", cantidad: 0, cambio: 0, precio: 18, importe: 0, ventaPorDocena: true},
    { nombre: "PAPAS ONDA ANTURAL", cantidad: 0, cambio: 0, precio: 18, importe: 0, ventaPorDocena: true},
    { nombre: "PAPAS LAYS HOT", cantidad: 0, cambio: 0, precio: 18, importe: 0, ventaPorDocena: true},
    { nombre: "CHEESE TRIS", cantidad: 0, cambio: 0, precio: 15, importe: 0, ventaPorDocena: true},
    { nombre: "CHEETOS PICANTE", cantidad: 0, cambio: 0, precio: 15, importe: 0, ventaPorDocena: true},
    { nombre: "CHEETOS MEGA QUESO", cantidad: 0, cambio: 0, precio: 15, importe: 0, ventaPorDocena: true},
    { nombre: "CHIZITO", cantidad: 0, cambio: 0, precio: 10, importe: 0, ventaPorDocena: true},
    { nombre: "CHEETOS FLAMING", cantidad: 0, cambio: 0, precio: 15, importe: 0, ventaPorDocena: true},
    { nombre: "CHEETOS BOLIQUESO", cantidad: 0, cambio: 0, precio: 15, importe: 0, ventaPorDocena: true},
  
    { nombre: "CUATES PICANTE", cantidad: 0, cambio: 0, precio: 10, importe: 0, ventaPorDocena: true},
    { nombre: "CUATES NATURAL", cantidad: 0, cambio: 0, precio: 10, importe: 0, ventaPorDocena: true},
    { nombre: "CUATES TWIST", cantidad: 0, cambio: 0, precio: 10, importe: 0, ventaPorDocena: true},
    { nombre: "CUATES RANCHERITOS", cantidad: 0, cambio: 0, precio: 10, importe: 0, ventaPorDocena: true},
    { nombre: "CHIFLE KARINTO", cantidad: 0, cambio: 0, precio: 18, importe: 0, ventaPorDocena: true},
    { nombre: "MANI TUBULAR SALADO", cantidad: 0, cambio: 0, precio: 15, importe: 0, ventaPorDocena: true},
    { nombre: "MANI TUBULAR CLASICO", cantidad: 0, cambio: 0, precio: 15, importe: 0, ventaPorDocena: true},
    { nombre: "MANI TUBULAR PICANTE", cantidad: 0, cambio: 0, precio: 15, importe: 0, ventaPorDocena: true},
    { nombre: "HABAS TUBULAR", cantidad: 0, cambio: 0, precio: 20, importe: 0, ventaPorDocena: true},
    { nombre: "PAPA BUCKY", cantidad: 0, cambio: 0, precio: 10, importe: 0, ventaPorDocena: true},
    { nombre: "TORTILLA PICANTE", cantidad: 0, cambio: 0, precio: 10, importe: 0, ventaPorDocena: true},
    { nombre: "TORTILLA NATURAL", cantidad: 0, cambio: 0, precio: 10, importe: 0, ventaPorDocena: true},
    { nombre: "NACHO QUESO", cantidad: 0, cambio: 0, precio: 10, importe: 0, ventaPorDocena: true},
    { nombre: "NACHO PICANTE", cantidad: 0, cambio: 0, precio: 10, importe: 0, ventaPorDocena: true},
    { nombre: "SPECIAL CHIP", cantidad: 0, cambio: 0, precio: 10, importe: 0, ventaPorDocena: true},
    { nombre: "BUCKY PAPA PICANTE", cantidad: 0, cambio: 0, precio: 10, importe: 0, ventaPorDocena: true},
    { nombre: "BUCKY PAPA MAYONESA", cantidad: 0, cambio: 0, precio: 10, importe: 0, ventaPorDocena: true},
    { nombre: "CHICHARRON", cantidad: 0, cambio: 0, precio: 10, importe: 0, ventaPorDocena: true},
    { nombre: "CHIFLE SALADO", cantidad: 0, cambio: 0, precio: 10, importe: 0, ventaPorDocena: true},
    { nombre: " ", cantidad: 0, cambio: 0, precio: 0, importe: 0, ventaPorDocena: true},
    { nombre: "CANCHA BUCKY", cantidad: 0, cambio: 0, precio: 10, importe: 0, ventaPorDocena: true},
    { nombre: "CANCHA DULCE BUCKY", cantidad: 0, cambio: 0, precio: 10, importe: 0, ventaPorDocena: true},
    { nombre: "CHEESE BUCKY", cantidad: 0, cambio: 0, precio: 10, importe: 0, ventaPorDocena: true},
    { nombre: "CHEESE PIC BUCKY", cantidad: 0, cambio: 0, precio: 10, importe: 0, ventaPorDocena: true},
    { nombre: " ", cantidad: 0, cambio: 0, precio: 0, importe: 0, ventaPorDocena: true},
    { nombre: "CANCHA SALADA", cantidad: 0, cambio: 0, precio: 10, importe: 0, ventaPorDocena: true},
    { nombre: "CANCHA DULCE", cantidad: 0, cambio: 0, precio: 10, importe: 0, ventaPorDocena: true},
    { nombre: "CHEESE TRICKS", cantidad: 0, cambio: 0, precio: 10, importe: 0, ventaPorDocena: true},
    { nombre: "CHEESE PIC. TRICKS",  cantidad: 0, cambio: 0, precio: 10, importe: 0, ventaPorDocena: true},
    { nombre: " ", cantidad: 0, cambio: 0, precio: 0, importe: 0, ventaPorDocena: true},
    { nombre: "CANCHITA SALADA", cantidad: 0, cambio: 0, precio: 5, importe: 0, ventaPorDocena: true},
    { nombre: "CANCHITA DULCE", cantidad: 0, cambio: 0, precio: 5, importe: 0, ventaPorDocena: true},
    { nombre: "CHEESE", cantidad: 0, cambio: 0, precio: 5, importe: 0, ventaPorDocena: true},
    { nombre: "CHEESE PIC", cantidad: 0, cambio: 0, precio: 5, importe: 0, ventaPorDocena: true},
    { nombre: "STICKS", cantidad: 0, cambio: 0, precio: 5, importe: 0, ventaPorDocena: true},
    { nombre: "STICKS PICANTE", cantidad: 0, cambio: 0, precio: 5, importe: 0, ventaPorDocena: true},
    { nombre: "BOLI TRICKS", cantidad: 0, cambio: 0, precio: 5, importe: 0, ventaPorDocena: true},
    { nombre: "BOLI TRICKS PIC", cantidad: 0, cambio: 0, precio: 5, importe: 0, ventaPorDocena: true},
    { nombre: "RICKY TOY NAT", cantidad: 0, cambio: 0, precio: 10, importe: 0, ventaPorDocena: true},
    { nombre: "RICKY TOY PIC", cantidad: 0, cambio: 0, precio: 10, importe: 0, ventaPorDocena: true}
  ].map((producto, index) => ({ id: index + 1, ...producto }));

  export default productosBase;