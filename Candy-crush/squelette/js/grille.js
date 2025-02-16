import Cookie from "./Cookie.js";
import { create2DArray } from "./utils.js";

/* Classe principale du jeu, c'est une grille de cookies. Le jeu se joue comme
Candy Crush Saga etc... c'est un match-3 game... */
export default class Grille {
  cookieSelectionnes = [];
  /**
   * Constructeur de la grille
   * @param {number} l nombre de lignes
   * @param {number} c nombre de colonnes
   */
  constructor(l, c) {
    this.c = c;
    this.l = l;

    this.tabcookies = this.remplirTableauDeCookies(6)
  }

  /**
   * parcours la liste des divs de la grille et affiche les images des cookies
   * correspondant à chaque case. Au passage, à chaque image on va ajouter des
   * écouteurs de click et de drag'n'drop pour pouvoir interagir avec elles
   * et implémenter la logique du jeu.
   */
  showCookies() {
    let caseDivs = document.querySelectorAll("#grille div");

    caseDivs.forEach((div, index) => {
      // on calcule la ligne et la colonne de la case
      // index est le numéro de la case dans la grille
      // on sait que chaque ligne contient this.c colonnes
      // er this.l lignes
      // on peut en déduire la ligne et la colonne
      // par exemple si on a 9 cases par ligne et qu'on 
      // est à l'index 4
      // on est sur la ligne 0 (car 4/9 = 0) et 
      // la colonne 4 (car 4%9 = 4)
      let ligne = Math.floor(index / this.l);
      let colonne = index % this.c;

      console.log("On remplit le div index=" + index + " l=" + ligne + " col=" + colonne);

      // on récupère le cookie correspondant à cette case
      let cookie = this.tabcookies[ligne][colonne];
      // on récupère l'image correspondante
      let img = cookie.htmlImage;

      img.onclick = (event) => {
        console.log("On a cliqué sur la ligne " + ligne + " et la colonne " + colonne);
        //let cookieCliquee = this.getCookieFromLC(ligne, colonne);
        console.log("Le cookie cliqué est de type " + cookie.type);

        // test : si on a cliqué sur un cookie déjà sélectionné
        // on le désélectionne et on ne fait rien.
        if(cookie.isSelectionnee()) {
          cookie.deselectionnee();
          // on la retire du tableau des cookies sélectionnés
          this.cookieSelectionnes = [];
          return;
        }

        // highlight + changer classe CSS
        cookie.selectionnee();

        // A FAIRE : tester combien de cookies sont sélectionnées
        // si 0 on ajoute le cookie cliqué au tableau
        // si 1 on ajoute le cookie cliqué au tableau
        // et on essaie de swapper
        let nbCookiesSelectionnes = this.cookieSelectionnes.length;
        switch (nbCookiesSelectionnes) {
          case 0:
            // On mémorise la cookie courante
            this.cookieSelectionnes.push(cookie);
            break;
          case 1:
            this.cookieSelectionnes.push(cookie);
            // Maintenant on a deux cookies selectionnees
            // On va regarder si on peut les swapper
            Cookie.swapCookies(this.cookieSelectionnes[0], this.cookieSelectionnes[1]);  
            // dans tous les cas (swap ou pas) on vide le tableau
            this.cookieSelectionnes = [];
            break;
        }
      }

      // A FAIRE : ecouteur de drag'n'drop
      img.ondragstart = (event) => {
        let cookieImage = event.target;
        let l = cookieImage.dataset.ligne;
        let c = cookieImage.dataset.colonne;
        let t = this.tabcookies[l][c].type;
        console.log(`dragstart sur cookie : t = ${t} l = ${l} c = ${c}`); 
      }

      // on affiche l'image dans le div pour la faire apparaitre à l'écran.
      div.appendChild(img);
    });
  }

  // inutile ?
  getCookieFromLC(ligne, colonne) {
    return this.tabcookies[ligne][colonne];
  }

  /**
   * Initialisation du niveau de départ. Le paramètre est le nombre de cookies différents
   * dans la grille. 4 types (4 couleurs) = facile de trouver des possibilités de faire
   * des groupes de 3. 5 = niveau moyen, 6 = niveau difficile
   *
   * Améliorations : 1) s'assurer que dans la grille générée il n'y a pas déjà de groupes
   * de trois. 2) S'assurer qu'il y a au moins 1 possibilité de faire un groupe de 3 sinon
   * on a perdu d'entrée. 3) réfléchir à des stratégies pour générer des niveaux plus ou moins
   * difficiles.
   *
   * On verra plus tard pour les améliorations...
   */
  remplirTableauDeCookies(nbDeCookiesDifferents) {
    // créer un tableau vide de 9 cases pour une ligne
    // en JavaScript on ne sait pas créer de matrices
    // d'un coup. Pas de new tab[3][4] par exemple.
    // Il faut créer un tableau vide et ensuite remplir
    // chaque case avec un autre tableau vide
    // Faites ctrl-click sur la fonction create2DArray
    // pour voir comment elle fonctionne
    let tab = create2DArray(9);

    // remplir
    for (let l = 0; l < this.l; l++) {
      for (let c = 0; c < this.c; c++) {

        // on génère un nombre aléatoire entre 0 et nbDeCookiesDifferents-1
        const type = Math.floor(Math.random() * nbDeCookiesDifferents);
        //console.log(type)
        tab[l][c] = new Cookie(type, l, c);
      }
    }

    return tab;
  }
  eliminerCookiesPremCol() {
    for (let l = 0; l < this.l - 2; l++) {
      let cookie1 = this.tabcookies[l][0];
      let cookie2 = this.tabcookies[l + 1][0];
      let cookie3 = this.tabcookies[l + 2][0];
  
      // si les cookies sont du même type, on les élimine
      if (cookie1.type === cookie2.type && cookie2.type === cookie3.type) {
        console.log(`Eliminating cookies at (${l}, 0), (${l + 1}, 0), (${l + 2}, 0)`);
  
        // Eliminate the cookies
        this.tabcookies[l][0] = null;
        this.tabcookies[l + 1][0] = null;
        this.tabcookies[l + 2][0] = null;
  
        // Optionally, you can add code to handle the visual removal of cookies
        // and shifting the remaining cookies down.
      }
    }
  }
}
