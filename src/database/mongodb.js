const mongoose = require(`mongoose`);

// Se connecter à MongoDB
mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        console.log(`✅ Connexion à MongoDB effectué`);
    }).catch((err) => {
        console.log(err, `❌ Echec de la connexion à MongoDB`);
    });