const { SlashCommandBuilder, EmbedBuilder} = require('discord.js');

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
    async execute(interaction, client, config) {
        console.log("[DEBUG] createdrivercontract triggered by", interaction.user.username);
    
        try {
            await interaction.deferReply({ ephemeral: true });
    
            const driver = interaction.options.getUser('driver');
            const team = interaction.options.getRole('team');
            const tier = interaction.options.getString('tier');
            const length = interaction.options.getString('length');
            const objectives = interaction.options.getString('objectives');
            const terms = interaction.options.getString('termination');
    
            const result = new EmbedBuilder()
                .setTitle(`Driver Contract for - ${driver.username}`)
                .setThumbnail(driver.displayAvatarURL({ dynamic: true }))
                .addFields(
                    { name: 'Team', value: `${team}`, inline: true },
                    { name: 'Tier', value: `${tier}`, inline: true },
                    { name: 'Length', value: `${length}`, inline: true },
                    { name: 'Objectives', value: `${objectives}`, inline: true },
                    { name: 'Termination Clauses', value: terms ?? 'Mutual termination implied.', inline: true }
                )
                .setFooter({ text: 'Tick to accept!' })
                .setColor('DarkGreen')
                .setTimestamp();
    
            const contractChannel = await client.channels.fetch(config.destChannelId);
            const contractMessage = await contractChannel.send({ content: `${driver}`, embeds: [result] });
    
            await contractMessage.react('✅');
    
            await interaction.editReply({
                content: 'Contract successfully created!',
            });
        } catch (err) {
            console.error('Error executing createdrivercontract:', err);
    
            if (interaction.deferred || interaction.replied) {
                try {
                    await interaction.editReply({
                        content: 'Something went wrong while creating the contract.',
                    });
                } catch (e) {
                    console.error('Failed to edit reply after error:', e);
                }
            } else {
                try {
                    await interaction.reply({
                        content: 'Something went wrong while creating the contract.',
                        ephemeral: true,
                    });
                } catch (e) {
                    console.error('Failed to send reply after error:', e);
                }
            }
        }
    }
}