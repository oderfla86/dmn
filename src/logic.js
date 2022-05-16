class Pieza {
  constructor(l, r) {
    this.name = l + ":" + r;
    this.l = l;
    this.r = r;
    this.total = l + r;
    this.leafValue = -1;
  }
}

let p1 = [];
let p2 = [];
let p3 = [];
let p4 = [];
let poolFichas = [];
let mesa = [];
let leftLeaf = -1;
let rightLeaf = -1;

crearPiezas();
mezclarPiezas(poolFichas);
repartirPiezas(poolFichas);
simularPartida();

function crearPiezas() {
  for (let i = 0; i <= 6; i++) {
    for (let j = i; j <= 6; j++) {
      let p = new Pieza(i, j);
      poolFichas.push(p);
    }
  }
}

function mezclarPiezas(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}

function repartirPiezas(array) {
  let indice = 0;
  for (let i = 0; i < array.length; i++) {
    indice += 1;
    if (indice > 3) {
      indice = indice - 4;
    }
    switch (indice) {
      case 0:
        p1.push(array[i]);
        break;
      case 1:
        p2.push(array[i]);
        break;
      case 2:
        p3.push(array[i]);
        break;
      case 3:
        p4.push(array[i]);
        break;
      default:
        console.log("Error!");
    }
  }
}

function buscarPieza(jugador) {
  let pieza = null;
  let pasa = true;
  switch (jugador) {
    case 0:
      for (let i = 0; i < p1.length; i++) {
        let ficha = p1[i];

        if (ficha.r === leftLeaf || ficha.l === leftLeaf) {
          pieza = ficha;
          pieza.leafValue = ficha.r === leftLeaf ? ficha.l : ficha.r;
          pieza.name =
            ficha.r === leftLeaf
              ? ficha.l + ":" + ficha.r
              : ficha.r + ":" + ficha.l;
          p1.splice(i, 1);
          mesa.unshift(pieza);
          leftLeaf = pieza.leafValue;
          pasa = false;
          break;
        } else if (ficha.r === rightLeaf || ficha.l === rightLeaf) {
          pieza = ficha;
          pieza.leafValue = ficha.r === rightLeaf ? ficha.l : ficha.r;
          pieza.name =
            ficha.r === rightLeaf
              ? ficha.r + ":" + ficha.l
              : ficha.l + ":" + ficha.r;
          p1.splice(i, 1);
          mesa.push(pieza);
          rightLeaf = pieza.leafValue;
          pasa = false;
          break;
        }
      }
      break;
    case 1:
      for (let i = 0; i < p2.length; i++) {
        let ficha = p2[i];

        if (ficha.r === leftLeaf || ficha.l === leftLeaf) {
          pieza = ficha;
          pieza.leafValue = ficha.r === leftLeaf ? ficha.l : ficha.r;
          pieza.name =
            ficha.r === leftLeaf
              ? ficha.l + ":" + ficha.r
              : ficha.r + ":" + ficha.l;
          p2.splice(i, 1);
          mesa.unshift(pieza);
          leftLeaf = pieza.leafValue;
          pasa = false;
          break;
        } else if (ficha.r === rightLeaf || ficha.l === rightLeaf) {
          pieza = ficha;
          pieza.leafValue = ficha.r === rightLeaf ? ficha.l : ficha.r;
          pieza.name =
            ficha.r === rightLeaf
              ? ficha.r + ":" + ficha.l
              : ficha.l + ":" + ficha.r;
          p2.splice(i, 1);
          mesa.push(pieza);
          rightLeaf = pieza.leafValue;
          pasa = false;
          break;
        }
      }
      break;
    case 2:
      for (let i = 0; i < p3.length; i++) {
        let ficha = p3[i];

        if (ficha.r === leftLeaf || ficha.l === leftLeaf) {
          pieza = ficha;
          pieza.leafValue = ficha.r === leftLeaf ? ficha.l : ficha.r;
          pieza.name =
            ficha.r === leftLeaf
              ? ficha.l + ":" + ficha.r
              : ficha.r + ":" + ficha.l;
          p3.splice(i, 1);
          mesa.unshift(pieza);
          leftLeaf = pieza.leafValue;
          pasa = false;
          break;
        } else if (ficha.r === rightLeaf || ficha.l === rightLeaf) {
          pieza = ficha;
          pieza.leafValue = ficha.r === rightLeaf ? ficha.l : ficha.r;
          pieza.name =
            ficha.r === rightLeaf
              ? ficha.r + ":" + ficha.l
              : ficha.l + ":" + ficha.r;
          p3.splice(i, 1);
          mesa.push(pieza);
          rightLeaf = pieza.leafValue;
          pasa = false;
          break;
        }
      }
      break;
    case 3:
      for (let i = 0; i < p4.length; i++) {
        let ficha = p4[i];

        if (ficha.r === leftLeaf || ficha.l === leftLeaf) {
          pieza = ficha;
          pieza.leafValue = ficha.r === leftLeaf ? ficha.l : ficha.r;
          pieza.name =
            ficha.r === leftLeaf
              ? ficha.l + ":" + ficha.r
              : ficha.r + ":" + ficha.l;
          p4.splice(i, 1);
          mesa.unshift(pieza);
          leftLeaf = pieza.leafValue;
          pasa = false;
          break;
        } else if (ficha.r === rightLeaf || ficha.l === rightLeaf) {
          pieza = ficha;
          pieza.leafValue = ficha.r === rightLeaf ? ficha.l : ficha.r;
          pieza.name =
            ficha.r === rightLeaf
              ? ficha.r + ":" + ficha.l
              : ficha.l + ":" + ficha.r;
          p4.splice(i, 1);
          mesa.push(pieza);
          rightLeaf = pieza.leafValue;
          pasa = false;
          break;
        }
      }
      break;
    default:
      break;
  }
  return pasa;
}

function imprimirData(array, origin) {
  let dataVisual = "";
  for (let i = 0; i < array.length; i++) {
    dataVisual += "|" + array[i].name + "|";
  }
  console.log(origin);
  console.debug(dataVisual);
}

function simularPartida() {
  let indice = 1;
  let salida = p1[0];
  let tranca = 0;
  p1.splice(0, 1);
  leftLeaf = salida.l;
  rightLeaf = salida.r;

  mesa.push(salida);
  console.log("SALIDA");
  console.debug(salida.name);

  while (p1.length > 0 && p2.length > 0 && p3.length > 0 && p4.length > 0) {
    if (indice > 3) {
      indice = indice - 4;
    }
    let jugadorPaso = buscarPieza(indice);
    if (jugadorPaso) {
      tranca += 1;
      if (tranca === 4) {
        console.error("Partida Trancada");
        break;
      }
    } else {
      tranca = 0;
    }
    indice += 1;
  }

  console.log("Partida finalizada");
  imprimirData(mesa, 'mesa');
  imprimirData(p1, 'p1');
  imprimirData(p2, 'p2');
  imprimirData(p3, 'p3');
  imprimirData(p4, 'p4');
}