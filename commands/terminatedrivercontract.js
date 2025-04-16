const { SlashCommandBuilder } = require('discord.js');
module.exports = {
    data: new SlashCommandBuilder()
    .setName('terminatedrivercontract')
    .setDescription('Terminate driver contract')
    .addUserOption(option =>
        option.setName('driver')
        .setDescription('Driver being terminated')
        .setRequired(true))
    .addRoleOption(option=>
        option.setName('team')
        .setDescription('The team the driver is being terminated from')
        .setRequired(true))
    .addStringOption(option => 
        option.setName('tier')
        .setDescription('Tier of the driver contract, include (reserve) if needed')
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