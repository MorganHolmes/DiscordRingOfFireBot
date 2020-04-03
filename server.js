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

const getCardMessage = (mess,card) => {
    const message = new Discord.MessageEmbed()
        .setTitle(card.cards[0].value + " of " + card.cards[0].suit )
        .setImage(card.cards[0].image)
        .addFields(
            { name: 'Number of Kings Remaining', value: numberOfKings }
        )
        .setFooter(remainingCards + " cards remaining");
    mess.channel.send(message);
}

client.on('message', async mess =>{
    if (mess.content === 'rofnewgame'){
        mess.channel.send("Welcome To Discord Ring of Fire :flame: :beers:");
        //Starts a new game and stores the deck ID
        const newDeck = await fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1').then(response => response.json());
        deckID = newDeck.deck_id;

        //empties the player array
        players = [];
        console.log("New Game Has Been Started");
    }

    if(mess.content === 'rofcommands'){
        mess.channel.send("rofnewgame - Start A New Game \nrofnewplayer - Add A New Player \nroflistplayers - List All Current Players\nrofcommands - List All Commands");
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
        getCardMessage(mess,pickedCard);
    }


})
    
//Logs into the client object using the bot ref
client.login(process.env.DISCORD_ROF_BOT_TOKEN);