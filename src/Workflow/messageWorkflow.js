const spriteNames = {
  django: "Django",
  miner: 'Bleurk',
  bino: 'Bino',
  fisherman: "Mino",
  cat: "Le chat",
  dog: "Le chien",
  cow: "La vache",
  boy: "La fille et le garçon",
  koko: "Koko",
  nono: "Nono",
}

const messageWorkflow = {
  bino: [
    {
      messages: [
        "... ►",
        "Je m'occupe de mon petit potager",
      ],
    },
    {
      messages: [
        "J'adore mon potager...",
      ],
    },
  ],
  koko: [
    {
      messages: [
        "Salut !",
      ],
    },
  ],
  nono: [
    {
      messages: [
        "Salut !",
      ],
    },
  ],
  fisherman: [
    {
      messages: [
        "Pas un bruit, j'ai une touche !",
      ],
    },
  ],
  cat: [
    {
      messages: [
        "Meow...",
      ],
    },
  ],
  dog: [
    {
      messages: [
        "Wof, wof...",
      ],
    },
  ],
  cow: [
    {
      messages: [
        "Meuh...",
      ],
    },
  ],
  boy: [
    {
      messages: [
        "Trop bien, on peut se baigner quand on veut !",
      ],
    },
  ],
  django: [
    {
      messages: [
        "Salut ! Moi c'est Django. ►",
        "Maï ? Joli prénom ! Tu es la bienvenue dans notre village. ►",
        "Si tu cherches un hébergement pour la nuit, tu es aussi la bienvenue chez moi !",
      ],
    },    {
      messages: [
        "Tu es la bienvenue chez moi.",
      ],
    },
  ],
  farmer: [
    {
      messages: [
        "Qui es-tu ? ►",
        "Tu n'as rien à faire dans notre village ! ►",
        "Vas t-en !",
      ],
      unlockEvents: [
        'updated_land',
      ],
    },
    {
      messages: [
        "Tu ne fais pas partie des miliciens qui tournent autour du village ? ►",
        "Désolé pour mon accueil brutal... ►",
        "Nous sommes sur les nerfs depuis quelques jours... ►",
        "depuis que ces miliciens sont venus et ont abattu des arbres... ►",
        "pour creuser le sol, à la recherche de matières premières précieuses. ►",
        "Nous cherchons un moyen pour chasser ces miliciens.",
      ],
    },
    {
      messages: [
        "Nous cherchons un moyen pour chasser ces miliciens. Peux-tu nous aider ?",
      ],
    },
    {
      messages: [
        "Quoi ??? Tu veux travailler à la mine ??? ►",
        "C'est très dangereux... ►",
        "Ok, comme tu veux, voici une tenue adaptée.",
      ],
      dependingOn: [
        'miner_met',
      ],
      unlockEvents: [
        'mine_clothes_found',
      ],
    },
    {
      messages: [
        "Ta tenue te convient ? Bon courage et sois prudente à la mine !",
      ],
    },
  ],
  miner: [
    {
      messages: [
        "Stop ! On ne passe pas."
      ],
      unlockEvents: [
        'miner_met',
      ],
    },
    {
      messages: [
        "J'ai dit qu'on ne passe pas."
      ],
    },
    {
      messages: [
        "Tu fais grise mine dans ta nouvelle tenue, mais ça va, ça passe, on t'attend à la mine !",
      ],
      dependingOn: [
        'mine_clothes_found',
      ],
      unlockEvents: [
        'miner_clothes_validated',
      ],
    },
    {
      messages: [
        "Tu vas pouvoir commencer à bosser !",
      ],
    },
  ],
};

export { spriteNames, messageWorkflow };
