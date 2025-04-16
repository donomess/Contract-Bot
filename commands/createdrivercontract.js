const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
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
        .setRequired(false)),
    async execute(interaction){
        console.log("[DEBUG] createdrivercontract triggered by", interaction.user.username);

        const driver = interaction.options.getUser('driver');
        const team = interaction.options.getRole('team');
        const tier = interaction.options.getString('tier');
        const length = interaction.options.getString('length')
        const objectives = interaction.options.getString('objectives');
        const terms = interaction.options.getString('termination');
        console.log('creating driver contract')

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
}