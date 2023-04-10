const {EmbedBuilder} = require('discord.js')
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('store')
    .setDescription('Store Discord Nitro')
    .addStringOption(option =>
        option.setName('input')
            .setDescription('The input to echo back')
            .setRequired(true)),
    async execute(interaction){
        
        const embed = new EmbedBuilder()
        .setColor("ff4b5c")
        .setDescription(`Buy a discord Nitro`)
        .setTimestamp()
        await interaction.reply({embeds: [embed]})
    }
}