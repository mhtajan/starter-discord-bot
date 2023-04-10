const { Client, SlashCommandBuilder, Collection, Events, GatewayIntentBits, ActionRowBuilder,ModalBuilder, TextInputBuilder, TextInputStyle} = require('discord.js');
module.exports = {
    data: new SlashCommandBuilder()
    .setName('validate')
    .setDescription('Validate Discord Links'),
    async execute(interaction){
            const modal = new ModalBuilder()
				.setCustomId('validateLink')
				.setTitle(`Validate Nitro Link`);
	
			const validateLinkInput = new TextInputBuilder()
				.setCustomId('validateLinkInput')
				.setLabel(`Validate Nitro Link(s)`)
				.setStyle(TextInputStyle.Paragraph);
	
			const ValidateLinkActionRow = new ActionRowBuilder().addComponents(validateLinkInput);
			modal.addComponents(ValidateLinkActionRow);	
			await interaction.showModal(modal)
    }
}