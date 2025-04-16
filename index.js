const { Client, GatewayIntentBits, EmbedBuilder, Partials, Embed} = require('discord.js');
require('dotenv').config();
const config = require('./config.json');

const client = new Client({
    intents: [ 
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages
    ],
    partials: [Partials.Message, Partials.Channel, Partials.Reaction]
});

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.on('interactionCreate', async interaction => {
    if(!interaction.isChatInputCommand()) return;

    if(interaction.commandName === 'createdrivercontract'){
        if(interaction.channelId !== config.homeChannelId){
            return interaction.reply({
                content: 'You can only use this command in the ✍┋make-a-contract channel',
                ephemeral: true
            });
        };

        const driver = interaction.options.getUser('driver');
        const team = interaction.options.getRole('team');
        const tier = interaction.options.getString('tier');
        const length = interaction.options.getString('length')
        const objectives = interaction.options.getString('objectives');
        const terms = interaction.options.getString('termination');

        const result = new EmbedBuilder()
            .setTitle(`Driver Contract for - ${driver.username}`)
            .setThumbnail(driver.displayAvatarURL({dynamic: true}))
            .addFields(
                {name: 'Team', value: `${team}`, inline:true},
                {name: 'Tier', value: `${tier}`, inline:true},
                {name: 'Length', value: `${length}`, inline:true},
                {name: 'Objectives', value: `${objectives}`, inline:true},
                {name: 'Termination Clauses', value: `${terms}`, inline:true},

            )
            .setFooter({text: 'Tick to accept!'})
            .setColor('DarkGreen')
            .setTimestamp();
        
        const contractChannel = await client.channels.fetch(config.destChannelId)
        const contractMessage = await contractChannel.send({content:`${driver}`, embeds: [result]});

        await contractMessage.react('✅');

        await interaction.reply({
            content: 'Contract successfully created!',
            ephemeral: true
        });
    }
});

client.login(process.env.TOKEN);