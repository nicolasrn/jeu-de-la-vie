let GrilleVueController = (function () {

  function GrilleVueController(table, grille) {
    this.table = table;
    this.grille = grille;
  }

  GrilleVueController.prototype.dessiner = function (cellules) {
    if (!cellules) {
      this.grille.parcourrir(cellule => modifierCellule(this.table, cellule));
    } else {
      cellules.forEach(cellule => modifierCellule(this.table, cellule));
    }
  }

  GrilleVueController.prototype.jouer = function () {
    let cellules = [];
    let self = this;
    self.grille.parcourrir(function (cellule) {
      cellules = cellules.concat(self.grille.determinerEtat(cellule));
    });
    return cellules;
  }


  const modifierCellule = function (table, cellule) {
    td = table.getCellule(cellule);
    if (cellule.etat !== cellule.etatSuivant) {
      cellule.etat = cellule.etatSuivant;
    }
    if (cellule.etat === Etat.MORT) {
      td.classList.add("mort");
      td.classList.remove("vie");
    } else {
      td.classList.add("vie");
      td.classList.remove("mort");
    }
  }

  return GrilleVueController;
})();