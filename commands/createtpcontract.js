const { SlashCommandBuilder } = require('discord.js');
module.exports = {
    data: new SlashCommandBuilder()
    .setName('createtpcontract')
    .setDescription('Create a new Vice TP Contract')
    .addUserOption(option =>
        option.setName('vicetp')
        .setDescription('Person becoming Vice TP')
        .setRequired(true))
    .addRoleOption(option =>
        option.setName('team')
        .setDescription('The team the person is becoming Vice TP for')
        .setRequired(true))
    .addStringOption(option =>
        option.setName('termination')
        .setDescription('Termination Clause(s), mutual agreement is implied.')
        .setRequired(false)),
    async execute(interaction){
        console.log("[DEBUG] createdrivercontract triggered by", interaction.user.username);
        await interaction.reply({ content: 'Contract successfully created!'});
    }
}