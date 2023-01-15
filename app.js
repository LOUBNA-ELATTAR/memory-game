
let card = document.getElementsByClassName("card");
let cards = [...card];


const deck = document.getElementById("card-deck");

var openedCards = [];

let matchedCard = document.getElementsByClassName("match");

let moves = 0;
let counter = document.querySelector(".moves");


let bar = document.getElementById("myBar");


let closeicon = document.querySelector(".close");

let modalWin = document.getElementById("popupWin");
let modalLose = document.getElementById("popupLose");


 document.body.onload = startGame();

function shuffle(array) {
  // Tableau actuel
  var currentIndex = array.length,
    temporaryValue,
    randomIndex;
    
  // Quand le tableau n'est pas vide
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}


function startGame() {
  // Vide toutes le tableau des cartes découvertes
  openedCards = [];

  //On Mélange le deck
  cards = shuffle(cards);
  
  for (var i = 0; i < cards.length; i++) {
    deck.innerHTML = "";
    Array.prototype.forEach.call(cards, function (item) {
      deck.appendChild(item);
    });
      // Enleve toutes les classes des cartes à jour 
    cards[i].classList.remove("show", "open", "match", "disabled");
  }
  // Reset le nombre de moves
  moves = 0;
  counter.innerHTML = moves;
  
  //reset le timer
  second = 0;
  minute = 0;
  hour = 0;
  var timer = document.querySelector(".timer");
  timer.innerHTML = "0 mins 0 secs";
  clearInterval(interval);

  //reset la barre
  t=0;
  var bar = document.getElementById("myBar");
  bar.style.width =  0;
  clearInterval(id);

  //Recharge les scores : vide la liste 
  document.getElementById('results').innerHTML = ""
  //Affiche les scores au bout de 3sec (Pour qu'on charge le score si on vient de l'enregistrer)
  setTimeout(viewScore,1000);
}

/****
 * Retournement des cartes: Quand j'affiche la carte => ajoute 3 classes
 ****/
var displayCard = function () {
  this.classList.toggle("open");
  this.classList.toggle("show");
  this.classList.toggle("disabled");
};

/****
 * Retournement des cartes: 
 ****/
function cardOpen() {
  // Ajoute un element à notre tableau openedCards
  openedCards.push(this);
  // Nombre de carte dans notre tableau openedCards[]
  var len = openedCards.length;
  // On retourne jusqu'a 2 cartes:
  if (len === 2) {
    // On commence à compter le move
    moveCounter();
    // Si les 2 cartes on un TYPE identique alors:
    if (openedCards[0].type === openedCards[1].type) {
      matched(); 
    } else {
      unmatched(); 
    }
  }
}

/****
 * Quand 2 cartes matchent: 
 ****/
function matched() {
  // On desactive les cartes retournés: ajout match + disabled
  openedCards[0].classList.add("match", "disabled");
  openedCards[1].classList.add("match", "disabled");
  // On enleve les class show/open/no-event
  openedCards[0].classList.remove("show", "open", "no-event");
  openedCards[1].classList.remove("show", "open", "no-event");
  // On vide le tableau de cartes retournées
  openedCards = [];
}

/****
 * Quand 2 cartes ne matchent pas: 
 ****/
function unmatched() {
  // On ajoute la class unmatched
  openedCards[0].classList.add("unmatched");
  openedCards[1].classList.add("unmatched");
  // On désactive TOUTES les cartes
  disable();
  // On enleve les class suivente au bout de 1seconde
  setTimeout(function () {
    openedCards[0].classList.remove("show", "open", "no-event", "unmatched");
    openedCards[1].classList.remove("show", "open", "no-event", "unmatched");
    enable();
    openedCards = [];
  }, 1100);
}

/****
 * On désactive les cartes quand elle matchent pas : ajoute la class disable
 ****/
function disable() {
  //On ajoute la class disable 
  Array.prototype.filter.call(cards, function (card) {
    card.classList.add("disabled");
  });
}

/****
 * On active les cartes sauf celles qui ont match
 ****/
function enable() {
  // On réactive toutes les cartes sauf celle qui sont matchs
  Array.prototype.filter.call(cards, function (card) {
    card.classList.remove("disabled");
    for (var i = 0; i < matchedCard.length; i++) {
      matchedCard[i].classList.add("disabled");
    }
  });
}

/****
 * Compteur de move: 1move = 2 cartes retournées 
 ****/

function moveCounter() {
  // A chaque move
  moves++;
  // Rajoute un move sur le compteur
  counter.innerHTML = moves;
  //le timer commence à la 1ere paire qu'on a essayé d'assembler
  if (moves == 1) {
    second = 0;
    minute = 0;
    hour = 0;
    width =0;
    // Quand un move est fait, on commence le timer et la progress bar
    startTimer();
    increase();
  } 
}

/****
 * Durée de la partie
 ****/

var second = 0,
  minute = 0;

var timer = document.querySelector(".timer");
var interval;
// Lancement du chronomètre:
function startTimer() {
  interval = setInterval(function () {
    timer.innerHTML = minute + "mins " + second + "secs";
    second++;
    //console.log(timer.innerHTML);
    //Quand on arrive à 60 seconde => 1 min
    if (second == 60) {
      minute++;
      second = 0;
    }
  }, 1000);
}


/****
 * bar de progression
 ****/

var t = 0;
var id;
function increase() {
  if (t == 0) {
    t = 1;
    var width = 0;
    // Durée de progression de la bar
    var id = setInterval(frame, 600); // ms seconde si on veut 5min=300secondes il faut qu'a 100% on soit a 3000 :)
    function frame() {
      // Quand on arrive à 100%, on stop la progression.
      if (width >= 100) {
        clearInterval(id);
        t = 0;
        bar.style.width =  "100%";
        // Quand la barre arrive à 100% = on a perdue la partie 
        gameOver();
      } else {
        width++;
        bar.style.width =  width +"%";
      }
      // Couleur de la bar entre 0 et 100% de la taille "width"
      if (width < 33){
        bar.style.backgroundColor = "green";
      } else if( width >= 33 && width<66 ){
        bar.style.backgroundColor = "orange";
      } else {
        bar.style.backgroundColor = "red";
      }
    }
  }
}

/****
 * Score Board: Je recupere les scores venant de mon API qu'on a créé
 ****/

function viewScore(){
  // Url de mon API
  fetch('http://localhost:8000/api/players').
  then(function (response) {
    // L'appel de mon api est un succes
    return response.json();
  }).then(function (data) {
    // JSON  de réponse 
    //console.log(data);

  // Je trie mes résultats en fonction du meilleur score c'est à dire:  temps le plus bas en haut
    var classement= data.sort(function(a, b){
      return a.score - b.score;
    })
  
    // J'affiche juste les 3 meilleurs scores de la liste
    for (let i =0; i < 3; i++){
      //console.log(classement[i].name);
  
      //J'affiche le score en minutes/secondes
      var minutesScore= Math.floor(classement[i].score / 60);
      var secondsScore = classement[i].score - minutesScore * 60;
  
      // Je l'ajoute dans mon ID results.
      var resultats = "<li>"+classement[i].name+": "+minutesScore+" min "+secondsScore+" sec </li>";
       document.getElementById("results").innerHTML += resultats;
    }
  
    /*// J'affiche chaque résultats dans une liste => concerne toute la liste des scores
    classement.forEach(function(item){
   
      //J'affiche le score en minutes/secondes
      var minutesScore= Math.floor(item.score / 60);
      var secondsScore = item.score - minutesScore * 60;
      var resultats = "<li>"+item.name+": "+minutesScore+" min "+secondsScore+" sec </li>";
      //console.log(item.name+":"+item.score);
  
      // Je l'ajoute dans mon ID results.
      document.getElementById("results").innerHTML += resultats;
    }*/

  }).catch(function (err) {
    // Il y a une erreur
    console.warn('Something went wrong.', err);
  });
}


/****
 * Quand on gagne la partie. 
 ****/

// Quand on gagne la partie, On ouvre une modale:
function gameWin() {
  // Quand toutes les cartes sont découvertes:
  if (matchedCard.length == 16) {
    // On stop le chronometre et la bar de progression
    clearInterval(interval);
    clearInterval(id);
    // Temps final en minutes/ secondes
    finalTime = timer.innerHTML;
    //Temps final en secondes
    finalTimeInSecond = ((minute*60)+second)-1; //(erreur de une seconde sur mon temps final?)

    // Affiche la modale gameWin
    modalWin.classList.add("show");

    //Affiche les moves, classement et temps final
    document.getElementById("finalMove").innerHTML = moves;
    document.getElementById("totalTime").innerHTML = finalTime;

    // Affiche le score en seconde dans l'input qui envoie en back.
    document.getElementById("totalTimeInSecond").setAttribute('value', finalTimeInSecond);

    // On envoie le résultat en back
    formElem.onsubmit = async (e) => {
      e.preventDefault();
      // On envoit le résultat du formulaire à l'API en POST
      let response = await fetch('http://localhost:8000/api/players', {
        method: 'POST',
        body: new FormData(formElem)
      });
      let result = await response.json();
    };
    // Lorsque qu'on ferme la modal
    closeModalWin();
  } 
}

// Quand on ferme la modale: On ne l'affiche plus (class show) et on relance la partie
function closeModalWin() {
  closeicon.addEventListener("click", function (e) {
    modalWin.classList.remove("show");
    startGame();
  });
}

// Quand on appuie sur "Play Again": On ne l'affiche plus (class show) et on relance la partie.
function playAgain() {
  modalWin.classList.remove("show");
  startGame();
}

/****
 * Quand on perd la partie. 
 ****/

// La partie est perdue, on ouvre une modale:
function gameOver() {
  // On stop le chronometre et la bar de progression
  clearInterval(interval);
  clearInterval(id);
  // Temps final
  finalTime = timer.innerHTML;

  // Affiche la modale
  modalLose.classList.add("show");

  //On affiche le temps finale
  document.getElementById("lostTime").innerHTML = finalTime;

  // Lorsque qu'on ferme la modal
  closeModalLose();
}

// Quand on ferme la modale: On ne l'affiche plus (class show) et on relance la partie
function closeModalLose() {
  closeicon.addEventListener("click", function (e) {
    modalLose.classList.remove("show");
    startGame();
  });
}

// Quand on appuie sur "Try Again": On ne l'affiche plus (class show) et on relance la partie.
function TryAgain() {
  modalLose.classList.remove("show");
  startGame();
}


/****
 * Ajoute des ecouteurs devenement pour chaque carte
 ****/
for (var i = 0; i < cards.length; i++) {
  card = cards[i];
  card.addEventListener("click", displayCard);
  card.addEventListener("click", cardOpen);
  card.addEventListener("click", gameWin);
}
