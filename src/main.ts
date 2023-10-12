import './style.css';

const canvas = document.querySelector('canvas') as HTMLCanvasElement;
const contexto = canvas?.getContext('2d');
const $puntaje = document.querySelector('span') as HTMLSpanElement;
let puntaje = 0;

const tamañoBloque = 20;
const anchoTabla = 14;
const altoTabla = 30;

// canvas no será null ni undefined
canvas.width = tamañoBloque * anchoTabla;
canvas.height = tamañoBloque * altoTabla;

contexto?.scale(tamañoBloque, tamañoBloque);

const tabla = crearTabla(anchoTabla, altoTabla);

function crearTabla(ancho: number, alto: number): number[][] {
  return Array(alto).fill([]).map(() => Array(ancho).fill(0));
}

const figura = {
  posicion: { x: 5, y: 5 },
  forma: [
    [1, 1],
    [1, 1],
  ],
};

const niveles = [
  { velocidad: 800, puntajeRequerido: 0 },
  { velocidad: 600, puntajeRequerido: 20 },
  { velocidad: 400, puntajeRequerido: 30 },
  { velocidad: 300, puntajeRequerido: 40 },
  { velocidad: 200, puntajeRequerido: 50 }
];

const figuras: number[][][] = [
  [
    [1, 1],
    [1, 1],
  ],

  [
    [1, 1, 1, 1],
  ],

  [
    [0, 1, 0],
    [1, 1, 1],
  ],

  [
    [1, 1, 0],
    [0, 1, 1],
  ],

  [
    [1, 0],
    [1, 0],
    [1, 1],
  ],
];

let contador = 0;
let ultimoTiempo = 0;

function cargar(tiempo = 0) {
  const deltaTime = tiempo - ultimoTiempo;
  ultimoTiempo = tiempo;

  contador += deltaTime;

  const nivelActual = determinarNivelActual(puntaje);
  const velocidadDeCaida = niveles[nivelActual].velocidad;

  if (contador > velocidadDeCaida) {
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

function determinarNivelActual(puntaje: number): number {

  for (let i = niveles.length - 1; i >= 0; i--) {
    if (puntaje >= niveles[i].puntajeRequerido) {
      return i
    }
  }
  return 0 //Nivel inicial
}

function dibujar() {
  contexto!.fillStyle = '#000';
  contexto?.fillRect(0, 0, canvas.width, canvas.height);

  tabla.forEach((fila, x) => {
    fila.forEach((valor, y) => {
      if (valor === 1) {
        contexto!.fillStyle = 'yellow';
        contexto!.fillRect(y, x, 1, 1);
      }
    });
  });

  figura.forma.forEach((fila, y) => {
    fila.forEach((valor, x) => {
      if (valor) {
        contexto!.fillStyle = 'red';
        contexto!.fillRect(x + figura.posicion.x, y + figura.posicion.y, 1, 1);
      }
    });
  });

  $puntaje!.innerText = puntaje.toString();
}

function chequearColisiones(): boolean {
  return figura.forma.find((fila, y) => {
    return fila.find((valor, x) => {
      return valor !== 0 && tabla[y + figura.posicion.y]?.[x + figura.posicion.x] !== 0;
    });
  }) !== undefined;
}

function solidificarFiguras() {
  figura.forma.forEach((fila, y) => {
    fila.forEach((valor, x) => {
      if (valor === 1) {
        tabla[y + figura.posicion.y][x + figura.posicion.x] = 1;
      }
    });
  });

  figura.posicion.x = Math.floor(anchoTabla / 2 - 2);
  figura.posicion.y = 0;

  figura.forma = figuras[Math.floor(Math.random() * figuras.length)];

  if (chequearColisiones()) {
    window.alert('Perdiste!! A seguir intentando...');
    tabla.forEach((fila) => fila.fill(0));
    puntaje = 0;
  }
}

document.addEventListener('keydown', evento => {
  if (evento.key === 'ArrowLeft') {
    figura.posicion.x--;
    if (chequearColisiones()) {
      figura.posicion.x++;
    }
  }

  if (evento.key === 'ArrowRight') {
    figura.posicion.x++;
    if (chequearColisiones()) {
      figura.posicion.x--;
    }
  }

  if (evento.key === 'ArrowDown') {
    figura.posicion.y++;
    if (chequearColisiones()) {
      figura.posicion.y--;
      solidificarFiguras();
      removerFila();
    }
  }

  if (evento.key === 'ArrowUp') {
    const rotacion: number[][] = [];
    for (let i = 0; i < figura.forma[0].length; i++) {
      const fila: number[] = [];
      for (let j = figura.forma.length - 1; j >= 0; j--) {
        fila.push(figura.forma[j][i]);
      }
      rotacion.push(fila);
    }
    const prevenirRotacion = figura.forma;
    figura.forma = rotacion;
    if (chequearColisiones()) {
      figura.forma = prevenirRotacion;
    }
  }
});

function removerFila() {
  const filasParaRemover: number[] = [];
  tabla.forEach((fila, y) => {
    if (fila.every(valor => valor === 1)) {
      filasParaRemover.push(y);
    }
  });

  filasParaRemover.forEach(y => {
    tabla.splice(y, 1);
    const nuevaFila = Array(anchoTabla).fill(0);
    tabla.unshift(nuevaFila);
    puntaje += 10;
  });
}

cargar();
