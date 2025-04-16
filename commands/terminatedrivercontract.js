const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

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
    async execute(interaction, client, config){
        console.log("[DEBUG] terminatedrivercontract triggered by", interaction.user.username);

        await interaction.deferReply({ephemeral: true});
        
        const driver = interaction.options.getUser('driver');
        const team = interaction.options.getRole('team');
        const tier = interaction.options.getString('tier');
        const terms = interaction.options.getString('termination');
        const evi = interaction.options.getAttachment('evidence')
        console.log('terminating driver contract')

        const result = new EmbedBuilder()
            .setTitle(`Driver Contract Termination for - ${driver.username}`)
            .setThumbnail(driver.displayAvatarURL({dynamic: true}))
            .addFields(
                {name: 'Team', value: `${team}`, inline:true},
                {name: 'Tier', value: `${tier}`, inline:true},
                {name: 'Termination Reason', value: `${terms}`, inline:true},
                {name: 'Evidence', value: `${evi}`, inline: true}
            )
            .setFooter({text: 'Tick to accept! (Admin+ needed)'})
            .setColor('DarkPurple')
            .setTimestamp();
        
        const contractChannel = await client.channels.fetch(config.destChannelId)
        const contractMessage = await contractChannel.send({content:`${driver}`, embeds: [result]});

        await contractMessage.react('✅');

        await interaction.editReply({
            content: 'Contract successfully created!',
        });
    }
}