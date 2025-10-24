import isMobileOrTablet from "../Utils/isMobileOrTablet";

const spriteNames = {
  django: "Django",
  bino: "Bino",
  fisherman: "Mino",
  cat: "Le chat",
  dog: "Le chien",
  cow: "La vache",
  boy: "Les enfants",
  girl: "La petite fille",
  koko: "Koko",
  nono: "Nono",
  escargot: "L’escargot",
  baby: "Le bébé",
  twoWomen: "Les deux femmes",
  twoGuys: "Les deux hommes",
  miner: "L’ouvrier",
  dcWorkerChief: "L’ouvrier chef",
  whiteWorkerChief: "L’ouvrier chef",
  minerChief: "L’ouvrier chef",
  blueWorkerChief: "L’ouvrier chef",
  blueWorker1: "L’ouvrier",
  blueWorker2: "L’ouvrier",
  minerDirty2: "L’ouvrier",
  minerDirty3: "L’ouvrier",
  minerDirty4: "L’ouvrier",
  whiteWorker1: "L’ouvrier",
  whiteWorker2: "L’ouvrier",
  sleepingGuy: "L’homme couché",
  minerZad1: "L’ouvrier déserteur",
  minerZad2: "Le mineur déserteur",
};

export const spriteSounds = {
  django: { sound: "sfx_voix_hommes", versions: 4 },
  miner: { sound: "sfx_voix_ouvriers", versions: 4 },
  boy: { sound: "sfx_voix_enfants", versions: 4 },
  girl: { sound: "sfx_voix_enfants", versions: 4 },
  baby: { sound: "sfx_voix_enfants", versions: 4 },
  koko: { sound: "sfx_voix_femmes", versions: 4 },
  nono: { sound: "sfx_voix_hommes", versions: 4 },
  fisherman: { sound: "sfx_voix_hommes", versions: 4 },
  twoWomen: { sound: "sfx_voix_femmes", versions: 4 },
  twoGuys: { sound: "sfx_voix_hommes", versions: 4 },
  bino: { sound: "sfx_voix_hommes", versions: 4 },
  minerZad1: { sound: "sfx_voix_hommes", versions: 4 },
  minerZad2: { sound: "sfx_voix_hommes", versions: 4 },
  whiteWorkerChief: { sound: "sfx_voix_ouvriers", versions: 4 },
  dcWorkerChief: { sound: "sfx_voix_ouvriers", versions: 4 },
  minerChief: { sound: "sfx_voix_ouvriers", versions: 4 },
  blueWorkerChief: { sound: "sfx_voix_ouvriers", versions: 4 },
  blueWorker1: { sound: "sfx_voix_hommes", versions: 4 },
  blueWorker2: { sound: "sfx_voix_hommes", versions: 4 },
  minerDirty2: { sound: "sfx_voix_hommes", versions: 4 },
  minerDirty3: { sound: "sfx_voix_hommes", versions: 4 },
  minerDirty4: { sound: "sfx_voix_hommes", versions: 4 },
  whiteWorker1: { sound: "sfx_voix_hommes", versions: 4 },
  whiteWorker2: { sound: "sfx_voix_hommes", versions: 4 },
  cat: { sound: "sfx_chat", versions: 2 },
  dog: { sound: "sfx_chien", versions: 2 },
  cow: { sound: "sfx_vache", versions: 1 },
  veal: { sound: "sfx_vache", versions: 2 },
};

const messageWorkflow = {
  bino: [
    {
      messages: [
        "Hey, salut toi ! Moi je m’appelle Bino !",
        "Fais attention à ne pas marcher sur mes carottes.",
      ],
      repeat: ["Fais attention à ne pas marcher sur mes carottes."],
    },
    {
      messages: [
        "Hey ! Tu es juste de passage ?",
        "Ou bien là pour enquêter sur ce qui se trame ?",
        "Plus au nord d’ici, il y a une personne louche…",
        "(J’espère que cela n’impactera pas mon potager…)",
      ],
      repeat: ["(Je me demande bien ce que veulent ces gens…)"],
      dependingOn: ["django_met"],
    },
    {
      messages: [
        "Je travaille, mais j’ai pas trop la tête à ça…",
        "Je suis très inquiet à cause de la rivière polluée.",
        "Peut-être qu’en remontant à la source…",
        "on trouverait la cause du problème ?",
        "Mais je suis bien trop occupé là…",
      ],
      repeat: ["(Si seulement quelqu’un pouvait remonter la rivière…)"],
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
        "C’est un gros changement…",
      ],
      repeat: ["(Allez, ça ne va pas se désherber tout seul…)"],
      dependingOn: ["second_act_begin"],
    },
    {
      messages: [
        "Hey Maï, ça roule ?",
        "Moi, ras-le-bol de désherber le bord des routes !",
        "J’ai vu sur FaceBouc que Django partait en voyage…",
        "J’aimerais bien partir avec lui !",
      ],
      repeat: ["(Il faut que j’aille voir Django pour ce voyage…)"],
      dependingOn: ["third_act_begin"],
    },
    {
      messages: ["Je n’arrive plus à faire pousser de légumes…"],
      dependingOn: ["fourth_act_begin"],
    },
    {
      messages: [
        "J’ai répondu à l’appel de Koko et Django…",
        "Mais peux pas m’empêcher de désherber partout…",
      ],
      repeat: ["(Allez, ça ne va pas se désherber tout seul…)"],
      dependingOn: ["strike_begin"],
    },
    {
      messages: ["Attendez… Je prends les tomates !"],
      dependingOn: ["django_final_end"],
      unlockEvents: ["game_over"],
    },
  ],
  twoGuys: [
    {
      messages: [
        "- Le changement climatique, c’est du sérieux, mec.",
        "- Ok, mais tu penses à la biodiversité ?",
        "- Si, si, j’ai même arrêté de tuer les moustiques !",
      ],
    },
    {
      messages: [
        "- Que c’est pratique ces nouvelles routes !",
        "- Tu l’as dit, j’ai rangé mon vieux vélo.",
        "- Le hic, c’est l’éternité qu’il faut…",
        "pour payer ma nouvelle automobile.",
      ],
      dependingOn: ["second_act_begin"],
    },
    {
      messages: [
        "- J’ai écrit un poème, écoute :",
        "Plus d’usines que de maisons",
        "Plus de mines que de raison",
        "- La nouvelle usine à l’ouest t’inspire ?",
        "- Elle m’inspire ce poème oui, de la confiance non.",
      ],
      repeat: ["L’usine à l’ouest n’inspire pas confiance."],
      dependingOn: ["third_act_begin"],
    },
    {
      messages: [
        "- (Il parait qu’on peut arrêter les publicités).",
        "- (Les écrans de publicité ? Mais comment ?)",
        "- (Moins fort ! Il faudrait demander à Koko)",
      ],
      repeat: ["- (Koko a un secret au sujet des écrans…)"],
      dependingOn: ["fourth_act_begin"],
    },
    {
      messages: [
        "- Avoue, c’est ta première manif’ ?",
        "- Mais pas du tout… j’ai fait les marches pour le climat !",
      ],
      dependingOn: ["strike_begin"],
    },
    {
      messages: ["Salut Maï, tu es attendue près de chez Bino."],
      dependingOn: ["strike_end"],
    },
  ],
  twoWomen: [
    {
      messages: [
        "- J’arrête de manger de la viande !",
        "- Pour ta santé ?",
        "- Non, pour réduire mon empreinte carbone !",
      ],
    },
    {
      messages: [
        "- Tu as vu le nouveau smartphone ?",
        "- Il a quoi de nouveau ?",
        "- Il se transforme en drone",
        "pour nous filmer ou nous photographier…",
        "sous tous les angles !",
        "Plus besoin de perche à selfie !",
      ],
      dependingOn: ["third_act_begin"],
    },
    {
      messages: [
        "- Il faut désarmer ces industries polluantes…",
        "- Je te sens rebelle, c’est Maï qui t’inspire ?",
      ],
      dependingOn: ["strike_begin"],
    },
    {
      messages: [
        "- Salut Maï, ça fait un bail !",
        "- Tu es attendue à l’est du village !",
      ],
      dependingOn: ["strike_end"],
    },
  ],
  baby: [
    {
      messages: ["Pa-pi-lion, pa-pi-lion"],
    },
    {
      messages: ["téyé-phone, téyé-phone…"],
      dependingOn: ["third_act_begin"],
    },
  ],
  sleepingGuy: [
    {
      messages: ["ZZZzzz, mmmh ?"],
    },
    {
      messages: [
        "Je… suis venu… depuis longtemps…",
        "Il… est temps de faire une…",
        "…petite sieste… ZZZzzz…",
      ],
      dependingOn: ["strike_begin"],
    },
  ],
  koko: [
    {
      messages: [
        "Oh bah, v’là donc une nouvelle arrivante…",
        "Bienvenue au village de Trois-Rivières !",
        "Ça fait plaisir d’voir une nouvelle tête.",
        "Moi c’est Koko.",
        "J’suis au courant de tout c’qui s’passe dans l’coin !",
        "… Maï ? Un prénom pas banal dis donc !",
        "J’suis sûre que notre patelin va te plaire.",
        "Va donc y faire un tour !",
        "Et si tu cherches un endroit où dormir…",
        "Django t’accueillera sûrement, il est plus au sud.",
      ],
      repeat: [
        "Maï, si t’as fini d’visiter tout le village…",
        "va donc vers le sud pour trouver où dormir.",
      ],
    },
    {
      messages: [
        "Tu as rencontré Django ?",
        "C’est la personne la plus gentille que j’connaisse.",
        "Tu devrais aller voir ce qui se trame à l’est…",
        "Il parait qu’une personne louche bloque un pont…",
      ],
      repeat: [
        "Tu devrais aller voir ce qui se trame à l’est…",
        "Il parait qu’une personne louche bloque un pont…",
      ],
      dependingOn: ["django_met"],
    },
    {
      messages: [
        "Olala, olala… t’as vu ça Maï ?",
        "C’est terrible c’qui arrive à notre rivière !",
        "Un truc louche se trame vers l’est, j’te l’dis !",
        "Nono, qu’habite plus au nord, en revient justement.",
        "Il est mal-en-point, comme la rivière…",
        "peut-être qu’il pourra t’en dire plus !",
      ],
      repeat: ["Au nord, Nono pourra t’éclairer sur c’qui s’passe !"],
      dependingOn: ["first_sleep"],
    },
    {
      messages: [
        "Je vois que tu as le badge de Nono…",
        "Fais attention à toi, Maï !",
      ],
      dependingOn: ["card_for_mine"],
    },
    {
      messages: [
        "Maï, c’est incroyable tu trouves pas ?",
        "Le génie humain j’veux dire.",
        "Pour trois fois moins de temps,",
        "j’peux aller voir ma famille, mes amies !",
        "Moi qui ADORE être au courant de tout,",
        "ça va grandement faciliter les potins héhé.",
        "D’ailleurs t’sais pas la dernière ?",
        "Une autre usine s’est installée au nord.",
        "Ça pousse comme des champignons ces choses là !",
      ],
      repeat: [
        "Tu d’vrais aller voir cette usine au nord",
        "p’têtre que t’y trouveras encore du travail !",
      ],
      dependingOn: ["second_act_begin"],
    },
    {
      messages: [
        "B’jour Maï ! Dis-moi…",
        "Tu peux m’aider à choisir un nouveau smartphone ?",
        "Le mien est déjà trop lent…",
        "C’est vraiment pratique pour être au courant de tout !",
        "D’ailleurs une nouvelle usine a ouvert à l’ouest.",
      ],
      repeat: ["Tu vas aller voir cette nouvelle usine à l’ouest ?"],
      dependingOn: ["third_act_begin"],
    },
    {
      messages: [
        "Maï…",
        "J’avais tellement la tête plongée dans les écrans…",
        "Que j’n’ai pas remarqué l’état de nos rivières !",
        "Qu’les oiseaux et les papillons ont disparu !",
        "QUOI ? Tu dis qu’il faut se mobiliser ?",
        "C’est une bonne idée !",
        "J’vais réunir les troupes.",
        "En attendant, t’pourrais faire une action d’éclat.",
        "Oh, je sais : éteindre les panneaux de pub !",
        "Les enfants m’ont dit qu’on pouvait les éteindre…",
        "en passant par derrière !",
      ],
      repeat: [
        "(il parait que…)",
        "(on peut éteindre les écrans pub par derrière…)",
        "(mais chut !)",
      ],
      dependingOn: ["fourth_act_begin"],
    },
    {
      messages: [
        "T’as réussi à éteindre un écran pub ?",
        "C’pas bien… et… c’est bien, à la fois !",
        "Si j’étais toi… J’en éteindrais d’autres !",
      ],
      repeat: ["Pourquoi ne pas éteindre d’autres écrans ?"],
      dependingOn: ["screens_shutdown_first"],
    },
    {
      messages: [
        "Merci Maï pour tout c’que t’as fait.",
        "Grâce à toi, tous les villageois…",
        "S’retrouvent pour une cause commune…",
        "L’avenir de notre village !",
      ],
      repeat: ["Merci encore, Maï."],
      dependingOn: ["strike_begin"],
    },
  ],
  nono: [
    {
      messages: [
        "C’est donc toi Maï ?",
        "Ton arrivée dans le village ne passe pas inaperçue.",
        "Comme tu peux le constater…",
        "tu ne me vois pas au meilleur de ma forme !",
        "À l’est, une mine vient de s’installer.",
        "J’ai tenté d’y travailler mais…",
        "il m’est arrivé un accident malencontreux.",
        "Il faut dire qu’on n’est pas très bien protégé.",
        "Et le rythme de travail y est extrêmement soutenu !",
        "Bref. Je te dirais bien d’en prendre garde mais…",
        "Je vois dans ton regard que tu es déterminée à y aller.",
      ],
      unlockEvents: ["pre_card_for_mine"],
    },
    {
      messages: [
        "Prends mon laissez-passer, je n’en ai plus besoin.",
        "Mais promets moi de faire bien attention à toi !",
      ],
      repeat: ["Fais bon usage de mon badge… et sois prudente."],
      dependingOn: ["pre_card_for_mine"],
      unlockEvents: ["card_for_mine"],
    },
    {
      messages: [
        "La situation de nos rivières est perturbante,",
        "mais je dois bien avouer que ces nouvelles routes…",
        "facilitent énormément mes déplacements !",
        "Mon handicap ne fait pas bon ménage avec le vélo…",
        "ou rouler sur la terre, la gadoue et les pavés !",
        "D’ailleurs, savais-tu que ce sont les déchets de la mine…",
        "les résidus miniers, qui ont été recyclés…",
        "…dans le bitume des routes ? Impressionnant non ?",
        "Peu étonnant qu’il y ait foule pour aller à la mine,",
        "c’est devenu l’attraction des alentours.",
      ],
      repeat: ["La situation de nos rivières est perturbante…"],
      dependingOn: ["second_act_begin"],
    },
    {
      messages: [
        "C’est assez formidable n’est-ce pas ?",
        "Ce confort, et l’accès à tout le savoir je veux dire.",
        "Il faut bien sûr réussir à bien s’informer…",
        "Heureusement, je sais démêler le vrai du faux !",
        "(Alors comme ça, la Terre serait plate !?)",
      ],
      repeat: ["J’apprends tellement grâce à l’internet !"],
      dependingOn: ["third_act_begin"],
    },
    {
      messages: ["C’est terrible, le village est méconnaissable…"],
      dependingOn: ["fourth_act_begin"],
    },
    {
      messages: [
        "Maï, je trouve que toutes ces expériences…",
        "t’ont fait grandir ! Je le vois dans tes yeux.",
      ],
      repeat: ["Tu as gagné en assurance, Maï."],
      dependingOn: ["strike_begin"],
    },
  ],
  django: [
    {
      messages: [
        "Ooola, quel bon vent nous amène là !",
        "… Maï ? Quel joli prénom.",
        "Et donc tu cherches un lieu où dormir cette nuit ?",
        "Tu frappes à la bonne porte !",
        "Comme je le dis souvent, il faut qu’une porte…",
        "soit ouverte ou fermée…",
        "et la mienne sera toujours ouverte !",
        "Donc reviens au coucher du soleil !",
      ],
      repeat: ["Fais un tour du village et reviens ce soir."],
      unlockEvents: ["django_met"],
    },
    {
      messages: [
        "Aah, tu es revenue ! Comme disait ma grand-mère…",
        "un bon arbre peut loger dix mille oiseaux.",
        "Allez, entre !",
      ],
      dependingOn: ["miner_first_met"],
      unlockEvents: ["pre_first_sleep"],
    },
    {
      messages: [
        "Bien dormi, Maï ?",
        "Je suis désolé de te l’apprendre au réveil mais…",
        "quelque chose de terrible est arrivé au village !",
        "Vois par toi-même, je reste ici me calmer l’esprit.",
      ],
      repeat: ["Ooh pauvre rivière, laisse moi te jouer une prière."],
      dependingOn: ["first_sleep"],
    },
    {
      messages: [
        "Bien dormi Maï ?",
        "Après toutes ces semaines d’efforts à la mine,",
        "je tenais à te remercier",
        "pour tout ce que tu as fait pour nous.",
        "Grâce à toi, on a la confirmation",
        "que les eaux usées de la mine sont bien responsables",
        "de la pollution de la rivière.",
        "Mais dans le même temps, le village a pu se moderniser.",
        "Je dois avouer être un peu partagé.",
        "Est-ce un mal pour un bien ?",
        "Je n’ai pas la réponse",
        "et je ne voudrais pas t’influencer.",
        "Maintenant que tu as fini ton travail à la mine,",
        "tu as tout le temps de te balader dans le village.",
      ],
      repeat: [
        "Une chose reste immuable dans tout ce bouleversement",
        "ce sont les 6 cordes de ma guitare.",
      ],
      dependingOn: ["second_act_begin"],
    },
    {
      messages: [
        "Tu as encore bien travaillé à l’usine !",
        "Ceci dit, le niveau de la rivière a encore baissé.",
        "C’est bien de savoir que c’est de leur faute…",
        "mais en attendant… le mal est fait.",
        "On n’arrête pas le progrès…",
        "De mon côté, je partirais bien loin du village…",
        "Loin de ces problèmes…",
        "Un voyage, c’est ça qu’il me faut !",
      ],
      repeat: ["J’ai envie de voyager, partir loin…"],
      dependingOn: ["third_act_begin"],
    },
    {
      messages: [
        "Salut Maï !",
        "L’usine de recyclage pompe l’eau de la rivière ?",
        "J’aimerais dire jamais deux sans trois.",
        "Mais ça continue, vois le chantier près de chez moi.",
        "Je ne sais pas ce qui se passe encore…",
      ],
      repeat: ["Un chantier au milieu de notre village…"],
      dependingOn: ["fourth_act_begin"],
    },
    {
      messages: [
        "Tu as raison, Maï…",
        "On ne peut plus laisser toutes ces industries…",
        "détruire notre village…",
        "pomper et polluer nos rivières…",
        "Quand on l’attaque, le village contre-attaque.",
        "Je suis partant pour une mobilisation générale !",
        "J’amène ma guitare et j’arrive.",
      ],
      dependingOn: ["screens_shutdown_end"],
      unlockEvents: ["django_ready_for_strike"],
    },
    {
      messages: [
        "Camarades de Trois-Rivières !",
        "Vous savez ce qui se passe dans notre village.",
        "Nos ressources et nos rivières ont été accaparés…",
        "Par des industries cupides et polluantes.",
        "Aujourd’hui nous leur disons stop !",
        "Comme le disait ma grand-mère…",
        "On peut couper nos branches mais pas nos racines.",
        "La lutte ne fait que commencer !",
      ],
      dependingOn: ["strike_begin"],
      unlockEvents: ["strike_end"],
    },
    {
      messages: [
        "Salut Maï ! Ça fait plaisir de te revoir !",
        "T’as vu le village ?",
        "La nature a repris ses droits, et nous nos esprits.",
        "Il faut dire qu’il n’y avait plus rien à exploiter ici.",
        "Les industriels sont ainsi partis voir ailleurs…",
        "Et les oiseaux sont revenus.",
        "Presque tous… c’est toujours mieux qu’aucun.",
        "Allez, viens. On t’attendais pour pique-niquer !",
      ],
      dependingOn: ["django_final"],
      unlockEvents: ["django_final_end"],
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
      repeat: ["Si j’attrape les responsables de ce #?%@…"],
      dependingOn: ["first_sleep"],
    },
    {
      messages: [
        "… Tout le monde est devenu fan",
        "de ces routes, de ces voitures…",
        "C’est vite oublier d’où on vient.",
        "Une mine s’installe, puis une usine…",
        "La rivière qui a baissé de niveau,",
        "juste en quelques semaines.",
        "Je me sens un peu démuni face à tout ça…",
        "Mais ça me réconforte que tu continues…",
        "de mener ta petite enquête, Maï.",
      ],
      repeat: ["Continue ton enquête, moi je surveille la rivière."],
      dependingOn: ["second_act_begin"],
    },
    {
      messages: [
        "Ce que je craignais est arrivé.",
        "Trois-Rivières a complètement changé…",
        "et nos habitudes avec.",
        "Heureusement moi, je tiens bon la barre !",
        "(Attendre ici me donne faim par contre…)",
        "(Je mangerais bien un bon burger tiens !)",
      ],
      repeat: ["(Burger… burger……) hmmmmm, je disais quoi déjà ?"],
      dependingOn: ["third_act_begin"],
    },
    {
      messages: ["Tout part à la dérive, comme mon vieux rafiot…"],
      dependingOn: ["fourth_act_begin"],
    },
    {
      messages: [
        "J’me demande bien comment on va se débarrasser…",
        "…de ces #?%@ qui polluent nos rivières !",
      ],
      dependingOn: ["strike_begin"],
    },
  ],
  boy: [
    {
      messages: [
        "YOUPIII, on peut se baigner quand on veut !",
        "Faudrait trop qu’on ramène nos potes un jour !",
      ],
    },
    {
      messages: [
        "Oh nooon, on ne peut plus jouer dans l’eau…",
        "Qu’est-ce qu’on va faire maintenant ?",
      ],
      dependingOn: ["first_sleep"],
    },
    {
      messages: ["Quand nous pourrons rejouer dans la rivière ?"],
      dependingOn: ["second_act_begin"],
    },
    {
      messages: ["… Mmmmh, j’ai envie d’un gros burger…"],
      dependingOn: ["third_act_begin"],
    },
    {
      messages: ["C’est ma première manif, trop chouette !"],
      dependingOn: ["strike_begin"],
    },
  ],
  girl: [
    {
      messages: ["…"],
    },
    {
      messages: ["La rivière est toute petite maintenant…"],
      dependingOn: ["second_act_begin"],
    },
    {
      messages: [
        "Ça serait tellement bien si j’avais…",
        "un smartphone pour jouer aux jeux vidéos…",
        "comme FortNight ou BroStar…",
      ],
      dependingOn: ["third_act_begin"],
    },
    {
      messages: ["Tante Koko et oncle Django sont trop forts !"],
      dependingOn: ["strike_begin"],
    },
  ],
  cat: [
    {
      messages: ["Meow…"],
    },
  ],
  dog: [
    {
      messages: ["Wof…"],
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
  miner: [
    {
      messages: ["Interdit de passer par ici."],
      repeat: ["J’ai dit qu’on ne passe pas !"],
    },
    {
      messages: [
        "Hop hop hop… il est trop tard pour passer, désolé.",
        "Reviens demain.",
        "(Vivement que mon tour de garde se termine bientôt…)",
        "(j’ai des fourmis dans les jambes)",
      ],
      repeat: ["Il est trop tard pour passer, reviens demain."],
      unlockEvents: ["miner_first_met"],
      dependingOn: ["django_met"],
    },
    {
      messages: [
        "Il faut un laissez-passer pour passer.",
        "Nouvelle directive des chefs !",
      ],
      repeat: ["Je t’ai dit qu’il faut un laissez-passer…"],
      dependingOn: ["first_sleep"],
    },
    {
      messages: [
        "Je ne sais pas comment tu as eu ce badge…",
        "mais te voilà donc libre de passer.",
        "D’toute façon, on a besoin de bras pour bosser…",
      ],
      repeat: ["Tu peux passer…"],
      dependingOn: ["card_for_mine"],
      unlockEvents: ["mine_access_validation"],
    },
    {
      messages: [
        "Apparemment, ils n’ont plus besoin de nous…",
        "Pas autant en tout cas.",
        "Les machines que nous avons créées nous remplacent.",
      ],
      dependingOn: ["second_act_begin"],
    },
  ],
  minerChief: [
    {
      messages: [
        "Bienvenue à Grise Mine, LA mine responsable !",
        "D’ici sortent des tonnes de minerais chaque jour…",
        "extraits avec de l’énergie bas-carbone s’il vous plaît !",
        "Nous utilisons l’eau de façon raisonnée…",
        "traitons nos employés de manière exemplaire, et…",
        "Ça ne t’intéresse pas mon discours ?",
        "…",
        "Tu quoi ? Tu es là pour travailler ???",
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
        "J’suis content d’avoir trouvé ce boulot…",
        "même si c’est pas forcément bien payé.",
      ],
      repeat: ["Ce boulot est pas forcément bien payé."],
    },
  ],
  minerDirty3: [
    {
      messages: [
        "Fiouuu… ça fait du bien une petite pause…",
        "Je plains celui qui devra dépolluer ces bassins d’eau.",
        "Enfin… si on le fait un jour…",
      ],
    },
  ],
  minerDirty4: [
    {
      messages: [
        "Si tu cherches le chef, il est devant l’entrée.",
        "Maintenant laisse moi contempler la vue du progrès.",
      ],
      repeat: ["Contemple avec moi, la vue du progrès."],
    },
  ],
  mine: [
    {
      messages: [
        isMobileOrTablet()
          ? "Installe-toi…\n(touche pour continuer)"
          : "Installe-toi…\n(espace pour continuer)",
        "Comme tu es nouvelle, je te mets sur un poste simple…",
        "…le nettoyage !",
        "Les roches vont avancer sur le tapis roulant…",
        "et tu devras les nettoyer pour éliminer les impuretés !",
        "Pourquoi faire ça tu vas me dire ? Pour le PROGRÈS.",
        "Les métaux et minerais extraits servent pour tout.",
        "Smartphones, consoles, plomberie, bijoux…",
        "Nous sommes la première étape d’un grand tout.",
        "Et là dedans, tu n’es qu’un maillon insignifiant…",
        "Bref. Voici comment procéder.",
        isMobileOrTablet()
          ? "Bouge le tuyau avec le joystick."
          : "Bouge le tuyau avec les flèches ← → ↑ ↓",
        isMobileOrTablet()
          ? "En bougeant le tuyau, l’eau est pulvérisée."
          : "Et pulvérise l’eau avec la barre ESPACE.",
        "J’espère que t’as bien tout compris !",
        "J’peux pas me permettre que tu ralentisses le train…",
        "de la mine !",
      ],
      unlockEvents: ["mine_tuto_begin"],
    },
    {
      messages: [
        "Tu n’as pas compris comment ça fonctionne ???",
        "Tu dois nettoyer la roche à CENT POUR CENT !",
        "On ne peut pas l’envoyer à moitié nettoyée.",
        isMobileOrTablet()
          ? "Bouge le tuyau avec le joystick."
          : "Bouge le tuyau avec les flèches ← → ↑ ↓",
        isMobileOrTablet()
          ? "En bougeant le tuyau, l’eau est pulvérisée. Allez !"
          : "Et pulvérise l’eau avec la barre ESPACE. Allez !",
      ],
      dependingOn: ["mine_tuto_missed"],
      unlockEvents: ["mine_tuto_begin"],
    },
    {
      messages: [
        "Tu as compris comment ça fonctionne…",
        "Passons aux choses sérieuses !",
      ],
      dependingOn: ["mine_tuto_end"],
      unlockEvents: ["mine_show_score_board"],
    },
    {
      messages: [
        "Ça, c’est ce qui va contrôler ton travail.",
        "Si tu rates trop souvent, une croix s’allumera.",
        "Au bout de trois croix…",
        "je viendrai moi-même t’accompagner à la sortie !",
        "…",
        "Quoi ?? Qu’est-ce qui ne va pas ?",
        "Oui… On extrait l’eau de la rivière !",
        "Et on stocke les déchets dans des réservoirs.",
        "Je te rappelle qu’on est une mine responsable.",
        "On ne fait pas n’importe quoi !",
        "Bon, arrête de poser des questions, au boulot !",
      ],
      dependingOn: ["mine_show_score_board"],
      unlockEvents: ["mine_after_tuto"],
    },
    {
      messages: [
        "C’est bien ce qu’il me semblait…",
        "tu ne peux pas tenir un rythme aussi soutenu !",
        "On arrête les frais pour aujourd’hui.",
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
        "alors j’ai tenté ma chance à l’usine.",
      ],
      repeat: ["Je tente ma chance à l’usine."],
    },
    {
      messages: [
        "Vu la qualité de ton travail…",
        "ou la non qualité de ton travail ?",
        "Tu n’es plus la bienvenue à l’usine. Ordre du chef !",
      ],
      repeat: ["Tu n’es plus la bienvenue ici."],
      dependingOn: ["third_act_begin"],
    },
  ],
  whiteWorker2: [
    {
      messages: [
        "Je m’y connais pas trop en électronique…",
        "mais faut bien mettre du beurre dans les épinards !",
      ],
      repeat: ["Il faut bien mettre du beurre dans les épinards !"],
    },
    {
      messages: ["Tu ne passes plus… Ordre des chefs !"],
      dependingOn: ["third_act_begin"],
    },
  ],
  whiteWorkerChief: [
    {
      messages: [
        "(Pourquoi j’ai accepté ce job dans ce trou paumé.)",
        "(Je ne supporte pas ces gens, ni ce village, je…)",
        "Oui ? … Tu t’appelles Maï et tu veux travailler ?",
        "Bien sûr, comme tout le monde ici.",
        "Une usine dernier cri attire forcément…",
        "des ploucs euh… des gens comme vous.",
        "Pour t’expliquer en langage simple…",
        "Ici chez Nano World Company…",
        "… on assemble des circuits électroniques…",
        "Qui finissent ensuite dans des écrans ou téléphones.",
        "Sois contente, tu peux faire une période d’essai.",
        "Est-ce que tu penses en être capable ?",
        "Voyons voir ce que tu vaux !",
      ],
      unlockEvents: ["factory_start"],
    },
  ],
  blueWorker1: [
    {
      messages: ["C’est l’dernier endroit qui recrute dans la région."],
    },
    {
      messages: ["Ne reviens pas… euh… ordre du chef."],

      dependingOn: ["fourth_act_begin"],
    },
  ],
  blueWorker2: [
    {
      messages: ["J’ai cru entendre que le chef ici est un bel orateur."],
    },
    {
      messages: ["T’as pas laissé un bon souvenir à l’usine."],
      dependingOn: ["fourth_act_begin"],
    },
  ],
  blueWorkerChief: [
    {
      messages: [
        "Ici euh… chez Tri-Force, on recycle les déchets.",
        "Et on en fait euh… d’autres équipements.",
        "Alors oui, on utilise… l’eau de la rivière.",
        "Mais tout ça est euh… contrôlé et raisonné à 100%.",
        "Alors… ça vous dit de… tester une journée de travail ?",
        "Ça nous arrange d’avoir… des femmes.",
        "Vu qu’on vous paie moins… euh… oubliez ça.",
        "Suivez-moi !",
      ],
      unlockEvents: ["recycling_start"],
    },
  ],
  factory: [
    {
      messages: [
        isMobileOrTablet()
          ? "Installe-toi…\n(touche pour continuer)"
          : "Installe-toi…\n(espace pour continuer)",
        "Comme tu es nouvelle, je te mets sur un poste simple…",
        "Tu dois monter les composants sur les cartes…",
        "Puis les nettoyer à l’eau pour éliminer les impuretés…",
        "Et faire ça le plus vite possible…",
        "Les clients n’attendent pas !",
        isMobileOrTablet()
          ? "Bouge les composants en appuyant à gauche ou à droite."
          : "Bouge les composants avec les flèches ← →",
        isMobileOrTablet()
          ? "Et valide le composant en appuyant au centre."
          : "Et valide le composant avec la barre ESPACE",
        "C’est parti !",
      ],
      unlockEvents: ["factory_tuto_begin"],
    },
    {
      messages: [
        "Tête de linotte !",
        "Tu n’as pas compris comment ça fonctionne ?",
        "Tu dois monter les composants sur les cartes…",
        isMobileOrTablet()
          ? "Bouge les composants en appuyant à gauche ou à droite."
          : "Bouge les composants avec les flèches ← →",
        isMobileOrTablet()
          ? "Et valide le composant en appuyant au centre."
          : "Et valide le composant avec la barre ESPACE",
        "C’est à la portée du premier venu !",
      ],
      dependingOn: ["factory_tuto_missed"],
      unlockEvents: ["factory_tuto_begin"],
    },
    {
      messages: [
        "Tu sembles avoir compris comment ça fonctionne…",
        "Passons aux choses sérieuses !",
      ],
      dependingOn: ["factory_tuto_end"],
      unlockEvents: ["factory_show_score_board"],
    },
    {
      messages: [
        "Si tu rates l’assemblage, une croix s’allumera.",
        "Au bout de trois croix…",
        "je viendrai moi-même t’accompagner à la sortie !",
        "As-tu d’autres questions ???",
        "Tu dis que l’eau utilisé assèche la rivière ?",
        "Et qu’est-ce que ça peut me faire ?",
        "Tout le monde sera bien content…",
        "d’avoir des téléphones derniers cris !",
        "Arrête de te poser des questions et au boulot.",
      ],
      dependingOn: ["factory_show_score_board"],
      unlockEvents: ["factory_after_tuto"],
    },
    {
      messages: [
        "C’est bien ce qu’il me semblait…",
        "tu ne peux pas tenir un rythme aussi soutenu !",
        "On arrête les frais pour aujourd’hui.",
        "Allez… Rentre chez toi !",
      ],
      dependingOn: ["factory_game_over"],
      unlockEvents: ["factory_end"],
    },
  ],
  recyclingCentre: [
    {
      messages: [
        isMobileOrTablet()
          ? "Voilà votre poste…\n(touche pour continuer)"
          : "Voilà votre poste…\n(espace pour continuer)",
        "Des déchets tombent… de la trappe en haut.",
        "Vous devez les réceptionner… avec le chariot en bas.",
        isMobileOrTablet()
          ? "Bougez le chariot en appuyant à gauche ou à droite."
          : "Bougez le chariot avec les flèches ← →",
        isMobileOrTablet()
          ? "Et changez son mode en appuyant en haut ou en bas."
          : "Et changez son mode avec les flèches ↑ ↓",
        "Il faut détruire le déchet avec euh… le bon mode.",
        "Faisons un test.",
      ],
      unlockEvents: ["recycling_tuto_begin"],
    },
    {
      messages: [
        "Euh… je vais vous faire un petit rappel, pas le choix.",
        isMobileOrTablet()
          ? "Bougez le chariot en appuyant à gauche ou à droite."
          : "Bougez le chariot avec les flèches ← →",
        isMobileOrTablet()
          ? "Et changez son mode en appuyant en haut ou en bas."
          : "Et changez son mode avec les flèches ↑ ↓",
        "Le mode doit correspondre au déchet qui tombe !",
        "Allez, c’est euh… reparti.",
      ],
      dependingOn: ["recycling_tuto_missed"],
      unlockEvents: ["recycling_tuto_begin"],
    },
    {
      messages: [
        "Bon euh… ça suffira. Ne perdons pas plus de temps.",
        "On va vous tester pour de vrai.",
      ],
      dependingOn: ["recycling_tuto_end"],
      unlockEvents: ["recycling_show_score_board"],
    },
    {
      messages: [
        "Ça, c’est le panneau d’erreurs.",
        "Si vous ratez plusieurs déchets… une croix s’allume.",
        "Au bout de trois croix euh… j’arrête votre journée.",
        "Je le répète, c’est très important ce qu’on fait ici.",
        "On démantèle et on recycle les équipements.",
        "On est pour ainsi dire euh… super écolo.",
        "Toute l’eau qu’on pollue et gaspille…",
        "C’est pour un bien encore plus grand.",
        "Allez euh… au boulot !",
      ],
      dependingOn: ["recycling_show_score_board"],
      unlockEvents: ["recycling_after_tuto"],
    },
    {
      messages: [
        "Bon euh… c’est fini pour aujourd’hui.",
        "Il faudra être plus performante pour…",
        "sauver la planète !",
      ],
      dependingOn: ["recycling_game_over"],
      unlockEvents: ["recycling_end"],
    },
  ],
  dcWorkerChief: [
    {
      messages: [
        "Pour développer l’IA…",
        "On construit un datacenter près de la rivière…",
        "Son eau refroidira les serveurs, c’pas super !?",
        "Si ça te gêne, dégage ! Et laisse nous bosser.",
      ],
      repeat: ["On construit un datacenter, ça te gène ?"],
    },
  ],
  minerZad1: [
    {
      messages: [
        "Comment tu nous as trouvé ?",
        "Nous étions des ouvriers et avons déserté la mine…",
        "… nous avons abandonné notre travail…",
        "… et avons créé cette petite communauté…",
        "… une sorte de ZAD, une Zone à Défendre…",
        "… où l’on plante nos légumes…",
        "… et on essaye de construire un monde plus sobre.",
      ],
      repeat: ["Ici, on envisage un mode de vie plus sobre."],
    },
  ],
  minerZad2: [
    {
      messages: [
        "Nous sommes plusieurs anciens ouvriers à vivre ici.",
        "Aucun regret sur ce choix de vie.",
        "Cependant, on vit cachés dans la forêt…",
        "C’est comme le marronnage au temps de l’esclavage…",
        "où les nègres-marrons fuyaient leur condition…",
        "en se réfugiant dans les bois ou dans les montagnes.",
      ],
      repeat: ["On est obligé de vivre cachés dans la forêt."],
    },
  ],
};

const uiMessages = {
  "game.howToPlay": "Déplace-toi avec les flèches ← → ↑ ↓ ou ZQSD",

  "mine.faster": "Plus vite !",
  "mine.fasterAgain": "Encore plus vite, allez !!!",
  "mine.waterEmpty": "Réservoir d’eau vide !",
  "mine.waterFull": "Réservoir d’eau plein !",
  "mine.moreMaterials": "Arrivage de minerais, on augmente la fréquence !",
  "mine.warning": "Ressaisis-toi, on est là pour faire du chiffre !",
  "mine.lastWarning": "Dernier avertissement, concentre-toi !",

  "factory.faster": "Validé ! Plus vite maintenant !!!",
  "factory.welldone": "C’est bien, tu es productive !",
  "factory.error": "C’est quoi ce boulot ? Ressaisis-toi la nouvelle !",

  "recycling.faster": "Allez, on augmente le rythme !",
  "recycling.error": "Euh… il va falloir faire mieux que ça !",

  "betweenActs.later": "Quelque temps plus tard…",
  "final.later": "Quelque temps plus tard…",
};

const getUiMessage = (name) => uiMessages[name];

export { spriteNames, messageWorkflow, getUiMessage };
