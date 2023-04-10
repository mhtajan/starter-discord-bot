const {EmbedBuilder} = require('discord.js')
const { SlashCommandBuilder } = require('discord.js');
const sqlite3 = require('sqlite3').verbose();


module.exports = {
    data: new SlashCommandBuilder()
    .setName('stock')
    .setDescription('Check Discord Stocks'),
    async execute(interaction){
        let db = new sqlite3.Database('./mydatabase.db');

// select all rows from the "products" table
db.all('SELECT type, COUNT(link) as count from products WHERE availability = 1 GROUP BY type', [], (err, rows) => {
  if (err) {
    throw err;
  }
  // print the rows to the console
  let str = ''
  rows.forEach(element => {
    str += `${element.type} Number of available stocks: ${element.count} \n`
  });
  if(rows.length === 0){
    interaction.reply('There are no Nitro Stock')
  }else{
    interaction.reply(str)
  }
});

// close the database connection
db.close();
    }
}