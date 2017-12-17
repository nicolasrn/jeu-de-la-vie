let GrilleVueController = (function () {

  function GrilleVueController(table, grille, algo) {
    this.table = table;
    this.grille = grille;
    this.setAlgoAutomateCellulaire(algo);
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
      cellules = cellules.concat(this.algoAutomateCellulaire.determinerEtat(cellule));
    }.bind(this));
    return cellules;
  }

  GrilleVueController.prototype.getGrille = function () {
    return this.grille;
  };

  GrilleVueController.prototype.setAlgoAutomateCellulaire = function (name) {
    switch (name) {
      case "HeighLife":
        this.algoAutomateCellulaire = new HeighLife(this.grille);
        break;
      case "Day&Night":
        this.algoAutomateCellulaire = new DayAndNight(this.grille);
        break;
      case "JeuDeLaVie":
      default:
        this.algoAutomateCellulaire = new JeuDeLaVie(this.grille);
        break;
    }
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

  function AutomateCellulaire() {
    this.voisineXG = null;
    this.voisineXD = null;
    this.voisineYG = null;
    this.voisineYD = null;
    this.grille = null;
  }

  AutomateCellulaire.prototype.getVoisines = function (cellule) {
    let voisines = [];
    let x = cellule.x;
    let y = cellule.y;
    for (let i = x - this.voisineXG; i <= x + this.voisineXD; i++) {
      if (i >= 0 && i < this.grille.nbLigne) {
        for (let j = y - this.voisineYG; j <= y + this.voisineYD; j++) {
          if (j >= 0 && j < this.grille.nbColonne) {
            if (this.grille.get(i, j) !== this.grille.get(x, y)) {
              voisines.push(this.grille.get(i, j));
            }
          }
        }
      }
    }
    return voisines;
  };

  AutomateCellulaire.prototype.getCellulesVoisinesVivantes = function (cellule) {
    return this.getVoisines(cellule).filter(function (celluleVoisine, index, array) {
      return celluleVoisine.etat === Etat.EN_VIE;
    });
  };

  AutomateCellulaire.prototype.determinerEtat = function (cellule) {
    let cellules = [];
    if (cellule.etat === Etat.MORT) {
      let nbVoisinesVivantes = this.getCellulesVoisinesVivantes(cellule).length;
      if (this.isNbVoisineVivanteSuffisantePourVivre(nbVoisinesVivantes)) {
        cellule.etatSuivant = Etat.EN_VIE;
        cellules.push(cellule);
      }
    } else if (cellule.etat === Etat.EN_VIE) {
      let nbVoisinesVivantes = this.getCellulesVoisinesVivantes(cellule).length;
      if (!(this.isNbVoisineVivanteInsuffisantePourVivre(nbVoisinesVivantes))) {
        cellule.etatSuivant = Etat.MORT;
        cellules.push(cellule);
      }
    }
    return cellules;
  }

  AutomateCellulaire.prototype.isNbVoisineVivanteSuffisantePourVivre = function (nbVoisineVivante) {
    throw new Error("fonction non surchargée");
  }

  AutomateCellulaire.prototype.isNbVoisineVivanteInsuffisantePourVivre = function (nbVoisineVivante) {
    throw new Error("fonction non surchargée");
  }

  function JeuDeLaVie(grille) {
    this.voisineXG = 1;
    this.voisineXD = 1;
    this.voisineYG = 1;
    this.voisineYD = 1;
    this.grille = grille;
  }
  JeuDeLaVie.prototype = AutomateCellulaire.prototype;

  JeuDeLaVie.prototype.isNbVoisineVivanteSuffisantePourVivre = function (nbVoisinesVivantes) {
    return nbVoisinesVivantes === 3;
  }

  JeuDeLaVie.prototype.isNbVoisineVivanteInsuffisantePourVivre = function (nbVoisinesVivantes) {
    return nbVoisinesVivantes === 2 || nbVoisinesVivantes === 3;
  }

  function HeighLife(grille) {
    this.voisineXG = 1;
    this.voisineXD = 1;
    this.voisineYG = 1;
    this.voisineYD = 1;
    this.grille = grille;
  }
  HeighLife.prototype = AutomateCellulaire.prototype;

  HeighLife.prototype.isNbVoisineVivanteSuffisantePourVivre = function (nbVoisinesVivantes) {
    return nbVoisinesVivantes === 3 || nbVoisinesVivantes === 6;
  }

  HeighLife.prototype.isNbVoisineVivanteInsuffisantePourVivre = function (nbVoisinesVivantes) {
    return nbVoisinesVivantes === 2 || nbVoisinesVivantes === 3;
  }

  function DayAndNight(grille) {
    this.voisineXG = 1;
    this.voisineXD = 1;
    this.voisineYG = 1;
    this.voisineYD = 1;
    this.grille = grille;
  }
  DayAndNight.prototype = AutomateCellulaire.prototype;

  DayAndNight.prototype.isNbVoisineVivanteSuffisantePourVivre = function (nbVoisinesVivantes) {
    return nbVoisinesVivantes === 3 || nbVoisinesVivantes === 6 || nbVoisinesVivantes === 7 || nbVoisinesVivantes === 8;
  }

  DayAndNight.prototype.isNbVoisineVivanteInsuffisantePourVivre = function (nbVoisinesVivantes) {
    return nbVoisinesVivantes === 3 || nbVoisinesVivantes === 4 || nbVoisinesVivantes === 6 || nbVoisinesVivantes === 7 || nbVoisinesVivantes === 8;
  }

  return GrilleVueController;
})();