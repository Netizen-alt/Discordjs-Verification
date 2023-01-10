import { Client, GatewayIntentBits, Routes, SlashCommandBuilder, PermissionsBitField, ChannelType, GuildTextBasedChannel, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, GuildMember, WebhookClient  } from 'discord.js'
import { REST } from 'discord.js'
import config from './config'
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds
    ],

});
const rest = new REST({
    version: '10'
}).setToken(config.token!);

client.on('ready', () => console.log('VcProject Developer By: JJ TEAM')

);

client.on('interactionCreate',(interaction) => {
    if (interaction.isChatInputCommand()) {
        switch (interaction.commandName) {
            case 'setup': {
                let channel = interaction.options.getChannel('channel') as GuildTextBasedChannel;
                interaction.reply({ content: "ตั้งค่่าเรียบร้อย", ephemeral: true });
                channel.send({
                    embeds: [
                        new EmbedBuilder().setDescription(`ยินดีต้อนรับเข้าสู่ **${interaction.guild?.name}** กดปุ่มด้านล่างเพื่อยืนยันตัวตน`)
                            .setColor('Aqua')
                            .setTitle('Quality Developer Verification')
                            .setFooter({ text: 'VcProject Developer By: JJ TEAM', iconURL: 'https://cdn.discordapp.com/attachments/901560603104124969/1011699888318316564/unknown.png' }),
                    ],
                    components: [
                        new ActionRowBuilder<ButtonBuilder>().setComponents(
                            new ButtonBuilder()
                                .setCustomId('verifyMem')
                                .setLabel('ยืนยัน')
                                .setStyle(ButtonStyle.Primary)
                                .setEmoji('✅')
                        ),
                    ],
                    
                });
                break;
            }
        }
    }
    else if (interaction.isButton()) {
        switch (interaction.customId) {
            case 'verifyMem': {
                const user = client.users.cache.get(interaction.member!.user.id);
                const member = interaction.member as GuildMember;
                const role = interaction.guild?.roles.cache.get(config.roleID);
               
                if (!role) {
                    console.log('Deny is add roles');
                    return;
                }
                member.roles.add(role).then((m) => {
                    interaction.deferUpdate();
                    console.log(`send to user ${interaction.member!.user.username}`)
                    const webhook = new WebhookClient({
                        id: config.webHookID, token: config.webTokenID
                    });
                    user?.send({ embeds: [new EmbedBuilder() .setDescription('คุณได้ยืนยันจากทางร้าน **QUALITY DEV** แล้ว') .setColor('Green') .setFooter({ text: 'VcProject Developer By: JJ TEAM', iconURL: 'https://cdn.discordapp.com/attachments/901560603104124969/1011699888318316564/unknown.png' }),]  }).catch((err) => {
                        console.log(`unknown send to user ${interaction.member!.user.username}`)
                        webhook.send({ embeds: [ new EmbedBuilder() .setTitle('รายชื่อบุคคบที่เกิดข้อผิดพลาด') .setDescription(`unknown send to user ${interaction.member!.user.username}`) .setFooter({ text: 'VcProject Developer By: JJ TEAM', iconURL: 'https://cdn.discordapp.com/attachments/901560603104124969/1011699888318316564/unknown.png' }) .setColor('Red')]})
                        interaction.followUp({ content: "เกิดข้อผิดพลาดไม่สามารถส่งข้อความได้ แต่คุณได้รับการยืนยันเรียบร้อย", ephemeral: true })
                        console.log('TT')
                    });
                });
                break;
            }
        }
    }
});

(async () => {
    try {
        rest.put(Routes.applicationGuildCommands(config.clientID!, config.guildID!), {
            body: [
                new SlashCommandBuilder()
                    .setName('setup')
                    .setDescription('ตั้งค่ารับบทบาท')
                    .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
                    .addChannelOption((option) =>
                        option
                            .setName('channel')
                            .setDescription('เลือกห้อง')
                            .addChannelTypes(ChannelType.GuildText)
                    ),
            ],
        });
        await client.login(config.token);
    } catch (error) {
        console.log(error)
    }
})();
