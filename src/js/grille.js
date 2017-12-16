let Grille = (function () {
  function Grille(nbLigne, nbColonne, grilleSimple) {
    this.nbLigne = nbLigne;
    this.nbColonne = nbColonne;
    this.algoSelectionVoisine = algoVoisineDirecte;

    this.grille = initGrille(nbLigne, nbColonne, grilleSimple);
  }

  Grille.prototype.getCellulesVoisinesVivantes = function (cellule) {
    return getVoisines(this, cellule).filter(function (celluleVoisine, index, array) {
      return celluleVoisine.etat === Etat.EN_VIE;
    });
  };

  Grille.prototype.determinerEtat = function (cellule) {
    let cellules = [];
    if (cellule.etat === Etat.MORT) {
      let nbVoisinesVivantes = this.getCellulesVoisinesVivantes(cellule).length;
      if (nbVoisinesVivantes === 3) {
        cellule.etatSuivant = Etat.EN_VIE;
        cellules.push(cellule);
      }
    } else if (cellule.etat === Etat.EN_VIE) {
      let nbVoisinesVivantes = this.getCellulesVoisinesVivantes(cellule).length;
      if (!(nbVoisinesVivantes === 2 || nbVoisinesVivantes === 3)) {
        cellule.etatSuivant = Etat.MORT;
        cellules.push(cellule);
      }
    }
    return cellules;
  }

  Grille.prototype.parcourrir = function (callback) {
    for (let i = 0; i < this.nbLigne; i++) {
      for (let j = 0; j < this.nbColonne; j++) {
        callback(this.grille[i][j]);
      }
    }
  }

  Grille.prototype.get = function (i, j) {
    return this.grille[i][j];
  }

  Grille.prototype.getAlgoSelectionVoisine = function () {
    return this.algoSelectionVoisine;
  }

  const getVoisines = function (grille, cellule) {
    let voisines = [];
    let x = cellule.x;
    let y = cellule.y;
    let algoVoisine = grille.getAlgoSelectionVoisine();
    for (let i = x - algoVoisine.voisineXG; i <= x + algoVoisine.voisineXD; i++) {
      if (i >= 0 && i < grille.nbLigne) {
        for (let j = y - algoVoisine.voisineYG; j <= y + algoVoisine.voisineYD; j++) {
          if (j >= 0 && j < grille.nbColonne) {
            if (grille.get(i, j) !== grille.get(x, y)) {
              voisines.push(grille.get(i, j));
            }
          }
        }
      }
    }
    return voisines;
  }

  const initGrille = function (x, y, grilleSimple) {
    let grille = [];
    for (let i = 0; i < x; i++) {
      grille.push([]);
      for (let j = 0; j < y; j++) {
        grille[i].push([]);
        grille[i][j] = new Cellule(i, j, grilleSimple ? grilleSimple[i][j] : Etat.MORT);
      }
    }
    return grille;
  }

  const algoVoisineDirecte = {
    voisineXG: 1,
    voisineXD: 1,
    voisineYG: 1,
    voisineYD: 1
  };

  const algoVoisineDirecteLigne = {
    voisineXG: 0,
    voisineXD: 0,
    voisineYG: 1,
    voisineYD: 1
  };

  return Grille;
})();