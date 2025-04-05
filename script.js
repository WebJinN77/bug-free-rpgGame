const COST_HEALTH = 10;
const COST_WEAPON = 30;
const CHANCE_TO_MISS = 0.2;
const CHANCE_TO_BREAK_WEAPON = 0.8;

const player = {
    xp : 0,
    health : 100,
    gold : 50,
    currentWeaponIndex : 0,
    inventory : "stick"
}
let fighting;
let monsterHealth;
const button1 = document.querySelector("#button1") || console.error("Button1 not found"); 
const button2 = document.querySelector("#button2") || console.error("Button2 not found");
const button3 = document.querySelector("#button3") || console.error("Button3 not found");
const button4 = document.querySelector("#button4") || console.error("Button3 not found");
const text = document.querySelector("#text") || console.error("Text element not found");
const xpText = document.querySelector("#xpText") || console.error("XP element not found");
const healthText = document.querySelector("#healthText") || console.error("Health element not found");
const goldText = document.querySelector("#goldText") || console.error("Gold element not found");
const monsterStats = document.querySelector("#monsterStats") || console.error("Monstr stats not found");
const monsterName = document.querySelector("#monsterName") || console.error("Monster name not found");
const monsterHealthText = document.querySelector("#monsterHealth") || console.error("Monster health not found");
const weapons = [
    {
        name: 'stick',
        power: 5
    },
    {
        name: 'dagger',
        power: 30
    },
    {
        name: 'claw hammer',
        power: 50
    },
    {
        name: 'sword',
        power: 100
    }
];
const monsters = [
    {
        name: "slime",
        level: 2,
        health: 15
    },
    {
        name: "fanged beast",
        level: 8,
        health: 60
    },
    {
        name: "dragon",
        level: 20,
        health: 300
    }
];
const locations = [
    {
        name: "town square",
        buttonText : ["Go to store", "Go to cave", "Fight dragon", "Saving menu"],
        buttonFunctions : [goStore, goCave, fightDragon, goMenu],
        text: "You are in the town square. You see a sign that says \"Store\"."
    },
    {
        name: "store",
        buttonText : ["Buy 10 health (10 gold)",
                        "Buy weapon (30 gold)",
                         "Go to town square"],
        buttonFunctions : [buyHealth, buyWeapon, goTown],
        text: "You enter the store."
    },
    {
        name: "cave",
        buttonText : ["Fight slime", 
                        "Fight fanged beast", 
                         "Go to town square"],
        buttonFunctions : [fightSlime, fightBeast, goTown],
        text: "You enter the cave. You see some monsters."
    },
    {
        name: "fight",
        buttonText : ["Attack", 
                        "Dodge", 
                         "Run"],
        buttonFunctions : [attack, dodge, goTown],
        text: "You are fighting a monster."
    },
    {
        name: "kill monster",
        buttonText : ["Go to town square", 
                        "Go to town square", 
                        "Go to town square"],
        buttonFunctions : [goTown, goTown, easterEgg],
        text: 'The monster screams "Arg!" as it dies. You gain experience points and find gold.'
    },
    {
        name: "lose",
        buttonText : ["REPLAY?", 
                        "REPLAY?", 
                        "REPLAY?"],
        buttonFunctions : [restart, restart, restart],
        text: "You die. &#x2620;"
    },
    {
        name: "win",
        buttonText : ["REPLAY?", 
                        "REPLAY?", 
                        "REPLAY?"],
        buttonFunctions : [restart, restart, restart],
        text: "You defeat the dragon! YOU WIN THE GAME! &#x1F389;"
    },
    {
        name: "easter egg",
        buttonText : ["2", 
                        "8", 
                        "Go to town square?"],
        buttonFunctions : [pickTwo, pickEight, goTown],
        text: "You find a secret game. Pick a number above. Ten numbers will be randomly chosen between 0 and 10. If the number you choose matches one of the random numbers, you win!"
    },
    {
        name : "menu",
        buttonText : [  "Save game", 
                        "Load game", 
                        "Go back to the town"],
        buttonFunctions : [saveGame, loadGame, goTown],
        text: "You are in the game menu. Choose an option below."
    }
];
//initialize buttons
button1.onclick = goStore;
button2.onclick = goCave;
button3.onclick = fightDragon;
button4.onclick = goMenu;

function update(location){
    currentLocationIndex = locations.indexOf(location); 
    monsterStats.style.display = 'none';
    button1.innerHTML = location.buttonText[0];
    button2.innerHTML = location.buttonText[1];
    button3.innerHTML = location.buttonText[2];
    button1.onclick = location.buttonFunctions[0];
    button2.onclick = location.buttonFunctions[1];
    button3.onclick = location.buttonFunctions[2];

    if(location.buttonText.length === 4){
        button4.style.display = 'inline';
        button4.innerHTML = location.buttonText[3];
        button4.onclick = location.buttonFunctions[3];
    } else {
        button4.style.display = 'none';
    }
    text.innerHTML = location.text;
}
function goTown(){
    update(locations[0]);
}
function goStore() {
    update(locations[1]);
}   
function goCave() {
    update(locations[2]);
}
function goFight(){
    update(locations[3]);
    monsterHealth = monsters[fighting].health;
    monsterStats.style.display = 'block';
    monsterName.innerHTML = monsters[fighting].name;
    monsterHealthText.innerHTML = monsterHealth;

}
function buyHealth(){
    if (player.gold >= COST_HEALTH){
    player.gold -= COST_HEALTH;
    player.health += 10;
    goldText.innerHTML = player.gold;
    healthText.innerHTML = player.health;
    }else{
        text.innerHTML = "You do not have enough gold to buy health.";
    }
}
function buyWeapon(){
    if (player.currentWeaponIndex < weapons.length - 1){
    if(player.gold >= COST_WEAPON){
        player.gold -= COST_WEAPON;
        player.currentWeaponIndex++;
        goldText.innerHTML = player.gold;
        let newWeapon = weapons[player.currentWeaponIndex].name;
        text.innerHTML = "You now have a " + newWeapon + ".";
        player.inventory.push(newWeapon);
        text.innerHTML += " In your inventory you have: " + player.inventory;
    }else{
        text.innerHTML = "You do not have enough gold to buy a weapon.";
      }
    }else{
        text.innerHTML = "You already have the most powerful weapon!";
        button2.innerHTML = "Sell weapon for 15 gold";
         button2.onclick = sellWeapon;
    }
}
function sellWeapon(){
    if(inventory.length>1){
        player.gold += COST_WEAPON/2;
        goldText.innerHTML = player.gold;
        let currentWeapon = player.inventory.shift();
        text.innerHTML = "You sold a " + currentWeapon + ".";
        text.innerHTML += " In your inventory you have: " + player.inventory;
    }else{
        text.innerHTML = "Don't sell your only weapon!";
    }
}

function fightSlime (){
    fighting = 0;
    goFight();
}
function fightBeast (){
    fighting = 1;
    goFight();
}
function fightDragon() {
    fighting = 2;
    goFight();
}   
function attack(){
    text.innerHTML = "The " + monsters[fighting].name + " attacks.";
    text.innerHTML += " You attack it with your " + weapons[currentWeaponIndex].name + ".";
    player.health -= getMonsterAttackValue(monsters[fighting].level);
    if(isMonsterHit()){
        monsterHealth -= weapons[currentWeaponIndex].power + Math.floor(Math.random() * xp) + 1;
    }else{
        text.innerText += " You miss.";
    }
    healthText.innerHTML = player.health;
    monsterHealthText.innerHTML = monsterHealth;
    if(player.health <= 0){
        lose();
    }else if(monsterHealth <= 0){
        if(fighting === 2){
            winGame();
        }else{
            defeatMonster();
        }
    }
    if ((Math.random() <= .1) && (player.inventory.length !== 1)) {
        text.innerText += " Your " + player.inventory.pop() + " breaks.";
        player.currentWeaponIndex--;
    }
}
function getMonsterAttackValue(level){
    const hit = (level *5) - (Math.floor(Math.random() * xp));
    console.log(hit);
    return hit > 0? hit : 0;
}
function isMonsterHit(){
    return Math.random() > .2 || player.health < 20; //.2 это 0.2. возвращает True/false если выпадает больше 20 или если хп меньше 20
}
function dodge(){
    text.innerHTML = "You dodge the attack from the " + monsters[fighting].name;
}
function defeatMonster(){
    player.gold += Math.floor(monsters[fighting].level * 6.7);
    player.xp += monsters[fighting].level;
    goldText.innerHTML = player.gold;
    xpText.innerHTML = player.xp;
    update(locations[4]);
}
function lose(){
    update(locations[5]);
}
function winGame(){
    update(locations[6]);
}
function restart(){
    player.xp = 0;
    player.health = 100;
    player.gold = 50;
    player.currentWeaponIndex = 0;
    player.inventory = ["stick"];
    goldText.innerHTML = player.gold;
    healthText.innerHTML = player.health;
    xpText.innerHTML = player.xp;
    goTown();
}
function easterEgg (){
    update (locations[7]);
}
function pick(guess){
    const numbers = [];
    while (numbers.length < 10){
        numbers.push(Math.floor(Math.random() * 11));
    }
    text.innerText = "You picked " + guess + ". Here are the random numbers:\n";
    for (let i = 0; i < 10; i++){
        text.innerText += numbers[i] + '\n';
    }
    if (numbers.includes(guess)){
        text.innerText += "Right! You win 20 gold!";
        player.gold += 20;
        goldText.innerText = player.gold;
    }else{
        text.innerText += "Wrong! You lose 10 health!";
        player.health -= 10;
        healthText.innerText = player.health;
        if (player.healh <= 0){
            lose();
          }
    }
}
function pickTwo(){
    pick(2);
}
function pickEight(){
    pick(8);
}
function saveGame(){
    const gameState = {
        player : { ...player}, // Копируем объект (не ссылку)
        currentLocationIndex : currentLocationIndex
    };
    localStorage.setItem("gameState", JSON.stringify(gameState));
    text.innerHTML = "Game saved successfully!";
}
function loadGame(){
    const savedState = localStorage.getItem("gameState");
    if(saveGame){
        const gameState = JSON.parse(savedState);
        Object.assign(player, gameState.player);
        currentLocationIndex = gameState.currentLocationIndex;

        xpText.innerHTML = player.xp;
        healthText.innerHTML = player.health;
        goldText.innerHTML = player.gold;
        update(locations[currentLocationIndex]);
        text.innerHTML = "Game load successfully!";
    } else {
        text.innerHTML = "No saved game found.";
    }
}
function goMenu(){
    update(locations[locations.length - 1]);
}
