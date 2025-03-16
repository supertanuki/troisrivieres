const spriteNames = {
  django: "Django",
  miner: "Bleurk",
  bino: "Bino",
  fisherman: "Mino",
  cat: "Le chat",
  dog: "Le chien",
  cow: "La vache",
  boy: "Les enfants",
  koko: "Koko",
  nono: "Nono",
  escargot: "L'escargot",
};

const messageWorkflow = {
  bino: [
    {
      messages: [
        "Hey, salut toi ! Moi je m'appelle Bino !",
        "Fais attention à ne pas marcher sur mes carottes.",
        "Le village est plutôt calme d'habitude, mais il se trame quelque chose pas loin d'ici.",
        "J'espère que ça n'aura pas d'impact sur mon potager.",
        "Si tu peux aller dénicher des infos, ça peut m'intéresser !",
      ],
      repeat: [
        "Je suis occupé avec mon potager. Va faire un tour, il se trame quelque chose…",
      ],
    },
    {
      messages: [
        "Je travaille, je travaille, mais j'avoue ne pas trop avoir la tête à ça…",
        "Je suis très inquiet avec toute cette histoire de rivière.",
        "En remontant la rivière, la cause de la pollution ne semble faire aucun doute…",
      ],
      repeat: [
        "Si tu remontes la rivière, tu trouveras sans doute l'origine du problème.",
      ],
      dependingOn: ["first_sleep"],
    },
  ],
  koko: [
    {
      messages: [
        "Oh bah, v’là donc une nouvelle arrivante !",
        "Ça fait plaisir d’voir une nouvelle tête !",
        "Bienvenue au village de Trois-Rivières !",
        "Moi c'est Koko.",
        "Maï ? Joli prénom…",
        " J’suis sûre que notre patelin va te plaire",
        "va donc y faire un tour !",
        "Et si tu cherches un endroit où dormir, y’a de quoi faire au sud.",
      ],
      repeat: [
        "Maï, si t’as fini d’visiter tout le village…",
        "va donc vers le sud pour trouver où dormir.",
      ],
    },
    {
      messages: [
        "Tu as rencontré Django ?",
        "C'est la personne la plus gentille que j'connaisse.",
      ],
      dependingOn: ["django_met"],
    },
    {
      messages: [
        "Oh la la, le pauv’Nono, il est dans un sal’état.",
        "Un peu comme la rivière qui est toute polluée.",
        "Tu peux aller voir Nono, il habite au nord du village.",
      ],
      repeat: [
        "Je me demande ce qui est arrivé à la rivière, toute marron, beurk.",
      ],
      dependingOn: ["first_sleep"],
    },
  ],
  nono: [
    {
      messages: [
        "Salut Maï !",
        "Comment je connais ton prénom ? C'est Koko qui me l'a dit.",
        "Elle aime bien tout savoir et que tout se sache ici !",
        "Je suis dans un sale état, car j'ai eu un accident de travail.",
        "Je travaillais à la mine, à l'est du village…",
        "Et pas de bol, un effondrement de roches…",
        "Je m'en sors plutôt pas trop mal, j'aurais pu y laisser ma peau.",
        "La rivière polluée ? Oui j'ai appris la mauvaise nouvelle…",
      ],
      repeat: ["Je dois me reposer, fini le travail à la mine pour l'instant."],
      unlockEvents: ["nono_first_met"],
    },
    {
      messages: [
        "Quoi ? Tu veux aller voir la mine ?",
        "Pour chercher l'origine de la pollution de la rivière ?",
        "Ok, pourquoi pas, je te prête mon laissez-passer pour la mine…",
        "Sois très prudente, reste discrète et reviens vite !",
      ],
      repeat: [
        "Fais bon usage de mon laissez-passer pour la mine… et sois très prudente !",
      ],
      dependingOn: ["nono_first_met", "miner_ask_for_card"],
      unlockEvents: ["card_for_mine"],
    },
  ],
  django: [
    {
      messages: [
        "Ooola, quel bon vent nous amène là !",
        "… Maï ? Quel joli prénom.",
        "Et donc tu cherches un lieu où dormir cette nuit ?",
        "Tu frappes à la bonne porte !",
        "Il faut qu'une porte soit ouverte ou fermée…",
        "et la mienne sera toujours ouverte !",
        "Reviens ici au coucher du soleil.",
        "Et profites-en pour parler aux gens du village, ça leur fera plaisir !",
      ],
      repeat: ["Fais un tour du village et reviens ce soir, je t'attendrai."],
      unlockEvents: ["django_met"],
    },
    {
      messages: [
        "Aah, tu es revenue !",
        "Comme disait ma grand-mère : qui se nourrit d'attente risque de mourir de faim.",
        "J'espère donc que tu aimes les soupes ! Allez, rentre.",
      ],
      dependingOn: ["miner_first_met"],
      unlockEvents: ["pre_first_sleep"],
    },
    {
      messages: [
        "Bien dormi, Maï ?",
        "Désolé d'être annonciateur de mauvaise nouvelle dès le réveil mais…",
        "Il s'est passé quelque chose de terrible dans le village.",
        "Je te laisse voir par toi-même, je vais rester ici pour jouer un peu.",
      ],
      repeat: ["Il s'est passé quelque chose de terrible dans le village."],
      dependingOn: ["first_sleep"],
    },
  ],
  miner: [
    {
      messages: ["Stop ! On ne passe pas."],
      repeat: ["Halte là, j'ai dit qu'on ne passe pas !"],
    },
    {
      messages: [
        "Ici, c'est interdit de passer ! De toute façon, le soleil se couche.",
        "Reviens demain matin, on causera.",
      ],
      repeat: ["J'ai dit qu'on ne passe pas. Il est tard, rentre chez toi !"],
      unlockEvents: ["miner_first_met"],
      dependingOn: ["django_met"],
    },
    {
      messages: [
        "Encore toi ? On ne passe pas !",
        "Ici c'est l'accès à la mine…",
        "et seules les personnes ayant un laissez-passer de travail peuvent traverser !",
      ],
      repeat: ["Sans un laissez-passer de travail, tu ne traverses pas."],
      dependingOn: ["first_sleep"],
      unlockEvents: ["miner_ask_for_card"],
    },
    {
      messages: [
        "T'es revenue ?",
        "Je vois que tu as un laissez-passer, je ne sais pas d'où tu le sors…",
        "Tu peux y aller… D'toute façon, on cherche des gens pour bosser…",
      ],
      repeat: [
        "Tu vas pouvoir commencer à bosser… Tu attends quoi pour y aller ?",
      ],
      dependingOn: ["card_for_mine"],
      unlockEvents: ["mine_access_validation"],
    },
  ],
  fisherman: [
    {
      messages: [
        "…chut, tu vas faire fuir les poissons…",
        "Et voilà, raté… Va parler aux autres, je suis concentré là.",
      ],
      repeat: ["…"],
    },
    {
      messages: [
        "Fichtre, je ne vais plus pouvoir pêcher. Qui sont les responsables de ce #?%@ ???",
      ],
      repeat: ["Si j'attrape les responsables de ce #?%@…"],
      dependingOn: ["first_sleep"],
    },
  ],
  boy: [
    {
      messages: ["Trop bien, on peut se baigner quand on veut !"],
    },
    {
      messages: ["Oh nooon, on ne peut plus jouer dans l'eau…"],
      dependingOn: ["first_sleep"],
    },
  ],
  cat: [
    {
      messages: ["Meow…"],
    },
  ],
  dog: [
    {
      messages: ["Wof, wof…"],
    },
  ],
  cow: [
    {
      messages: ["Meuh…"],
    },
  ],
  escargot: [
    {
      messages: ["…"],
    },
  ],
  mine: [
    {
      messages: [
        "Bon, la nouvelle, ton taf est très simple, c'est à ta portée.",
        "Tu dois nettoyer la roche pour extraire les métaux.",
        "Ces métaux sont très utiles pour fabriquer des tas d'objets…",
        "Du matériel électronique, des smartphones…",
        "Utilises ← ↑ → ↓ pour déplacer le tuyau…",
        "et la barre d'espace pour lancer l'eau. Allez c'est parti !",
      ],
      unlockEvents: ["mine_tuto_begin"],
    },
    {
      messages: [
        "Tu n'as pas compris comment ça fonctionne ???",
        "Tu dois nettoyer la roche pour extraire les métaux.",
        "Utilises ← ↑ → ↓ pour déplacer le tuyau",
        "et la barre d'espace pour lancer l'eau. Allez !",
      ],
      dependingOn: ["mine_tuto_missed"],
      unlockEvents: ["mine_tuto_rebegin"],
    },
    {
      messages: [
        "Tu as compris comment ça fonctionne…",
        "Quoi ?? On extrait l'eau de la rivière, pourquoi ?",
        "Et on stocke les résidus, les déchets dans des réservoirs.",
        "Je te rappelle qu'on est une mine responsable",
        "On ne fait pas n'importe quoi.",
        "Bon, arrête de poser des questions, au boulot !"
      ],
      dependingOn: ["mine_tuto_end"],
      unlockEvents: ["mine_after_tuto"],
    },
    {
      messages: [
        "Tu fais exprès de pas comprendre ?",
        "Quoi ?? On extrait l'eau de la rivière, pourquoi ?",
        "Et on stocke les résidus, les déchets dans des réservoirs.",
        "Je te rappelle qu'on est une mine responsable",
        "On ne fait pas n'importe quoi.",
        "Bon, arrête de poser des questions, au boulot !"
      ],
      dependingOn: ["mine_tuto_missed_twice"],
      unlockEvents: ["mine_after_tuto"],
    },
    {
      messages: [
        "T'arrives plus à suivre le rythme, non ?",
        "On s'arrête là pour aujourd'hui.",
      ],
      dependingOn: ["mine_game_over"],
      unlockEvents: ["mine_end"],
    },
  ],
};

const uiMessages = {
  'mine.faster': "Plus vite maintenant !!!",
  'mine.fasterAgain': "Encore plus vite, allez, allez !!!",
  'mine.waterEmpty': "Fais gaffe, tu as vidé ta réserve d'eau !",
  'mine.waterFull': "La réserve d'eau est à nouveau rechargée, au boulot !",
  'mine.moreMaterials': "Attention, gros arrivage de roches ! On accélère la production !",
  'mine.warning': "C'est quoi ce boulot ? On a beaucoup de pertes !",
  'mine.lastWarning': 'Dernier avertissement, concentre-toi !',
}

const getUiMessage = (name) => uiMessages[name];

export { spriteNames, messageWorkflow, getUiMessage };
