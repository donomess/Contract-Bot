const { SlashCommandBuilder, EmbedBuilder} = require('discord.js');

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
    async execute(interaction, client, config){
        console.log("[DEBUG] createtpcontract triggered by", interaction.user.username);

        await interaction.deferReply({ ephemeral: true });
        
        const vicetp = interaction.options.getUser('vicetp');
        const team = interaction.options.getRole('team');
        const terms = interaction.options.getString('termination');
        console.log('creating vice tp contract')

        const result = new EmbedBuilder()
            .setTitle(`Vice TP Contract for - ${vicetp.username}`)
            .setThumbnail(vicetp.displayAvatarURL({dynamic: true}))
            .addFields(
                {name: 'Team', value: `${team}`, inline:true},
                {name: 'Termination Clauses', value: `${terms}`, inline:true},

            )
            .setFooter({text: 'Tick to accept!'})
            .setColor('DarkOrange')
            .setTimestamp();
        
        const contractChannel = await client.channels.fetch(config.destChannelId)
        const contractMessage = await contractChannel.send({content:`${vicetp}`, embeds: [result]});

        await contractMessage.react('✅');

        await interaction.editReply({
            content: 'Contract successfully created!',
        });
    }
}