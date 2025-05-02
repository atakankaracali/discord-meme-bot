import { SlashCommandBuilder } from 'discord.js';
import { generateMeme } from '../utils/generateMeme.js';

export default {
  data: new SlashCommandBuilder()
    .setName('challenge')
    .setDescription('Face today’s emotional boss battle meme ⚔️'),

  async execute(interaction) {
    await interaction.reply('Loading today’s existential challenge... 🧠⚔️');
    const meme = await generateMeme('challenge');
    await interaction.editReply(`🎯 Daily Challenge Meme:\n${meme}`);
  },
};