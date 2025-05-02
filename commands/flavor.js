import {
    SlashCommandBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
} from 'discord.js';
import { generateMeme } from '../utils/generateMeme.js';
import { BUTTON_IDS, EMOJI_OPTIONS } from '../utils/buttons.js';

export default {
    data: new SlashCommandBuilder()
        .setName('flavor')
        .setDescription("What's today's chaotic flavor? 🍜"),

    async execute(interaction) {
        await interaction.deferReply();
        const meme = await generateMeme('flavor');

        const buttonRow = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId(BUTTON_IDS.GENERATE_AGAIN_FLAVOR)
                .setLabel('🔁 Get Another Flavor')
                .setStyle(ButtonStyle.Secondary)
        );

        const message = await interaction.editReply({
            content: `🍜 **Today's Flavor:**\n${meme}`,
            components: [buttonRow],
        });

        for (const emoji of EMOJI_OPTIONS) {
            try {
                await message.react(emoji);
            } catch (err) {
                console.error('❌ Emoji react error:', emoji, err.message);
            }
        }
    },
};  