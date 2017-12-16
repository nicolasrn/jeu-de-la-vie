let Grille = (function () {
  function Grille(nbLigne, nbColonne, grilleSimple) {
    this.nbLigne = nbLigne;
    this.nbColonne = nbColonne;

    this.grille = initGrille(nbLigne, nbColonne, grilleSimple);
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

  return Grille;
})();