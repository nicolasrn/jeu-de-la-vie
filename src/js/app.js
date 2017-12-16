(function () {
  let iterationMax = Number(document.querySelector('input[name=iteration]'));
  let timeout = Number(document.querySelector('input[name=interval]').textContent);
  let grilleVueController;

  const stopInterval = function (id) {
    clearInterval(id);
  }

  const initModeleVue = function (grilleSimple) {
    const dimensionX = grilleSimple ? grilleSimple.length : 25;
    const dimensionY = grilleSimple ? grilleSimple[0].length : 25;

    let grille = new Grille(dimensionX, dimensionY, grilleSimple);
    let table = new Table(dimensionX, dimensionY);
    grilleVueController = new GrilleVueController(table, grille);
    grilleVueController.dessiner();

    let tds = table.getCellules();
    for (let i = 0; i < tds.length; i++) {
      tds[i].addEventListener('click', function (event) {
        let x = event.target.getAttribute('data-x');
        let y = event.target.getAttribute('data-y');
        let cellule = grille.get(x, y);
        cellule.setEtat((cellule.etat + 1) % 2);
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
        if (iterationMax <= ++compteur && iterationMax !== -1) {
          stopInterval(idInterval);
        }
        document.querySelector('#compteur').textContent = compteur;
        let cellules = grilleVueController.jouer();
        grilleVueController.dessiner(cellules);
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