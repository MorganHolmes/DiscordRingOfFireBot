//Discord Ring of Fire Bot - Morgan William Holmes 
//Set up the use of discord.js and creates a client object
const Discord = require ('discord.js');
const client = new Discord.Client();
const fetch = require('node-fetch');

//Puts a message in the terminal when the bot logs in
client.on('ready', () => {
  console.log('Ring of Fire Bot Is Logged In');
});

//Array of Skyrim guard quotes
var quotes = ["I used to be an adventurer like you. Then I took an arrow in the knee...","Let me guess... someone stole your sweetroll.","Citizen.","Disrespect the law, and you disrespect me.","What do you need?","Trouble?","What is it?","No lollygaggin'.",
"My cousin's out fighting dragons, and what do I get? Guard duty.","Gotta keep my eyes open. Damn dragons could swoop down at any time.","Fear not. Come dragon or giant, we'll be ready."];

let players = [];
let deckID = "";
let remainingCards = "";

function generateEmbedMessage(){
  var randomNumber = Math.floor(Math.random() * quotes.length);
  var quote = quotes[randomNumber];
  //Creates a rich embeded object
  const embed = new Discord.RichEmbed()
    //Blank space
    //.addBlankField(true)
    //Image and the text
    .setImage("https://i.redd.it/bk0i8nnnzwzy.jpg")
    .addField('Guard','"' + quote  + '"');

  return embed;

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
        console.log(pickedCard);
        mess.channel.send(pickedCard.cards[0].value + " " + pickedCard.cards[0].suit);
    }


})
    
//Logs into the client object using the bot ref
client.login(process.env.DISCORD_ROF_BOT_TOKEN);