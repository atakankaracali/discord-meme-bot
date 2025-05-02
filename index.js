import { Client, Collection, GatewayIntentBits, Events } from 'discord.js';
import fs from 'fs';
import 'dotenv/config';
import { BUTTON_IDS, EMOJI_OPTIONS } from './utils/buttons.js';
import { generateMeme } from './utils/generateMeme.js';
import { db } from './utils/firebaseAdmin.js';
import { FieldValue } from 'firebase-admin/firestore';

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessageReactions,
    ],
});

client.commands = new Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = await import(`./commands/${file}`);
    client.commands.set(command.default.data.name, command.default);
}

client.once(Events.ClientReady, c => {
});

client.on(Events.InteractionCreate, async interaction => {
    if (interaction.isChatInputCommand()) {
        const command = client.commands.get(interaction.commandName);
        if (!command) return;

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(`❌ Error executing command ${interaction.commandName}`, error);
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ content: 'Something went wrong.', ephemeral: true });
            } else {
                await interaction.reply({ content: 'There was an error while executing this command.', ephemeral: true });
            }
        }
    }

    if (interaction.isButton()) {
        await interaction.deferUpdate();

        let mode = null;
        let customInputs = { feeling: '', problem: '', lastEnjoyed: '' };

        switch (interaction.customId) {
            case BUTTON_IDS.GENERATE_AGAIN:
                mode = 'roast';
                break;
            case BUTTON_IDS.GENERATE_AGAIN_FORTUNE:
                mode = 'fortune';
                break;
            case BUTTON_IDS.GENERATE_AGAIN_MANIFEST:
                mode = 'manifest';
                customInputs = {
                    feeling: 'Become rich',
                    problem: 'No opportunities',
                    lastEnjoyed: 'Free time and peace',
                };
                break;
            case BUTTON_IDS.GENERATE_AGAIN_CLASSIC:
                mode = 'classic';
                customInputs = {
                    feeling: 'Tired',
                    problem: 'Life',
                    lastEnjoyed: 'Coffee',
                };
                break;
            case BUTTON_IDS.GENERATE_AGAIN_FLAVOR:
                mode = 'flavor';
                break;
            case BUTTON_IDS.GENERATE_AGAIN_CHALLENGE:
                mode = 'challenge';
                break;
        }

        if (mode) {
            const meme = await generateMeme(
                mode,
                customInputs.feeling,
                customInputs.problem,
                customInputs.lastEnjoyed
            );

            await interaction.editReply({
                content: `🔁 **Another ${mode.charAt(0).toUpperCase() + mode.slice(1)} Meme:**\n${meme}`,
            });

            for (const emoji of EMOJI_OPTIONS) {
                try {
                    await interaction.message.react(emoji);
                } catch (err) {
                    console.error('❌ Emoji react error:', emoji, err.message);
                }
            }
        }
    }
});

client.on(Events.MessageReactionAdd, async (reaction, user) => {
    if (user.bot) return;

    const emoji = reaction.emoji.name;
    if (!EMOJI_OPTIONS.includes(emoji)) return;

    try {
        const statsRef = db.collection('emojiStats').doc(reaction.message.id);
        await statsRef.set({
            [emoji]: FieldValue.increment(1),
        }, { merge: true });

        console.log(`🔥 ${user.username} reacted with ${emoji}`);
    } catch (err) {
        console.error('❌ Firestore emoji update failed:', err.message);
    }
});

client.login(process.env.DISCORD_TOKEN);