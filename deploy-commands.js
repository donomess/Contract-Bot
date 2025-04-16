const { REST, Routes, SlashCommandBuilder } = require('discord.js');
require('dotenv').config();

const commands = [
    new SlashCommandBuilder()
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
        .setRequired(false))
    .toJSON()
];

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
    try{
        console.log("Reigstering commands...");
        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
            {body: commands}
        );
        console.log("Commands registered!");
    } catch (err) {
        console.error(err)
    }
})();