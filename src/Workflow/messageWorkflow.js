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
      repeat: ["(Je me demande bien ce que veulent ces gens…)"],
    },
    {
      messages: [
        "Je travaille, mais j'ai pas trop la tête à ça…",
        "Je suis très inquiet à cause de la rivière polluée.",
        "Peut-être qu'en remontant à la source…",
        "on trouverait la cause du problème ?",
        "Mais je suis bien trop occupé là…",
      ],
      repeat: ["(Si seulement quelqu'un pouvait remonter la rivière…)"],
      dependingOn: ["first_sleep"],
    },
    {
      messages: [
        "Hey Maï, tout roule pour toi ?",
        "Comme tu peux le voir, mon potager a disparu.",
        "À la place je désherbe le bord des routes.",
        "Mais ne crois pas que je sois triste !",
        "On peut accéder à tellement plus de denrées alimentaires",
        "grâce à nos voitures et à ces nouvelles routes !",
        "C'est un gros changement…",
      ],
      repeat: ["(Allez, ça ne va pas se désherber tout seul…)"],
      dependingOn: ["second_act_begin"],
    },
  ],
  twoGuys: [
    {
      messages: [
        "- Le changement climatique, c'est du sérieux, mec.",
        "- Ok, mais tu penses à la biodiversité ?",
        "- Si, si, j'ai même arrêté de tuer les moustiques !",
      ],
    },
    {
      messages: [
        "- Que c'est pratique ces nouvelles routes !",
        "- Tu l'as dit, j'ai rangé mon vieux vélo.",
        "- Le hic, c'est l'éternité qu'il faut…",
        "pour payer ma nouvelle automobile.",
      ],
      dependingOn: ["second_act_begin"],
    },
  ],
  twoWomen: [
    {
      messages: [
        "- J'arrête de manger de la viande !",
        "- Pour ta santé ?",
        "- Non, pour réduire mon empreinte carbone !",
      ],
    },
  ],
  baby: [
    {
      messages: ["Papa, je veux mon Papa"],
    },
  ],
  sleepingGuy: [
    {
      messages: ["ZZZzzz, mmmh ?"],
    },
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
      repeat: ["Au nord, Nono pourra t'éclairer sur c'qui s'passe !"],
      dependingOn: ["first_sleep"],
    },
    {
      messages: [
        "Je me demande ce qui est arrivé à la rivière, toute marron, beurk.",
      ],
      dependingOn: ["nono_first_met"],
    },
    {
      messages: [
        "Maï, c'est incroyable tu trouves pas ?",
        "Le génie humain j'veux dire.",
        "Pour trois fois moins de temps,",
        "j'peux aller voir ma famille, mes amies !",
        "Moi qui ADORE être au courant de tout,",
        "ça va grandement faciliter les potins héhé.",
        "D'ailleurs t'sais pas la dernière ?",
        "Une autre usine s'est installée au nord.",
        "Ça pousse comme des champignons ces choses là !",
      ],
      repeat: [
        "Tu d'vrais aller voir cette usine au nord",
        "p'têtre que t'y trouveras encore du travail !",
      ],
      dependingOn: ["second_act_begin"],
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
      repeat: ["Fais bon usage de mon badge… et sois prudente."],
      dependingOn: ["nono_first_met", "miner_ask_for_card"],
      unlockEvents: ["card_for_mine"],
    },
    {
      messages: [
        "La situation de nos rivières est perturbante,",
        "mais je dois bien avouer que ces nouvelles routes…",
        "facilitent énormément mes déplacements !",
        "Mon handicap ne fait pas bon ménage avec le vélo…",
        "ou rouler sur la terre, la gadoue et les pavés !",
        "D'ailleurs, savais-tu que ce sont les déchets de la mine…",
        "les résidus miniers, qui ont été recyclés…",
        "…dans le bitume des routes ? Impressionnant non ?",
        "Peu étonnant qu'il y ait foule pour aller à la mine,",
        "c'est devenu l'attraction des alentours.",
      ],
      repeat: ["On vit une ère très intrigante, tu ne trouves pas ?"],
      dependingOn: ["second_act_begin"],
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
        "Bien dormi Maï ?",
        "Après toutes ces semaines d'efforts à la mine,",
        "je tenais à te remercier",
        "pour tout ce que tu as fait pour nous.",
        "Grâce à toi, on a la confirmation",
        "que les eaux usées de la mine sont bien responsables",
        "de la pollution de la rivière.",
        "Mais dans le même temps, le village a pu se moderniser.",
        "Je dois avouer être un peu partagé.",
        "Est-ce un mal pour un bien ?",
        "Je n'ai pas la réponse",
        "et je ne voudrais pas t'influencer.",
        "Maintenant que tu as fini ton travail à la mine,",
        "tu as tout le temps de refaire un petit tour.",
      ],
      repeat: [
        "Une chose reste immuable dans tout ce bouleversement",
        "ce sont les 6 cordes de ma guitare.",
      ],
      dependingOn: ["second_act_begin"],
    },
  ],
  miner: [
    {
      messages: ["Interdit de passer par ici."],
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
        "Je ne sais pas comment tu as eu ce badge…",
        "mais te voilà donc libre de passer.",
        "D'toute façon, on a besoin de bras pour bosser…",
      ],
      repeat: ["Tu peux passer…"],
      dependingOn: ["card_for_mine"],
      unlockEvents: ["mine_access_validation"],
    },
    {
      messages: [
        "Allez, laissez-nous passer !",
        "On veut du travail nous aussi !",
      ],
      dependingOn: ["second_act_begin"],
    },
  ],
  minerChief: [
    {
      messages: [
        "Bienvenue à Grise Mine, LA mine responsable !",
        "D'ici sortent des tonnes de minerais chaque jour…",
        "extraits avec de l'énergie bas-carbone s'il vous plaît !",
        "Nous utilisons l'eau de façon raisonnée…",
        "traitons nos employés de manière exemplaire, et…",
        "Ça ne t'intéresse pas mon discours ?",
        "…",
        "Tu quoi ? Tu es là pour travailler ???",
        "Hahaha, elle est bien bonne celle-là.",
        "Mes meilleurs hommes sont épuisés très vite…",
        "tu ne tiendras pas une seconde là-dedans !",
        "Mais ok, je veux bien te faire une formation express.",
        "Apprête-toi à te faire miner… le moral HAHAHA",
      ],
      unlockEvents: ["mine_start"],
    },
  ],
  minerDirty2: [
    {
      messages: [
        "J'suis content d'avoir trouvé ce boulot…",
        "même si c'est pas forcément bien payé.",
      ],
      repeat: ["Ce boulot est pas forcément bien payé."],
    },
  ],
  minerDirty3: [
    {
      messages: ["Fiouuu.. ça fait du bien une petite pause…"],
    },
  ],
  minerDirty4: [
    {
      messages: [
        "Si tu cherches le chef, il est devant l'entrée.",
        "Maintenant laisse moi contempler la vue du progrès.",
      ],
      repeat: ["Contemple avec moi, la vue du progrès."],
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
    {
      messages: [
        "… Tout le monde est devenu fan",
        "de ces routes, de ces voitures…",
        "C'est vite oublier d'où on vient.",
        "Une mine s'installe, puis une usine…",
        "La rivière qui a baissé de niveau,",
        "juste en quelques semaines.",
        "Je me sens un peu démuni face à tout ça…",
        "Mais ça me réconforte que tu continues…",
        "de mener ta petite enquête, Maï.",
      ],
      repeat: ["Continue ton enquête, moi je surveille la rivière."],
      dependingOn: ["second_act_begin"],
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
    {
      messages: ["on ne peut plus attraper notre ballon !"],
      dependingOn: ["second_act_begin"],
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
        "Comme tu es nouvelle, je te mets sur un poste simple…",
        "…le nettoyage !",
        "Les roches vont avancer sur le crible…",
        "et tu devras les nettoyer pour éliminer les impuretés !",
        "Pourquoi faire ça tu vas me dire ? Pour le PROGRÈS.",
        "Les métaux et minerais dévoilés servent pour tout.",
        "Smartphones, consoles, plomberie, bijoux…",
        "Nous sommes la première étape d'un grand tout.",
        "Et tu n'en n'es qu'un maillon insignifiant…",
        "Bref. Voici comment procéder.",
        isMobileOrTablet()
          ? "Bouge le tuyau avec le joystick."
          : "Bouge le tuyau avec les flèches ← ↑ → ↓",
        isMobileOrTablet()
          ? "En bougeant le tuyau, l'eau est pulvérisée."
          : "Et pulvérise l'eau avec la barre ESPACE.",
        "J'espère que t'as bien tout compris !",
        "J'peux pas me permettre que tu ralentisses le train…",
        "de la mine !",
      ],
      unlockEvents: ["mine_tuto_begin"],
    },
    {
      messages: [
        "Tu n'as pas compris comment ça fonctionne ???",
        "Tu dois nettoyer la roche à CENT POUR CENT !",
        "On ne peut pas l'envoyer à moitié nettoyée.",
        isMobileOrTablet()
          ? "Bouge le tuyau avec le joystick."
          : "Bouge le tuyau avec les flèches ← ↑ → ↓",
        isMobileOrTablet()
          ? "En bougeant le tuyau, l'eau est pulvérisée. Allez !"
          : "Et pulvérise l'eau avec la barre ESPACE. Allez !",
      ],
      dependingOn: ["mine_tuto_missed"],
      unlockEvents: ["mine_tuto_begin"],
    },
    {
      messages: [
        "Tu as compris comment ça fonctionne…",
        "Passons aux choses sérieuses !",
        "Ça, c'est ce qui va dorénavant contrôler ta vie.",
        "Si tu rates trop souvent, une croix s'allumera.",
        "Au bout de trois croix…",
        "je viendrai moi-même t'accompagner à la sortie !",
        "…",
        "Quoi ?? Pourquoi tu me regardes comme ça ?",
        "Oui… On extrait l'eau de la rivière !",
        "Et on stocke les déchets dans des réservoirs.",
        "Je te rappelle qu'on est une mine responsable.",
        "On ne fait pas n'importe quoi !",
        "Bon, arrête de poser des questions, au boulot !",
      ],
      dependingOn: ["mine_tuto_end"],
      unlockEvents: ["mine_after_tuto"],
    },
    {
      messages: [
        "C'est bien ce qu'il me semblait…",
        "tu ne peux pas tenir un rythme aussi soutenu !",
        "On arrête les frais pour aujourd'hui.",
        "Allez… ne fais pas grise mine !",
      ],
      dependingOn: ["mine_game_over"],
      unlockEvents: ["mine_end"],
    },
  ],
  whiteWorker1: [
    {
      messages: [
        "Il y a trop de monde à la mine…",
        "alors j'ai tenté ma chance à l'usine.",
      ],
      repeat: ["Je tente ma chance à l'usine."],
    },
  ],
  whiteWorker2: [
    {
      messages: [
        "Je m'y connais pas trop en électronique…",
        "mais faut bien mettre du beurre dans les épinards !",
      ],
      repeat: ["Il faut bien mettre du beurre dans les épinards !"],
    },
  ],
  whiteWorkerChief: [
    {
      messages: [
        "(Pourquoi j'ai accepté ce job dans ce trou paumé.)",
        "(Je ne supporte pas ces gens, ni ce village, je…)",
        "Oui ? … Tu t'appelles Maï et tu veux travailler ?",
        "Bien sûr, comme tout le monde ici.",
        "Une usine dernier cri attire forcément…",
        "des ploucs euh… des gens comme vous.",
        "Pour t'expliquer en langage simple…",
        "Ici chez Nano World Company…",
        "… on assemble des circuits électroniques…",
        "Qui finissent ensuite dans des écrans ou téléphones.",
        "Est-ce que tu penses en être capable ?",
        "C'est un travail bien plus qualifié qu'à la mine.",
        "Pourquoi crois-tu qu'il y a autant de monde là-bas ! Peuh…",
        "Sois contente, tu peux faire une période d'essai.",
        "Période d'essai supervisée par moi-même.",
        "Voyons voir ce que tu vaux !",
      ],
      unlockEvents: ["factory_start"],
    },
  ],
  factory: [
    {
      messages: [
        "Comme tu es nouvelle, je te mets sur un poste simple…",
        "Tu dois monter les composants sur les cartes…",
        "Puis les nettoyer à l'eau pour éliminer les impuretés…",
        "Et faire ça le plus vite possible…",
        "Les clients n'attendent pas !",
        isMobileOrTablet()
          ? "Bouge les composants en appuyant à gauche ou à droite."
          : "Bouge les composants avec les flèches ← →",
        isMobileOrTablet()
          ? "Et valide le composant en appuyant au centre."
          : "Et valide le composant avec la barre ESPACE",
        "C'est parti !",
      ],
      unlockEvents: ["factory_tuto_begin"],
    },
    {
      messages: [
        "Tête de linotte !",
        "Tu n'as pas compris comment ça fonctionne ?",
        "Tu dois monter les composants sur les cartes…",
        isMobileOrTablet()
          ? "Bouge les composants en appuyant à gauche ou à droite."
          : "Bouge les composants avec les flèches ← →",
        isMobileOrTablet()
          ? "Et valide le composant en appuyant au centre."
          : "Et valide le composant avec la barre ESPACE",
        "C'est à la portée du premier venu !",
      ],
      dependingOn: ["factory_tuto_missed"],
      unlockEvents: ["factory_tuto_begin"],
    },
    {
      messages: [
        "Tu sembles avoir compris comment ça fonctionne…",
        "Passons aux choses sérieuses !",
        "Si tu rates l'assemblage, une croix s'allumera.",
        "Au bout de trois croix…",
        "je viendrai moi-même t'accompagner à la sortie !",
        "As-tu d'autres questions ???",
        "Tu dis que l'eau utilisé asseche la rivière ?",
        "Et qu'est-ce que ça peut me faire ?",
        "Tout le monde sera bien content…",
        "d'avoir des téléphones derniers cris !",
        "Arrête de te poser des questions et au boulot."
      ],
      dependingOn: ["factory_tuto_end"],
      unlockEvents: ["factory_after_tuto"],
    },
    {
      messages: [
        "C'est bien ce qu'il me semblait…",
        "tu ne peux pas tenir un rythme aussi soutenu !",
        "On arrête les frais pour aujourd'hui.",
        "Allez… Rentre chez toi !",
      ],
      dependingOn: ["factory_game_over"],
      unlockEvents: ["factory_end"],
    },
  ],
};

const uiMessages = {
  "mine.faster": "Plus vite !",
  "mine.fasterAgain": "Encore plus vite, allez !!!",
  "mine.waterEmpty": "Réservoir d'eau vide !",
  "mine.waterFull": "Réservoir d'eau plein !",
  "mine.moreMaterials": "Arrivage de minerais, on augmente la fréquence !",
  "mine.warning": "Ressaisis-toi, on est là pour faire du chiffre !",
  "mine.lastWarning": "Dernier avertissement, concentre-toi !",

  "factory.faster": "Validé ! Plus vite maintenant !!!",
  "factory.welldone": "C'est bien, tu es productive !",
  "factory.error": "C'est quoi ce boulot ? Ressaisis-toi la nouvelle !",
};

const getUiMessage = (name) => uiMessages[name];

export { spriteNames, messageWorkflow, getUiMessage };
