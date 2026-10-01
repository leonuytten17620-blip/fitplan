import express from 'express';
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.static('public'));

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post('/generate', async (req, res) => {
    const { sport, level, days, goal } = req.body;

    const prompt = `
Tu es un coach sportif professionnel. Crée un programme hebdomadaire clair et directement exploitable avec les paramètres suivants :
- Sport : ${sport}
- Niveau : ${level}
- Fréquence : ${days} séances par semaine
- Objectif : ${goal}

Structure le programme ainsi :
1. Résumé du cycle
2. Détail jour par jour (Séances, Exercices, Séries, Répétitions / Temps)
3. 3 conseils nutrition clés pour cet objectif.
Formate en texte clair et aéré.
    `;

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: prompt }],
            max_tokens: 1000
        });

        res.json({ plan: response.choices[0].message.content });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur lors de la génération du programme." });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));
