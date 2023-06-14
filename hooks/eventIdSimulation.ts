var numerosGenerados: number[] = []; // Almacena los números generados

export function eventIdSimulation(min: number, max: number): number {
  var numero = Math.floor(Math.random() * (max - min + 1)) + min; // Genera un número aleatorio entre min y max

  if (numerosGenerados.includes(numero)) {
    // Si el número ya ha sido generado, llamar recursivamente a la función para obtener uno nuevo
    return eventIdSimulation(min, max);
  } else {
    numerosGenerados.push(numero); // Agrega el número generado al arreglo
    return numero;
  }
}
