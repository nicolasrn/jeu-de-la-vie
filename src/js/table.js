let Table = (function() {
  function Table(nbLigne, nbColonne) {
    this.nbLigne = nbLigne;
    this.nbColonne = nbColonne;
    this.table = initVue(nbLigne, nbColonne);
  }

  Table.prototype.getCellule = function(cellule) {
    return this.table.querySelector("td[data-x='" + cellule.x + "'][data-y='" + cellule.y + "']");
  }
  
  Table.prototype.getCellules = function(cellule) {
    return this.table.querySelectorAll("td");
  }
  
  Table.prototype.getTable = function() {
    return this.table;
  }
  
  const initVue = function (x, y) {
    let table = document.querySelector('table');
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

  return Table;
}) ();