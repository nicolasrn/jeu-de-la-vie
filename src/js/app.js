(function () {
  let iterationMax = -1;
  let timeout = 50;
  let grille;
  let table;

  let Etat = {
    EN_VIE: 0,
    MORT: 1
  };

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

  const getVoisines = function (grille, cellule) {
    let voisines = [];
    let x = cellule.x;
    let y = cellule.y;
    for (let i = x - 1; i <= x + 1; i++) {
      if (i >= 0 && i < grille.length) {
        for (let j = y - 1; j <= y + 1; j++) {
          if (j >= 0 && j < grille[i].length) {
            if (grille[i][j] !== grille[x][y]) {
              voisines.push(grille[i][j]);
            }
          }
        }
      }
    }
    return voisines;
  }

  const getCellulesVivantes = function (grille, cellule) {
    return getVoisines(grille, cellule).filter(function (celluleVoisine, index, array) {
      return celluleVoisine.etat === Etat.EN_VIE;
    });
  };

  const initVue = function (x, y) {
    table = table || document.querySelector('table');
    if (table) {
      table.remove();
    }
    table = document.createElement("table");
    let tbody = document.createElement("tbody");
    table.appendChild(tbody);
    for (let i = 0; i < x; i++) {
      let tr = document.createElement("tr");
      for (let j = 0; j < y; j++) {
        let td = document.createElement("td");
        td.setAttribute("data-x", i);
        td.setAttribute("data-y", j);
        td.classList.add("mort");
        tr.appendChild(td);
      }
      tbody.appendChild(tr);
    }
    document.querySelector('body').appendChild(table);
    return table;
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

  const modifierCellule = function (cellule, table) {
    td = table.querySelector("td[data-x='" + cellule.x + "'][data-y='" + cellule.y + "']");
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

  /** peut prendre une liste des cellules à mettre à jour */
  const dessiner = function (grille, table, cellules) {
    if (!cellules) {
      cellules = [];
      grille.forEach(lignes => {
        cellules = cellules.concat(lignes.map((cellule, index, cellules) => {
          return cellule;
        }));
      });
    }
    cellules.forEach(cellule => modifierCellule(cellule, table));
  }

  const determinerEtat = function (grille, cellule) {
    let cellules = [];
    if (cellule.etat === Etat.MORT) {
      let nbVoisinesVivantes = getCellulesVivantes(grille, cellule).length;
      if (nbVoisinesVivantes === 3) {
        cellule.etatSuivant = Etat.EN_VIE;
        cellules.push(cellule);
      }
    } else if (cellule.etat === Etat.EN_VIE) {
      let nbVoisinesVivantes = getCellulesVivantes(grille, cellule).length;
      if (!(nbVoisinesVivantes === 2 || nbVoisinesVivantes === 3)) {
        cellule.etatSuivant = Etat.MORT;
        cellules.push(cellule);
      }
    }
    return cellules;
  }

  /** peut retourner une liste des cellules à mettre à jour */
  const jouer = function (grille, table) {
    let cellules = [];
    for (let x = 0; x < grille.length; x++) {
      for (let y = 0; y < grille[x].length; y++) {
        let cellule = grille[x][y];
        cellules = cellules.concat(determinerEtat(grille, cellule));
      }
    }
    return cellules;
  }

  const stopInterval = function (id) {
    clearInterval(id);
  }

  const initModeleVue = function (grilleSimple) {
    const dimensionX = grilleSimple ? grilleSimple.length : 25;
    const dimensionY = grilleSimple ? grilleSimple[0].length : 25;

    grille = initGrille(dimensionX, dimensionY, grilleSimple);
    table = initVue(dimensionX, dimensionY);
    dessiner(grille, table);

    let tds = table.querySelectorAll('td');
    for (let i = 0; i < tds.length; i++) {
      tds[i].addEventListener('click', function (event) {
        let x = event.target.getAttribute('data-x');
        let y = event.target.getAttribute('data-y');
        grille[x][y].setEtat((grille[x][y].etat + 1) % 2);
        event.target.classList.toggle('mort');
        event.target.classList.toggle('vie');
      });
    }
  }

  const app = function () {
    let btnPlay = document.querySelector(".game-play");
    let btnStop = document.querySelector(".game-stop");
    let btnLoad = document.querySelector(".game-load");
    let btnReset = document.querySelector("input[type=reset]");
    let btnRandom = document.querySelector(".game-random");
    let inputInterval = document.querySelector('input[name=interval]');
    let inputIteration = document.querySelector('input[name=iteration]');

    let idInterval;
    timeout = inputInterval.value;

    btnPlay.addEventListener('click', function (event) {
      event.preventDefault();
      event.target.disabled = true;
      btnStop.disabled = false;
      idInterval = setInterval(function () {
        let compteur = Number(document.querySelector('#compteur').textContent);
        if (iterationMax <= ++compteur) {
          stopInterval(idInterval);
        }
        document.querySelector('#compteur').textContent = compteur;
        let cellules = jouer(grille, table);
        dessiner(grille, table, cellules);
      }, timeout);
    });

    btnStop.addEventListener('click', function (event) {
      event.preventDefault();
      event.target.disabled = true;
      btnPlay.disabled = false;
      stopInterval(idInterval);
    });

    btnLoad.addEventListener('change', function (event) {
      event.preventDefault();
      let input = event.target;
      let reader = new FileReader();
      reader.onload = function () {
        let data = JSON.parse(reader.result);
        document.querySelector('.console').textContent = data;
        initModeleVue(data);
      };
      reader.readAsText(input.files[0]);
    });

    btnReset.addEventListener('click', function (event) {
      event.preventDefault();
      document.querySelector('#compteur').textContent = 0;
      initModeleVue();
    });

    btnRandom.addEventListener('click', function (event) {
      event.preventDefault();
      let randEtat = () => ((Math.round(Math.random() * 100)) % 5) > 2 ? 0 : 1;
      let randDimension = () => (Math.round(Math.random() * 100)) % 50;
      let randX = randDimension();
      let randY = randDimension();
      let randGrille = [];
      for (let i = 0; i < randX; i++) {
        randGrille.push([]);
        for (let j = 0; j < randY; j++) {
          randGrille[i].push([]);
          randGrille[i][j] = randEtat();
        }
      }
      initModeleVue(randGrille);
    });

    inputInterval.addEventListener('change', function (event) {
      event.preventDefault();
      timeout = Number(event.target.value);
    });

    inputIteration.addEventListener('change', function (event) {
      event.preventDefault();
      iterationMax = Number(event.target.value);
    });

    initModeleVue();
  };

  app();
})();