const { REST, Routes} = require('discord.js');
require('dotenv').config();
const fs = require('fs');
const path = require('path');

const {TOKEN, CLIENT_ID, GUILD_ID} = process.env;

const commands = [];
const cmdPath = path.join(__dirname, 'commands');
const cmdFiles = fs.readdirSync(cmdPath).filter(file => file.endsWith('.js'));

for (const file of cmdFiles){
    const command = require(`./commands/${file}`);
    if ('data' in command && 'execute' in command){
        commands.push(command.data.toJSON());
    } else{
        console.warn(`[WARNING] The command at ./commands/${file} is missing "data" or "execute".`);
    }
}

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
    try{
        console.log("Clearing old commands...");
        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
            { body: [] }
        )
        console.log("Old commands cleared!");

        await new  Promise(resolve => setTimeout(resolve,3000));

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