const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config()

// Replace these with your actual IDs and token
const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
const USER_NAME = process.env.DISCORD_USER_NAME;
const MIDJOURNEY_CHANNEL_ID = process.env.MIDJOURNEY_CHANNEL_ID;

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.on('messageCreate', async message => {
    if (message.author.bot) return;

    const args = message.content.split(' ');
    const command = args.shift().toLowerCase();

    if (command === '!mj') {
        const mjCommand = args.join(' ');

        try {
            const channel = await client.channels.fetch(MIDJOURNEY_CHANNEL_ID);
            if (channel) {
                const webhook = await channel.createWebhook('Proxy Webhook');
                await webhook.send({
                    content: mjCommand,
                    username: USER_NAME,
                    avatarURL: message.author.displayAvatarURL()
                });
                await webhook.delete();
                message.reply(`Command forwarded to MidJourney bot: ${mjCommand}`);
            } else {
                message.reply('Could not find the MidJourney bot or channel.');
            }
        } catch (error) {
            console.error('Error forwarding command:', error);
            message.reply('An error occurred while forwarding the command.');
        }
    }
});

client.login(BOT_TOKEN);
