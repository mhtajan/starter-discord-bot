const {EmbedBuilder} = require('discord.js')
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('buy')
    .setDescription('Buy discord Nitro'),
    async execute(interaction){
        
        const embed = new EmbedBuilder()
        .setColor("ff4b5c")
        .setDescription(`Buy a discord Nitro`)
        .setTimestamp()
        await interaction.reply({embeds: [embed]})
    }
}