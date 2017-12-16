let Cellule = (function () {

  function Cellule(x, y, etat) {
    this.x = x;
    this.y = y;
    this.etat = etat;
    this.etatSuivant = etat;
  };

  Cellule.prototype.setEtat = function (etat) {
    this.etat = etat;
    this.etatSuivant = etat;
  }

  return Cellule;
})();