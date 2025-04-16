const { SlashCommandBuilder, EmbedBuilder, Client , GatewayIntentBits, Partials} = require('discord.js');
const config = require('./config.json');

const client = new Client({
    intents: [ 
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages
    ],
    partials: [Partials.Message, Partials.Channel, Partials.Reaction]
});


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
        
        const vicetp = interaction.options.getUser('vicetp');
        const team = interaction.options.getRole('team');
        const terms = interaction.options.getString('termination');
        const evi = interaction.options.getAttachment('evidence')
        console.log('terminating tp contract')

        const result = new EmbedBuilder()
            .setTitle(`Vice TP Contract Termination for - ${vicetp.username}`)
            .setThumbnail(vicetp.displayAvatarURL({dynamic: true}))
            .addFields(
                {name: 'Team', value: `${team}`, inline:true},
                {name: 'Termination Clauses', value: `${terms}`, inline:true},
                {name: 'Evidence', value: `${evi}`, inline:true}

            )
            .setFooter({text: 'Tick to accept!'})
            .setColor('DarkVividPink')
            .setTimestamp();
        
        const contractChannel = await client.channels.fetch(config.destChannelId)
        const contractMessage = await contractChannel.send({content:`${vicetp}`, embeds: [result]});

        await contractMessage.react('✅');

        await interaction.reply({
            content: 'Contract successfully terminated!',
            ephemeral: true
        });
    }
}