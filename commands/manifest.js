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
      .setName('manifest')
      .setDescription('Get a motivational AI meme to keep grinding 🚀'),
  
    async execute(interaction) {
      await interaction.deferReply();
  
      const feeling = 'Become rich';
      const problem = 'No opportunities';
      const lastEnjoyed = 'Free time and peace';
  
      const meme = await generateMeme('manifest', feeling, problem, lastEnjoyed);
  
      const buttonRow = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId(BUTTON_IDS.GENERATE_AGAIN_MANIFEST)
          .setLabel('🔁 Get Another Motivation')
          .setStyle(ButtonStyle.Success)
      );
  
      const message = await interaction.editReply({
        content: `💼 **Your Manifest Meme:**\n${meme}`,
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