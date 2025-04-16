const { Client, GatewayIntentBits, Collection, Partials} = require('discord.js');
require('dotenv').config();
const config = require('./config.json');
const fs = require('fs');
const path = require('path');

const client = new Client({
    intents: [ 
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages
    ],
    partials: [Partials.Message, Partials.Channel, Partials.Reaction]
});

client.commands = new Collection();

const cmdPath = path.join(__dirname, 'commands');
const cmdFiles = fs.readdirSync(cmdPath).filter(file => file.endsWith('.js'))

for (const file of cmdFiles){
    const filePath = path.join(cmdPath, file);
    const command = require(filePath)
    if ('data' in command && 'execute' in command){
        client.commands.set(command.data.name, command);
    } else{
        console.warn(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
}

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) {
        console.error(`No command matching ${interaction.commandName} found.`);
        return;
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(`Error executing ${interaction.commandName}:`, error);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: 'There was an error while executing this command!'});
        } else {
            await interaction.reply({ content: 'There was an error while executing this command!'});
        }
    }
});


client.login(process.env.TOKEN);