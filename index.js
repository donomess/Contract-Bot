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
const cooldowns = new Collection();

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

    const now = Date.now();
    const cooldownAmount = 60*1000;

    if (!cooldowns.has(interaction.commandName)) {
        cooldowns.set(interaction.commandName, new Collection());
    }

    const timestamp = cooldowns.get(interaction.commandName);
    const userId = interaction.user.id;

    if (timestamp.has(userId)) {
        const expirationTime = timestamp.get(userId) + cooldownAmount;

        if (now < expirationTime) {
            const timeLeft = ((expirationTime - now) / 1000).toFixed(1);
            return interaction.reply({
                content: `Wait ${timeLeft}s before reusing the \`${interaction.commandName}\` command.`,
                ephemeral: true
            });
        }
    }

    timestamp.set(userId, now);
    setTimeout(() => timestamp.delete(userId), cooldownAmount);

    try {
        await command.execute(interaction, client, config);
    } catch (error) {
        console.error(`Error executing ${interaction.commandName}:`, error);

        if (!interaction.replied && !interaction.deferred) {
            try {
                await interaction.reply({
                    content: 'There was an error while executing this command!',
                    flags: 64,
                });
            } catch (err) {
                console.error('Failed to send error reply:', err);
            }
        } else {
            try {
                await interaction.followUp({
                    content: 'There was an error while executing this command!',
                    flags: 64,
                });
            } catch (err) {
                console.error('Failed to send follow-up:', err);
            }
        }
    }
});


client.login(process.env.TOKEN);