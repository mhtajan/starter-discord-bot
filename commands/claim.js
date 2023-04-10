const { SlashCommandBuilder, ActionRowBuilder,StringSelectMenuBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('claim')
    .setDescription('Buy discord Nitro'),
    async execute(interaction){
        const row = new ActionRowBuilder()
			.addComponents(
				new StringSelectMenuBuilder()
					.setCustomId('claimNitro')
					.setPlaceholder('Nothing selected')
					.setMinValues(1)
					.setMaxValues(1)
					.addOptions([
						{
							label: 'Basic',
							description: 'Claim Nitro Basic',
							value: 'nitro_basic',
						},
						{
							label: 'Boost',
							description: 'Claim Nitro Boost',
							value: 'nitro_boost',
						},
						{
							label: 'Classic',
							description: 'Claim Nitro Classic',
							value: 'nitro_classic',
						},
					]),
			);
		await interaction.reply({components: [row] });
    }
}