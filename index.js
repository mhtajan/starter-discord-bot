const Discord = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
const fetch = require('node-fetch');
const { Client, Collection,EmbedBuilder , Events, GatewayIntentBits, ActionRowBuilder,ModalBuilder, TextInputBuilder, TextInputStyle} = require('discord.js');
require('dotenv').config()
const prefix = process.env.PREFIX 
const token = process.env.TOKEN 

const sqlite3 = require('sqlite3').verbose();



const client = new Client({ intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,] });
client.commands = new Discord.Collection(); // Accessing commands collection

//client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	// Set a new item in the Collection with the key as the command name and the value as the exported module
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	} else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}
//storing nitro
let placeholder 
client.on(Events.InteractionCreate, async interaction => {
	if (interaction.isStringSelectMenu()){
		if(interaction.customId === 'selectNitro'){

			const selected = interaction.values[0];
			placeholder = interaction.values

			const modal = new ModalBuilder()
				.setCustomId('nitroLink')
				.setTitle(`Add ${selected}`);
	
			const linksInput = new TextInputBuilder()
				.setCustomId('linksInput')
				.setLabel(`Add discord ${selected}`)
				.setStyle(TextInputStyle.Paragraph);
	
			const LinkActionRow = new ActionRowBuilder().addComponents(linksInput);
			modal.addComponents(LinkActionRow);	
			await interaction.showModal(modal)
		}
		if(interaction.customId === 'claimNitro'){
			const selected = interaction.values[0];
			placeholder = interaction.values

			const modal = new ModalBuilder()
				.setCustomId('claimLink')
				.setTitle(`Claim ${selected}`)

			const claimInput = new TextInputBuilder()
				.setCustomId('claimInput')
				.setLabel(`Number of stocks to claim`)
				.setStyle(TextInputStyle.Short)

			const ClaimActionRow = new ActionRowBuilder().addComponents(claimInput);
			modal.addComponents(ClaimActionRow)
			await interaction.showModal(modal)
		}
	}
	if (interaction.isModalSubmit()){
		if(interaction.customId === 'nitroLink'){
			const NLinks = interaction.fields.getTextInputValue('linksInput')
			linksArray = separateLinks(NLinks)
			filteredLinks = filterValidUrls(linksArray)
			storeLinkstoDB(filteredLinks,placeholder[0])
			// const productsJson = JSON.stringify(products);
			// console.log(productsJson)
			await interaction.reply('Links Stored!')
		}
		if(interaction.customId === 'claimLink'){
			const CLinks = interaction.fields.getTextInputValue('claimInput')
			getStoreLinkfromDB(CLinks,interaction)
		}
		if(interaction.customId === 'validateLink'){
			const validateLinks = interaction.fields.getTextInputValue('validateLinkInput');
			const validLinksArray = separateLinks(validateLinks);
			const filteredValidLinks = filterValidUrls(validLinksArray);

			const promises = filteredValidLinks.map(async (element) => {
			const nitro_code = element.substr(element.length - 16);
			const response = await fetch(`https://discordapp.com/api/v9/entitlements/gift-codes/${nitro_code}?with_application=false&with_subscription_plan=true`);

			if (response.status === 200) {
				const data = await response.json();
				console.log(`${data.code} expires at: ${data.expires_at} created_by: ${data.user.username}#${data.user.discriminator}`);

				return {
				name: 'Code',
				value: `✅ ${data.code} \nExpires: ${data.expires_at} by ${data.user.username}#${data.user.discriminator}`,
				inline: true
				};
			} else {
				console.log('Invalid');

				return {
				name: 'Code',
				value: `🚫 ${nitro_code} - **INVALID**`
				};
			}
			});

			Promise.all(promises).then((fields) => {
			const validLinksEmbed = new EmbedBuilder()
				.setTitle('Nitro Code status')
				.setTimestamp()
				.addFields(fields);

			interaction.reply({ embeds: [validLinksEmbed] });
			});

		}
	}
	else return;
	
});


async function getStoreLinkfromDB(N,interaction){
	const db = new sqlite3.Database('./mydatabase.db');
	
	db.serialize(async() => {
		db.all(`SELECT * FROM products WHERE availability = 1 LIMIT ${N} `, (err, rows) => {
		  if (err) {
			console.error(err.message);
			return;
		  }
		  console.log(rows)
		  let LinkStr = ''
		  rows.forEach(row => {
			db.run(`UPDATE products SET availability = ? WHERE id = ?`, [0, row.id], (err) => {
			  if (err) {
				console.error(err.message);
				return;
			  }
			  console.log(row.link)
			  LinkStr += `${row.link}\n`
			  console.log(`Availability updated for product ID ${row.id} ${row.link}`);
			});
		  });  
		  db.close();
		  console.log(LinkStr)
		  interaction.reply('LinkStr')
		});
	  });
	  
}
function storeLinkstoDB(filteredLinks,type){
	// const name = `product${Object.keys(products).length + 1}`;
	// products[name] = { link: link,type: type, availability: true };
	let nitroType = type
	const db = new sqlite3.Database('./mydatabase.db');
	db.serialize(() => {
		db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='products'", (err, row) => {
		  if (err) {
			console.error(err.message);
			return;
		  }
	  
		  if (!row) {
			db.run('CREATE TABLE products (id INTEGER PRIMARY KEY AUTOINCREMENT, link TEXT, type TEXT, availability INTEGER)');
			const stmt = db.prepare('INSERT INTO products (link, type, availability) VALUES (?, ?, ?)');
			filteredLinks.forEach(singleLink => {
			  stmt.run(singleLink, nitroType, 1);
			});
			stmt.finalize();
			db.each('SELECT id, link, type, availability FROM products', (err, row) => {
			  console.log(`${row.id}: ${row.link} (${row.type}) - available: ${row.availability}`);
			}, () => {
			  db.close();
			  console.log('Database connection closed');
			});
		  } else {
			const stmt = db.prepare('INSERT INTO products (link, type, availability) VALUES (?, ?, ?)');
			filteredLinks.forEach(singleLink => {
			  stmt.run(singleLink, nitroType, 1);
			});
			stmt.finalize();
			db.each('SELECT id, link, type, availability FROM products', (err, row) => {
			  console.log(`${row.id}: ${row.link} (${row.type}) - available: ${row.availability}`);
			}, () => {
			  db.close();
			  console.log('Database connection closed');
			});
		  }
		});
	  });
	  

}

function separateLinks(LinksString){
	const links = LinksString.split(/[\n\s]+/);
	return links.filter(link => link.length > 0)
}

function isValidUrl(url){
	try{
		new URL(url)
		return true;
	}
	catch(error){
		return false;
	}
}
function filterValidUrls(urls){
	return urls.filter(url => isValidUrl(url));
}


client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});

client.on(Events.GuildCreate, async guild => {
	//insert Deploy Commands Here
})

client.once('ready', () => {
    console.log('Bot is online');
});
client.login(token)