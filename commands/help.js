import { SlashCommandBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Show all available AI meme commands 📖'),

  async execute(interaction) {
    const helpMessage = `
🤖 **AI Meme Bot Commands**

- \`/roastme\` → Brutally honest roast meme 🔥  
- \`/fortune\` → Fortune-style spiritual wisdom ✨  
- \`/manifest\` → Startup-style motivation 💼  
- \`/flavor\` → Chaotic flavor of the day 🍜  
- \`/challenge\` → Daily emotional boss battle ⚔️  
- \`/help\` → This help message 📖

Built with ❤️ at [aigeneratememe.com](https://www.aigeneratememe.com)
    `;

    await interaction.reply(helpMessage);
  },
};