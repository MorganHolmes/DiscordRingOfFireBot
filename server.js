//Discord Ring of Fire Bot - Morgan William Holmes 
//Set up the use of discord.js and creates a client object
const Discord = require ('discord.js');
const client = new Discord.Client();
const fetch = require('node-fetch');

//Puts a message in the terminal when the bot logs in
client.on('ready', () => {
  console.log('Ring of Fire Bot Is Logged In');
});

let players = [];
let deckID = "";
let remainingCards = "";
let numberOfKings = 4;
let rofRules = new Map();
let playerCount = 0;

const getCardMessage = (mess,card,cardCode) => {
    const message = new Discord.MessageEmbed()
        .setTitle(card.cards[0].value + " of " + card.cards[0].suit )
        .setDescription(rofRules.get(cardCode))
        .addFields(
            { name: 'Number of Kings Remaining', value: numberOfKings },
            { name: 'Next Player', value: players[playerCount]}
        )
        .setImage(card.cards[0].image)
        .setFooter(remainingCards + " cards remaining");
    mess.channel.send(message);
}

const setUpMap = () => {
    rofRules.set('A', "Waterfall -  Everyone Should Keep Drinking Until The Person Who Picked The Card Stop");
    rofRules.set('2', 'is Choose - You Can Choose Someone To Drink');
    rofRules.set('3', 'is Me - You Must Drink');
    rofRules.set('4', 'Whores - All Girls Must Drink');
    rofRules.set('5', 'Thumb Master');
    rofRules.set('6',  'Dicks - All Guys Drink');
    rofRules.set('7', 'Heaven - Point Your Finger In The Sky, Whoever Is Last Must Drink');
    rofRules.set('8', 'is Mate - Choose Someone To Drink With You');
    rofRules.set('9', 'Rhyme - Pick A Word To Rhyme');
    rofRules.set('0', 'Categories - Pick A Category');
    rofRules.set('J', 'Make A Rule');
    rofRules.set('Q', 'Question Master');
    rofRules.set('K','Last King Must Down There Drink');
}
  
client.on('message', async mess =>{
    if (mess.content === 'rofnewgame'){
        mess.channel.send("Welcome To Discord Ring of Fire :flame: :beers:");
        //Starts a new game and stores the deck ID
        const newDeck = await fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1').then(response => response.json());
        deckID = newDeck.deck_id;

        setUpMap();
        //empties the player array
        players = [];
        console.log("New Game Has Been Started");
    }

    if(mess.content === 'rofcommands'){
        mess.channel.send("Discord Ring of Fire Commands :flame: :beers:\nrofnewgame - Start A New Game \nrofnewplayer - Add A New Player \nroflistplayers - List All Current Players\nrofcommands - List All Commands\nrofpickcard - Picks A Card From The Desk");
    }

    if(mess.content.startsWith('rofnewplayer')){
        let inboundMessage = mess.content;
        let removedNewPlayerCommand = inboundMessage.replace("rofnewplayer ","");
        let removedHashTag = removedNewPlayerCommand.replace("#","");
        if(players.length >= 9){
            mess.channel.send("Sorry, only 10 players can play Discord Ring of Fire.");
        }
        else{
            players.push(removedHashTag);
            console.table(players);
            mess.channel.send(removedHashTag + " is added to the game.");
        }
    }

    if (mess.content === 'roflistplayers'){
        if(players.length == 0){
            mess.channel.send("No players in the game. Use the new player command to add a new player.");
        }
        else{
            for(let x = 0; x<players.length;x++){
                mess.channel.send("Player"+(x+1)+":"+" "+players[x]);
            }
        }
    }

    if(mess.content === 'rofpickcard'){
        const pickedCard = await fetch('https://deckofcardsapi.com/api/deck/'+deckID+'/draw/?count=1').then(res => res.json());
        remainingCards = pickedCard.remaining;
        if(pickedCard.cards[0].code.startsWith('K')){numberOfKings = numberOfKings - 1;}
        code = pickedCard.cards[0].code;
        cardCode = code.charAt(0);
        if(playerCount + 1 > players.length-1){playerCount = 0}
        else{playerCount = playerCount + 1}
        getCardMessage(mess,pickedCard,cardCode);
    }


})
    
//Logs into the client object using the bot ref
client.login(process.env.DISCORD_ROF_BOT_TOKEN);