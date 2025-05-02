import axios from 'axios';

export async function generateMeme(mode, feeling = '', problem = '', lastEnjoyed = '') {
    try {
        const res = await axios.post(`${process.env.BACKEND_URL}/generate-meme-text`, {
            mode,
            feeling,
            problem,
            lastEnjoyed
        });

        return res.data.memeText || '❌ Meme not generated.';
    } catch (error) {
        console.error(`❌ Meme generation failed [${mode}]`, error?.response?.data || error.message);
        return '⚠️ AI failed to generate a meme. Try again later.';
    }
}  