const Discord = require('discord.js');
const client = new Discord.Client();
const token = 'your-bot-token-here';

// Nitro stocks, initially set to 10
let nitroStocks = 10;

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', message => {
  // Check if the message is a command
  if (message.content.startsWith('!buy-nitro')) {
    // Check if there are available Nitro stocks
    if (nitroStocks > 0) {
      // Send a private message to the buyer
      message.author.send('You have successfully purchased Discord Nitro!');
      // Reduce the Nitro stocks by 1
      nitroStocks--;
      // Check if the buyer has vouched for the product
      if (message.member.roles.cache.some(role => role.name === 'Vouched')) {
        console.log(`${message.author.tag} has successfully purchased Nitro.`);
      } else {
        console.log(`${message.author.tag} has purchased Nitro without vouching.`);
      }
    } else {
      message.reply('Sorry, there are no available Nitro stocks at the moment.');
    }
  }
});

client.login(token);
