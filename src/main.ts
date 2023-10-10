import './style.css'

const canvas = document.querySelector('canvas');
const contexto = canvas?.getContext('2d');
const $puntaje = document.querySelector('span');
let puntaje = 0;

const tamañoBloque = 20;
const anchoTabla = 14;
const altoTabla = 30;

//canvas no será null ni undefined
canvas!.width = tamañoBloque * anchoTabla;
canvas!.height = tamañoBloque * altoTabla;

contexto?.scale(tamañoBloque, tamañoBloque);
//coordenadas y dimensiones del juego se ajusten a la medida definida por tamañoBloque


const tabla = crearTabla(anchoTabla, altoTabla);

function crearTabla(ancho:number, alto:number) {
  return Array(alto).fill([]).map(() => Array(ancho).fill(0))
}

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
  // Esta función se utiliza para dibujar el estado actual del juego en el lienzo (canvas).

  contexto!.fillStyle = '#000';
  // Establece el color de relleno del contexto del lienzo en negro (#000), lo que limpiará cualquier dibujo anterior.

  contexto?.fillRect(0, 0, canvas!.width, canvas!.height);
  // Dibuja un rectángulo negro que cubre todo el lienzo, lo que esencialmente borra el contenido anterior y crea un lienzo limpio.

  tabla.forEach((fila, x) => {
    // Itera a través de las filas del tablero (matriz 'tabla') junto con su índice 'x'.

    fila.forEach((valor, y) => {
      // Itera a través de los valores en cada fila junto con su índice 'y'.

      if (valor === 1) {
        // Si el valor en la celda es igual a 1, indica que hay una pieza en esa posición.

        contexto!.fillStyle = 'yellow';
        // Establece el color de relleno del contexto del lienzo en amarillo ('yellow').

        contexto!.fillRect(y, x, 1, 1);
        // Dibuja un cuadro amarillo de tamaño 1x1 en las coordenadas (y, x) en el lienzo. Esto representa una celda de la pieza en el tablero.
      }
    })
  })

  figura.forma.forEach((fila, y) => {
    // Itera a través de las filas de la forma de la figura actual junto con su índice 'y'.

    fila.forEach((valor, x) => {
      // Itera a través de los valores en cada fila de la forma de la figura junto con su índice 'x'.

      if (valor) {
        // Si el valor en la celda es verdadero (distinto de 0), indica que hay una parte de la figura en esa posición.

        contexto!.fillStyle = 'red';
        // Establece el color de relleno del contexto del lienzo en rojo ('red').

        contexto!.fillRect(x + figura.posicion.x, y + figura.posicion.y, 1, 1);
        // Dibuja un cuadro rojo de tamaño 1x1 en las coordenadas ajustadas (x + figura.posicion.x, y + figura.posicion.y) en el lienzo. Esto representa una celda de la figura en el tablero.
      }
    })
  });

  //Usar toString():
  //template literals $puntaje.innerText = `${puntaje}`;
  // o el metodo strin() $puntaje.innerText = String(puntaje);
  $puntaje!.innerText = puntaje.toString();
}


//   // ?. //   le estás diciendo a TypeScript que, si el objeto o valor antes del operador es null o undefined,
//simplemente se debe devolver undefined en lugar de lanzar un error.

function chequearColisiones() {
  // Esta función se utiliza para verificar si hay colisiones entre la figura y otras piezas en el tablero.

  return figura.forma.find((fila, y) => {
    // Utiliza el método 'find' para buscar dentro de la matriz de la figura. 'fila' representa una fila en la matriz, y 'y' es el índice de esa fila.

    return fila.find((valor, x) => {
      // Dentro de cada fila de la figura, se utiliza 'find' nuevamente para buscar valores individuales. 'valor' representa el valor de una celda, y 'x' es el índice de esa celda.

      return (
        valor !== 0 &&
        tabla[y + figura.posicion.y]?.[x + figura.posicion.x] !== 0
      );
      // La función interna del 'find' verifica si se cumple la siguiente condición:
      // 1. El 'valor' en la celda de la figura debe ser diferente de 0, lo que significa que es parte de la figura.
      // 2. El valor en la celda correspondiente del 'tabla' (tablero) debe ser diferente de 0. Esto indica que ya hay una pieza en esa posición del tablero.

      // Si ambas condiciones son verdaderas, significa que ha habido una colisión entre la figura y otra pieza en el tablero.
    });
  });
}


function solidificarFiguras() {
  figura.forma.forEach((fila, y) => {
    // Itera a través de las filas de la matriz de la figura.
    fila.forEach((valor, x) => {
      // Itera a través de los valores en cada fila de la figura.
      if (valor === 1) {
        // Si el valor en la celda es igual a 1, significa que es parte de la figura.
        tabla[y + figura.posicion.y][x + figura.posicion.x] = 1;
        // La suma 'y + figura.posicion.y' y 'x + figura.posicion.x' coloca la parte de la figura en la posición correcta en el tablero, teniendo en cuenta la posición actual de la figura en el juego.
        // Se establece el valor en la matriz 'tabla' en la posición correspondiente para que coincida con la ubicación de la figura.
      }
    })
  })

  //Resetear posicion
  figura.posicion.x = Math.floor(anchoTabla / 2 - 2);
  figura.posicion.y = 0;

  //Traer figuras random
  figura.forma = figuras[Math.floor(Math.random() * figuras.length)]

  //Juego perdido
  if (chequearColisiones()) {
    window.alert('Perdiste!! A seguir intentando...')
    tabla.forEach((fila) => fila.fill(0)) //.FILL modifica valores en el arreglo y retorna el arreglo modificado
  }

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

  if (evento.key === 'ArrowUp') {

    const rotacion = [];

    for (let i = 0; i < figura.forma[0].length; i++) {
      const fila = [];

      for (let j = figura.forma.length - 1; j >= 0; j--) {

        fila.push(figura.forma[j][i]);

      }

      rotacion.push(fila); //Pushear la nueva fila a la rotacion

    }

    //Actualizar la rotacion siempre y chequear posible colision con pared
    const prevenirRotacion = figura.forma
    figura.forma = rotacion
    if (chequearColisiones()) {
      figura.forma = prevenirRotacion;
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
    puntaje += 10;
  })
}

cargar();
