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
      .setName('fortune')
      .setDescription('Receive a daily fortune-style AI meme ✨'),
  
    async execute(interaction) {
      await interaction.deferReply();
  
      const meme = await generateMeme('fortune');
  
      const buttonRow = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId(BUTTON_IDS.GENERATE_AGAIN_FORTUNE)
          .setLabel('🔁 Get Another Fortune')
          .setStyle(ButtonStyle.Secondary)
      );
  
      const message = await interaction.editReply({
        content: `🔮 **Your Fortune:**\n${meme}`,
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