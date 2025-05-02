import { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { generateMeme } from '../utils/generateMeme.js';
import { BUTTON_IDS, EMOJI_OPTIONS } from '../utils/buttons.js';

export default {
  data: new SlashCommandBuilder()
    .setName('roastme')
    .setDescription('Get a spicy AI-powered roast 🔥'),

  async execute(interaction) {
    await interaction.deferReply();

    const meme = await generateMeme('roast');

    const buttonRow = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId(BUTTON_IDS.GENERATE_AGAIN)
        .setLabel('🔁 Generate Another')
        .setStyle(ButtonStyle.Primary)
    );

    const message = await interaction.editReply({
      content: `🧠 **AI Roast:**\n${meme}`,
      components: [buttonRow],
    });

    for (const emoji of EMOJI_OPTIONS) {
      try {
        await message.react(emoji);
      } catch (err) {
        console.error('❌ Failed to react with emoji:', emoji, err.message);
      }
    }
  },
};