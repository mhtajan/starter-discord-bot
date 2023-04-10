const { SlashCommandBuilder, ActionRowBuilder, Events, StringSelectMenuBuilder,EmbedBuilder } = require('discord.js');
const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({ intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,] });

module.exports = {
    data: new SlashCommandBuilder()
    .setName('add')
    .setDescription('Add discord Nitro'),
    async execute(interaction){
        
        const row = new ActionRowBuilder()
			.addComponents(
				new StringSelectMenuBuilder()
					.setCustomId('selectNitro')
					.setPlaceholder('Nothing selected')
					.setMinValues(1)
					.setMaxValues(1)
					.addOptions([
						{
							label: 'Basic',
							description: 'Store Nitro Basic',
							value: 'nitro_basic',
						},
						{
							label: 'Boost',
							description: 'Store Nitro Boost',
							value: 'nitro_boost',
						},
						{
							label: 'Classic',
							description: 'Store Nitro Classic',
							value: 'nitro_classic',
						},
					]),
			);
		await interaction.reply({components: [row] });
    }
}