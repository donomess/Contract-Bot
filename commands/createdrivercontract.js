const { SlashCommandBuilder } = require('discord.js');
module.exports = {
    data: new SlashCommandBuilder()
    .setName('createdrivercontract')
    .setDescription('Create a new driver contract')
    .addUserOption(option =>
        option.setName('driver')
        .setDescription('Driver being contracted')
        .setRequired(true))
    .addRoleOption(option=>
        option.setName('team')
        .setDescription('The team the driver is racing for')
        .setRequired(true))
    .addStringOption(option => 
        option.setName('tier')
        .setDescription('Tier of the driver contract, include (reserve) if needed')
        .setRequired(true))
    .addStringOption(option => 
        option.setName('length')
        .setDescription('Length of the contract')
        .setRequired(true))
    .addStringOption(option => 
        option.setName('objectives')
        .setDescription('Objectives for the driver during the duration of the contract')
        .setRequired(true))
    .addStringOption(option => 
        option.setName('termination')
        .setDescription('Not required. Mutual termination is implied')
        .setRequired(false)),
    async execute(interaction){
        console.log("[DEBUG] createdrivercontract triggered by", interaction.user.username);
        await interaction.reply({ content: 'Contract successfully created!'});
    }
}