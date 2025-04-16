const { SlashCommandBuilder } = require('discord.js');
module.exports = {
    data: new SlashCommandBuilder()
    .setName('terminatetpcontract')
    .setDescription('Terminate a Vice TP Contract')
    .addUserOption(option =>
        option.setName('vicetp')
        .setDescription('Person being terminated Vice TP')
        .setRequired(true))
    .addRoleOption(option =>
        option.setName('team')
        .setDescription('The team the person is no longer Vice TP for')
        .setRequired(true))
    .addStringOption(option =>
        option.setName('termination')
        .setDescription('Termination reason')
        .setRequired(true))
    .addAttachmentOption(option =>
        option.setName('evidence')
        .setDescription('Attachment Evidence of the termination (if needed)')
        .setRequired(false)),
    async execute(interaction){
        console.log("[DEBUG] createdrivercontract triggered by", interaction.user.username);
        await interaction.reply({ content: 'Contract successfully created!'});
    }
}