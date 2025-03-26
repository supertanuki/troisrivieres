import isMobileOrTablet from "../Utils/isMobileOrTablet";

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
        "Hey, salut toi ! Moi je m'appelle Bino !",
        "Fais attention à ne pas marcher sur mes carottes.",
        "Tu es juste de passage ?",
        "Ou bien là pour enquêter sur ce qui se trame ?",
        "Plus au nord d'ici, il y a des personnes louches…",
        "(J'espère que cela n'impactera pas mon potager…)",
      ],
      repeat: [
        "(Je me demande bien ce que veulent ces gens…)",
      ],
    },
    {
      messages: [
        "Je travaille, mais j'ai pas trop la tête à ça…",
        "Je suis très inquiet à cause de la rivière polluée.",
        "Peut-être qu'en remontant à la source…",
        "on trouverait la cause du problème ?",
        "Mais je suis bien trop occupé là…",
      ],
      repeat: [
        "(Si seulement quelqu'un pouvait remonter la rivière…)",
      ],
      dependingOn: ["first_sleep"],
    },
  ],
  twoGuys: [
    {
      messages: [
        "- Le changement climatique, c'est du sérieux, mec.",
        "- Ok, mais tu penses à la biodiversité ?",
        "- Si, si, j'ai même arrêté de tuer les moustiques !",
      ]
    }
  ],
  twoWomen: [
    {
      messages: [
        "- J'arrête de manger de la viande !",
        "- Pour ta santé ?",
        "- Non, pour réduire mon empreinte carbone !",
      ]
    }
  ],
  baby: [
    {
      messages: [
        "Papa, je veux mon Papa",
      ]
    }
  ],
  sleepingGuy: [
    {
      messages: [
        "ZZZzzz, mmmh ?",
      ]
    }
  ],
  koko: [
    {
      messages: [
        "Oh bah, v’là donc une nouvelle arrivante…",
        "Bienvenue au village de Trois-Rivières !",
        "Ça fait plaisir d’voir une nouvelle tête.",
        "Moi c'est Koko.",
        "J'suis au courant de tout c'qui s'passe dans l'coin !",
        "… Maï ? Un prénom pas banal dis donc !",
        "J’suis sûre que notre patelin va te plaire.",
        "Va donc y faire un tour !",
        "Et si tu cherches un endroit où dormir…",
        "Django t'accueillera sûrement, il est plus au sud.",
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
        "Olala, olala… t'as vu ça Maï ?",
        "C'est terrible c'qui arrive à notre rivière !",
        "Un truc louche se trame vers l'est, j'te l'dis !",
        "Nono, qu'habite plus au nord, en revient justement.",
        "Il est mal en point, comme la rivière…",
        "peut-être qu'il pourra t'en dire plus !",
      ],
      repeat: [
        "Au nord, Nono pourra t'éclairer sur c'qui s'passe !",
      ],
      dependingOn: ["first_sleep"],
    },
    {
      messages: [
        "Je me demande ce qui est arrivé à la rivière, toute marron, beurk.",
      ],
      dependingOn: ["nono_first_met"],
    },
  ],
  nono: [
    {
      messages: [
        "C'est donc toi Maï ?",
        "Ton arrivée ne passe pas inaperçue.",
        "Comme tu peux le constater…",
        "tu ne me vois pas au meilleur de ma forme !",
        "Laisse moi t'expliquer brièvement ma mésaventure.",
        "À l'est, une mine vient de s'installer.",
        "J'ai tenté d'y travailler mais…",
        "il m'est arrivé un accident malencontreux.",
        "Il faut dire qu'on n'est pas très bien protégé.",
        "Et le rythme de travail y est extrêmement soutenu !",
        "Mais je m'en remettrai.",
        "Comme le disait mon grand-père…",
        "« j'suis plus fortiche en parlotte qu'en manuel ! »",
        "Bref. Je te dirais bien d'en prendre garde mais…",
        "je vois dans ton regard que tu es déterminée à y aller.",
        "Si jamais tu rencontres quelconque problème là-bas…",
        "Reviens me voir !",
      ],
      repeat: ["Si tu as un problème à la mine, reviens me voir !"],
      unlockEvents: ["nono_first_met"],
    },
    {
      messages: [
        "Ah, tu t'es faite refoulée à l'entrée ?",
        "J'imagine que suite à mon accident…",
        "l'accès à la mine a été un peu mieux sécurisé.",
        "Comme je te l'ai dit, je suis prêt à t'aider.",
        "Et donc à te prêter mon laissez-passer.",
        "Néanmoins, je le répète…",
        "je veux que tu sois sûre de savoir où tu mets les pieds !",
        "…",
        "Oui… Cette flamme de la curiosité brûle dans tes yeux…",
        "et elle ne sera satisfaite que si tu y vas, je le crains.",
        "Tiens, prends mon badge.",
        "Et surtout fais bien attention à toi !",
      ],
      repeat: [
        "Fais bon usage de mon badge… et sois prudente.",
      ],
      dependingOn: ["nono_first_met", "miner_ask_for_card"],
      unlockEvents: ["card_for_mine"],
    },
  ],
  django: [
    {
      messages: [
        "Ooola, quel bon vent nous amène là !",
        "… Maï ? Quel joli prénom.",
        "Et donc tu cherches un lieu où dormir cette nuit ?",
        "Tu frappes à la bonne porte !",
        "Comme je le dis souvent, il faut qu'une porte…",
        "soit ouverte ou fermée…",
        "et la mienne sera toujours ouverte !",
        "Donc fais un tour du village…",
        "et reviens au coucher du soleil !",
      ],
      repeat: ["Fais un tour du village et reviens ce soir."],
      unlockEvents: ["django_met"],
    },
    {
      messages: [
        "Aah, tu es revenue ! Comme disait ma grand-mère…",
        "un bon arbre peut loger dix mille oiseaux.",
        "Allez, entre !",
      ],
      dependingOn: ["miner_first_met"],
      unlockEvents: ["pre_first_sleep"],
    },
    {
      messages: [
        "Bien dormi, Maï ?",
        "Je suis désolé de te l'apprendre au réveil mais…",
        "quelque chose de terrible est arrivé au village !",
        "Vois par toi-même, je reste ici me calmer l'esprit.",
      ],
      repeat: ["Ooh pauvre rivière, laisse moi te jouer une prière."],
      dependingOn: ["first_sleep"],
    },
    {
      messages: [
        "Bien dormi, Maï ? C'était bien à la mine ?",
      ],
      repeat: ["C'était bien à la mine ?"],
      dependingOn: ["mine_nightmare_after"],
    },
  ],
  miner: [
    {
      messages: [
        "Interdit de passer par ici.",
      ],
      repeat: ["J'ai dit qu'on ne passe pas !"],
    },
    {
      messages: [
        "Hop hop hop… il est trop tard pour passer, désolé.",
        "Reviens demain.",
        "(Vivement que mon tour de garde se termine bientôt…)",
        "(j'ai des fourmis dans les jambes)",
      ],
      repeat: ["Il est trop tard pour passer, reviens demain."],
      unlockEvents: ["miner_first_met"],
      dependingOn: ["django_met"],
    },
    {
      messages: [
        "Il faut un laissez-passer pour passer.",
        "Nouvelle directive des chefs !",
      ],
      repeat: ["Il faut un laissez-passer pour accéder à la mine."],
      dependingOn: ["first_sleep"],
      unlockEvents: ["miner_ask_for_card"],
    },
    {
      messages: [
        "Je ne sais pas comment tu as eu ce badge...",
        "mais te voilà donc libre de passer.",
        "D'toute façon, on a besoin de bras pour bosser…",
      ],
      repeat: [
        "Tu peux passer…",
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
        "Par la barbe du %?#%, je ne vais plus pouvoir pêcher.",
        "Qui sont les responsables de ce #?%@ ???",
      ],
      repeat: ["Si j'attrape les responsables de ce #?%@…"],
      dependingOn: ["first_sleep"],
    },
  ],
  boy: [
    {
      messages: [
        "YOUPIII, on peut se baigner quand on veut !",
        "Faudrait trop qu'on ramène nos potes un jour !",
      ],
    },
    {
      messages: [
        "Oh nooon, on ne peut plus jouer dans l'eau…",
        "Qu'est-ce qu'on va faire maintenant ?",
      ],
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
  veal: [
    {
      messages: ["Mmmmh…"],
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
        isMobileOrTablet ? "Utilises le joystick pour déplacer le tuyau" : "Utilises ← ↑ → ↓ pour déplacer le tuyau…",
        isMobileOrTablet ? "En appuyant, l'eau est pulvérisé" : "et la barre d'espace pour lancer l'eau. Allez c'est parti !",
      ],
      unlockEvents: ["mine_tuto_begin"],
    },
    {
      messages: [
        "Tu n'as pas compris comment ça fonctionne ???",
        "Tu dois nettoyer la roche pour extraire les métaux.",
        isMobileOrTablet ? "Utilises le joystick pour déplacer le tuyau" : "Utilises ← ↑ → ↓ pour déplacer le tuyau",
        isMobileOrTablet ? "En appuyant, l'eau est pulvérisé" : "et la barre d'espace pour lancer l'eau. Allez !",
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
