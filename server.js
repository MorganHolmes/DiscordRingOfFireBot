//Discord Ring of Fire Bot - Morgan William Holmes 
//Set up the use of discord.js and creates a client object
const Discord = require ('discord.js');
const client = new Discord.Client();

//Puts a message in the terminal when the bot logs in
client.on('ready', () => {
  console.log('Ring of Fire Bot Is Logged In');
});

//Array of Skyrim guard quotes
var quotes = ["I used to be an adventurer like you. Then I took an arrow in the knee...","Let me guess... someone stole your sweetroll.","Citizen.","Disrespect the law, and you disrespect me.","What do you need?","Trouble?","What is it?","No lollygaggin'.",
"My cousin's out fighting dragons, and what do I get? Guard duty.","Gotta keep my eyes open. Damn dragons could swoop down at any time.","Fear not. Come dragon or giant, we'll be ready."];


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


client.on('message', mess =>{
  if (mess.content === 'rof start new game'){
    mess.channel.send("Hello New World");
    console.log("New Game Has Been Started");
    }
})
    
//Logs into the client object using the bot ref
client.login(process.env.DISCORD_ROF_BOT_TOKEN);