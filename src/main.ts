import './style.css'

const canvas = document.querySelector('canvas');
const contexto = canvas?.getContext('2d');

const tamañoBloque = 20;
const anchoTabla = 14;
const altoTabla = 30;

//canvas no será null ni undefined
canvas!.width = tamañoBloque * anchoTabla;
canvas!.height = tamañoBloque * altoTabla;

contexto?.scale(tamañoBloque, tamañoBloque);


const tabla = [

  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1]

]

const figura = {

  posicion: { x: 5, y: 5 },
  forma: [

    [1, 1],
    [1, 1],

  ]

}

const figuras = [
  [
    [1, 1],
    [1, 1]
  ],

  [
  [1, 1, 1, 1]
  ],

  [
    [0, 1, 0],
    [1, 1, 1]
  ],

  [
    [1, 1, 0],
    [0, 1, 1]
  ],

  [
    [1, 0],
    [1, 0],
    [1, 1]
  ],

]

let contador = 0;
let ultimoTiempo = 0;

function cargar(tiempo = 0) {
  const deltaTime = tiempo - ultimoTiempo;
  ultimoTiempo = tiempo;

  contador += deltaTime;

  if (contador > 1000) {
    figura.posicion.y++;
    contador = 0;

    if (chequearColisiones()) {
      figura.posicion.y--;
      solidificarFiguras();
      removerFila();
    }
  }

  dibujar();
  window.requestAnimationFrame(cargar);
}

function dibujar() {
  contexto!.fillStyle = '#000';
  contexto?.fillRect(0, 0, canvas!.width, canvas!.height);

  tabla.forEach((fila, x) => {

    fila.forEach((valor, y) => {
      if (valor === 1) {
        contexto!.fillStyle = 'yellow';
        contexto!.fillRect(y, x, 1, 1);
      }
    })

  })

  figura.forma.forEach((fila, y) => {

    fila.forEach((valor, x) => {
      if (valor) {
        contexto!.fillStyle = 'red';
        contexto!.fillRect(x + figura.posicion.x, y + figura.posicion.y, 1, 1);
      }
    })

  });

}

//   // ?. //   le estás diciendo a TypeScript que, si el objeto o valor antes del operador es null o undefined,
//simplemente se debe devolver undefined en lugar de lanzar un error.

function chequearColisiones() {

  return figura.forma.find((fila, y) => {
    return fila.find((valor, x) => {
      return (
        valor !== 0 &&
        tabla[y + figura.posicion.y]?.[x + figura.posicion.x] !== 0
      )
    })
  })

}

function solidificarFiguras() {
  figura.forma.forEach((fila, y) => {
    fila.forEach((valor, x) => {
      if (valor === 1) {
        tabla[y + figura.posicion.y][x + figura.posicion.x] = 1
      }
    })
  })

  //Traer figuras random
  figura.forma = figuras[Math.floor(Math.random() * figuras.length)]

  //Resetear posicion
  figura.posicion.x = 0;
  figura.posicion.y = 0;
}


document.addEventListener('keydown', evento => {

  if (evento.key === 'ArrowLeft') {

    figura.posicion.x--

    if (chequearColisiones()) {

      figura.posicion.x++

    }
  }

  if (evento.key === 'ArrowRight') {

    figura.posicion.x++

    if (chequearColisiones()) {

      figura.posicion.x--

    }
  }

  if (evento.key === 'ArrowDown') {

    figura.posicion.y++

    if (chequearColisiones()) {

      figura.posicion.y--
      solidificarFiguras()
      removerFila()

    }
  }

})

function removerFila() {
  const filasParaRemover: number[] = [];

  tabla.forEach((fila, y) => {
    if (fila.every(valor => valor === 1)) {
      filasParaRemover.push(y);
    }
  })


  filasParaRemover.forEach(y => {
    tabla.splice(y, 1)
    const nuevaFila = Array(anchoTabla).fill(0);
    tabla.unshift(nuevaFila);
  })
}

cargar();
