const i18next = require("i18next");

i18next.init({
  lng: "fr",
  fallbackLng: "fr",
  resources: {
    fr: {
        translation: {
            "Game not found": "Partie non trouvé",
            "Game is not in progress": "La partie n'existe pas",
            "It's not your turn": "Ce n'est pas ton tour",
            "Invalid move": "Coup interdit",  
        }, 
    },
    en: {
      translation: {
        "Vous avez déjà une partie en cours.": "You already have a party linked to your account.",
      },
    },
  },
});

module.exports = i18next;