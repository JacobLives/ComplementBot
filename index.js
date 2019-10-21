const Discord = require("discord.js");
const fs = require("fs");

//Initializes the client and config.
const client = new Discord.Client();
const config = require("./config.json");

let complements=fs.readFileSync("complements.txt","utf-8").split("\n");

//Activated upon booting up.
client.on("ready", () => {
  client.user.setActivity(`Serving ${client.guilds.size} servers`);
});

//Activated upon seeing a message.
client.on("message", async message => {
  
  //Avoids collision with other bots.
  if (message.author.bot || message.content.indexOf(config.prefix) !== 0) {
    return;
  }

  //Isolates the command from the prefix.
  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  //Finds Latency.
  if (command === "ping") {
    const m = await message.channel.send("Ping?");
    m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`);
  }

  //Gives complements.
  if (command === "complement") {
    console.log(":" + args[0])
    let newMessage = "";
    let nameFound = false;

    if (args[0] === undefined)
      newMessage = message.author.username + ". ";
    else {

      const list = message.channel.guild;

      list.members.forEach(member => {
        if (args[0] === member.user.username) {
          newMessage = args[0] + ". ";
          nameFound = true;
        }
      });

      if (nameFound === false) {
        message.channel.send("That is not a valid name.");
        return;
      }
    }
    let random = Math.floor((Math.random() * complements.length));
    console.log(random);
    newMessage += complements[random];
    message.delete().catch(O_o => {});
    message.channel.send(newMessage);
  }

  //Echos a message.
  if (command === "say") {
    const sayMessage = args.join(" ");
    message.delete().catch(O_o => {});
    message.channel.send(sayMessage);
  }
});

client.login(config.token)
