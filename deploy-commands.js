const { REST, Routes, SlashCommandBuilder } = require('discord.js');
require('dotenv').config();

const commands = [
    new SlashCommandBuilder()
    .setName('createDriverContract')
    .setDescription('Create a new driver contract')
    .addUserOption(option =>
        option.setName('Driver')
        .setDescription('Driver being contracted')
        .setRequired(true))
    .addRoleOption(option=>
        option.setName9('Team')
        .setDescription('The team the driver is racing for')
        .setRequired(true))
    .addStringOption(option => 
        option.setName('Tier')
        .setDescription('Tier of the driver contract, include (reserve) if needed')
        .setRequired(true))
    .addStringOption(option => 
        option.setName('Length')
        .setDescription('Length of the contract')
        .setRequired(true))
    .addStringOption(option => 
        option.setName('Objectives')
        .setDescription('Objectives for the driver during the duration of the contract')
        .setRequired(true))
    .addStringOption(option => 
        option.setName('Termination Clause(s)')
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