import isMobileOrTablet from "../Utils/isMobileOrTablet";
import { getLocale } from "../Utils/locale";

const spriteNames = {
  django: "Django",
  bino: "Bino",
  fisherman: { fr: "Mino, le pêcheur", en: "Mino, the fisherman" },
  cat: { fr: "Le chat", en: "The cat" },
  dog: { fr: "Le chien", en: "The dog" },
  cow: { fr: "La vache", en: "The cow" },
  boy: { fr: "Les enfants", en: "The children" },
  girl: { fr: "La petite fille", en: "The little girl" },
  koko: "Koko",
  nono: "Nono",
  escargot: { fr: "L’escargot", en: "The snail" },
  baby: { fr: "Le bébé", en: "The baby" },
  twoWomen: { fr: "Les deux femmes", en: "The two women" },
  twoGuys: { fr: "Les deux hommes", en: "The two men" },
  miner: { fr: "L’ouvrier", en: "The worker" },
  dcWorkerChief: { fr: "L’ouvrier chef", en: "The foreman" },
  whiteWorkerChief: { fr: "L’ouvrier chef", en: "The foreman" },
  minerChief: { fr: "L’ouvrier chef", en: "The foreman" },
  blueWorkerChief: { fr: "L’ouvrier chef", en: "The foreman" },
  blueWorker1: { fr: "L’ouvrier", en: "The worker" },
  blueWorker2: { fr: "L’ouvrier", en: "The worker" },
  minerDirty2: { fr: "L’ouvrier", en: "The worker" },
  minerDirty3: { fr: "L’ouvrier", en: "The worker" },
  minerDirty4: { fr: "L’ouvrier", en: "The worker" },
  whiteWorker1: { fr: "L’ouvrier", en: "The worker" },
  whiteWorker2: { fr: "L’ouvrier", en: "The worker" },
  sleepingGuy: { fr: "L’homme couché", en: "The man lying down" },
  minerZad1: { fr: "L’ouvrier déserteur", en: "The deserting worker" },
  minerZad2: { fr: "Le mineur déserteur", en: "the deserting mine worker" },
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
      messages: {
        fr: [
          "Hey, salut toi ! Moi je m’appelle Bino !",
          "Fais attention à ne pas marcher sur mes carottes.",
        ],
        en: [
          "Hey, hello there! My name is Bino!",
          "Be careful not to step on my carrots.",
        ],
      },
      repeat: {
        fr: ["Fais attention à ne pas marcher sur mes carottes."],
        en: ["Be careful not to step on my carrots."],
      },
    },
    {
      messages: {
        fr: [
          "Hey ! Tu es juste de passage ?",
          "Ou bien là pour enquêter sur ce qui se trame ?",
          "Plus au nord d’ici, il y a une personne louche…",
          "(J’espère que cela n’impactera pas mon potager…)",
        ],
        en: [
          "Hey! Are you just passing through?",
          "Or are you here to investigate what’s going on?",
          "North of here, there’s a suspicious person…",
          "(I hope this won’t affect my vegetable garden…)",
        ],
      },
      repeat: {
        fr: [
          "Plus au nord d’ici, il y a une personne louche…",
          "(Je me demande bien ce qui se passe…)",
        ],
        en: [
          "North of here, there’s a suspicious person…",
          "(I wonder what’s going on…)",
        ],
      },
      dependingOn: ["django_met"],
    },
    {
      messages: {
        fr: [
          "Je travaille, mais j’ai pas trop la tête à ça…",
          "Je suis très inquiet à cause de la rivière polluée.",
          "Peut-être qu’en remontant à la source…",
          "on trouverait la cause du problème ?",
          "Mais je suis bien trop occupé là…",
        ],
        en: [
          "I’m working, but I’m not really in the mood for it…",
          "I’m very worried about the polluted river.",
          "Maybe if we went back to the source…",
          "we could find the cause of the problem?",
          "But I’m far too busy right now…",
        ],
      },
      repeat: {
        fr: ["(Si seulement quelqu’un pouvait remonter la rivière…)"],
        en: ["(If only someone could go up the river…)"],
      },
      dependingOn: ["first_sleep"],
    },
    {
      messages: {
        fr: [
          "Hey Maï, tout roule pour toi ?",
          "Comme tu peux le voir, mon potager a disparu.",
          "À la place je désherbe le bord des routes.",
          "Mais ne crois pas que je sois triste !",
          "On peut accéder à tellement plus de denrées alimentaires",
          "grâce à nos voitures et à ces nouvelles routes !",
          "C’est un gros changement…",
        ],
        en: [
          "Hey Maï, everything okay?",
          "As you can see, my vegetable garden has disappeared.",
          "Instead, I'm weeding the roadsides.",
          "But don't think I'm sad!",
          "We have access to so much more food",
          "thanks to our cars and these new roads!",
          "It's a big change...",
        ],
      },
      repeat: {
        fr: ["(Allez, ça ne va pas se désherber tout seul…)"],
        en: ["(Come on, it's not going to weed itself...)"],
      },
      dependingOn: ["second_act_begin"],
    },
    {
      messages: {
        fr: [
          "Hey Maï, ça roule ?",
          "Moi, ras-le-bol de désherber le bord des routes !",
          "J’ai vu sur FaceBouc que Django partait en voyage…",
          "J’aimerais bien partir avec lui !",
        ],
        en: [
          "Hey Maï, how's it going?",
          "I'm sick and tired of weeding the roadsides!",
          "I saw on Fotobook that Django is going on a trip...",
          "I'd love to go with him!",
        ],
      },
      repeat: {
        fr: ["(Il faut que j’aille voir Django pour ce voyage…)"],
        en: ["(I need to see Django about this trip...)"],
      },
      dependingOn: ["third_act_begin"],
    },
    {
      messages: {
        fr: ["Je n’arrive plus à faire pousser de légumes…"],
        en: ["I can no longer grow vegetables..."],
      },
      dependingOn: ["fourth_act_begin"],
    },
    {
      messages: {
        fr: [
          "J’ai répondu à l’appel de Koko et Django…",
          "Mais peux pas m’empêcher de désherber partout…",
        ],
        en: [
          "I responded to Koko and Django's proposal to protest...",
          "But I can't help weeding everywhere...",
        ],
      },
      dependingOn: ["strike_begin"],
    },
    {
      messages: {
        fr: ["Attendez… Je prends les tomates !"],
        en: ["Wait... I'll take the tomatoes!"],
      },
      dependingOn: ["django_final_end"],
      unlockEvents: ["game_over"],
    },
  ],
  twoGuys: [
    {
      messages: {
        fr: [
          "- Il faudrait qu’on aide Bino au potager.",
          "- Oui, oui, mais d’abord laisse-moi paresser un peu !",
          "- Tu as raison, reposons-nous, le travail peut attendre.",
        ],
        en: [
          "- We should help Bino in the vegetable garden.",
          "- Yes, yes, but first let me laze around a bit!",
          "- You're right, let's rest, the work can wait.",
        ],
      },
      repeat: {
        fr: ["Il faudrait qu’on aide Bino au potager…"],
        en: ["We should help Bino in the vegetable garden..."],
      },
    },
    {
      messages: {
        fr: [
          "- Bino est dans tous ses états à cause de la rivière.",
          "- Viens, on va le soutenir.",
          "- Tranquille, faisons une pause avant d’aller le voir.",
        ],
        en: [
          "- Bino is really upset about the river.",
          "- Come on, let's go support him.",
          "- Relax, let's take a break before we go see him.",
        ],
      },
      repeat: {
        fr: ["Bino est dans tous ses états à cause de la rivière."],
        en: ["Bino is really upset about the river."],
      },
      dependingOn: ["first_sleep"],
    },
    {
      messages: {
        fr: [
          "- Que c’est pratique ces nouvelles routes !",
          "- Tu l’as dit, j’ai rangé mon vieux vélo.",
          "- Le hic, c’est l’éternité qu’il faut…",
          "pour payer ma nouvelle automobile.",
        ],
        en: [
          "These new roads are so convenient!",
          "You said it. I've put my old bicycle away.",
          "The only problem is that it'll take me forever...",
          "...to pay off my new car.",
        ],
      },
      repeat: {
        fr: ["Que c’est pratique ces nouvelles routes !"],
        en: ["These new roads are so convenient!"],
      },
      dependingOn: ["second_act_begin"],
    },
    {
      messages: {
        fr: [
          "- J’ai écrit un poème, écoute :",
          "Plus d’usines que de maisons",
          "Plus de mines que de raison",
          "- La nouvelle usine à l’ouest t’inspire ?",
          "- Elle m’inspire ce poème oui, de la confiance non.",
        ],
        en: [
          "- I wrote a poem, listen:",
          "More factories than houses",
          "More mines than sense",
          "- Does the new factory in the west inspire you?",
          "- It inspires this poem, yes, but not confidence.",
        ],
      },
      repeat: {
        fr: ["L’usine à l’ouest n’inspire pas confiance."],
        en: ["The factory in the west does not inspire confidence."],
      },
      dependingOn: ["third_act_begin"],
    },
    {
      messages: {
        fr: [
          "- (Il parait qu’on peut arrêter les publicités).",
          "- (Les écrans de publicité ? Mais comment ?)",
          "- (Moins fort ! Il faudrait demander à Koko)",
        ],
        en: [
          "- (Apparently you can stop the adverts).",
          "- (The advert screens? But how?)",
          "- (Quiet! We should ask Koko)",
        ],
      },
      repeat: {
        fr: ["(Koko a un secret au sujet des écrans…)"],
        en: ["(Koko has a secret about these screens...)"],
      },
      dependingOn: ["fourth_act_begin"],
    },
    {
      messages: {
        fr: [
          "- Avoue, c’est ta première manif’ ?",
          "- Mais pas du tout… j’ai fait les marches pour le climat !",
        ],
        en: [
          "- Admit it, this is your first protest, isn't it?",
          "- Not at all... I protested for the climate!",
        ],
      },
      dependingOn: ["strike_begin"],
    },
    {
      messages: {
        fr: [
          "- Salut Maï, tu es attendue près de chez Bino.",
          "- Si tu as oublié où il habite, c’est à l’est.",
        ],
        en: [
          "- Hi Maï, they're waiting for you near Bino's house.",
          "- If you've forgotten where he lives, it's to the east.",
        ],
      },
      repeat: {
        fr: ["Tu es attendue près de chez Bino, à l'est."],
        en: ["You are expected near Bino's place, to the east."],
      },
      dependingOn: ["strike_end"],
    },
  ],
  twoWomen: [
    {
      messages: {
        fr: [
          "- Notre amie Koko sait vraiment tout sur tout.",
          "- C’est vrai, on peut compter sur elle.",
          "- Et que dire de Django…",
          "- Tu as raison, pas le dernier à rendre service !",
        ],
        en: [
          "- Our friend Koko really knows everything about everything.",
          "- That's true, we can count on her.",
          "- And what about Django...",
          "- You're right, he's always ready to help!",
        ],
      },
      repeat: {
        fr: ["Django est toujours prêt à aider !"],
        en: ["Django is always ready to help!"],
      },
    },
    {
      messages: {
        fr: [
          "- Koko m’a dit que Nono est revenu du travail…",
          "- Oui mais pas en entier, le pauvre !",
          "- Il faudrait qu’on aille le voir.",
        ],
        en: [
          "- Koko told me that Nono came back from work...",
          "- Yes, but not entirely, poor thing!",
          "- We should go see him.",
        ],
      },
      repeat: {
        fr: ["Il faudrait qu’on aille voir Nono."],
        en: ["We should go see Nono."],
      },
      dependingOn: ["first_sleep"],
    },
    {
      messages: {
        fr: [
          "- Tu as vu le nouveau smartphone ?",
          "- Il a quoi de nouveau ?",
          "- Il se transforme en drone",
          "pour nous filmer ou nous photographier…",
          "sous tous les angles !",
          "Plus besoin de perche à selfie !",
        ],
        en: [
          "- Have you seen the new smartphone?",
          "- What's new about it?",
          "- It turns into a drone,",
          "to film or photograph us...",
          "from every angle!",
          "No more need for a selfie stick!",
        ],
      },
      repeat: {
        fr: ["Le dernier smartphone donne envie !"],
        en: ["The latest smartphone is tempting!"],
      },
      dependingOn: ["third_act_begin"],
    },
    {
      messages: {
        fr: [
          "- Il faut désarmer ces industries polluantes…",
          "- Je te sens rebelle, c’est Maï qui t’inspire ?",
        ],
        en: [
          "- We must disarm these polluting industries...",
          "- I sense you're feeling rebellious.",
          "Is it Maï who's inspiring you?",
        ],
      },
      dependingOn: ["strike_begin"],
    },
    {
      messages: {
        fr: [
          "- Salut Maï, ça fait un bail !",
          "- Tu es attendue près du potager de chez Bino.",
        ],
        en: [
          "- Hi Maï, it's been a while!",
          "- They're waiting for you near Bino's vegetable garden.",
        ],
      },
      repeat: {
        fr: ["Tu es attendue près du potager de chez Bino."],
        en: ["They're waiting for you near Bino's vegetable garden."],
      },
      dependingOn: ["strike_end"],
    },
  ],
  baby: [
    {
      messages: {
        fr: ["Pa-pi-lion, pa-pi-lion…"],
        en: ["But-ter-fly, but-ter-fly…"],
      },
    },
    {
      messages: {
        fr: ["téyé-phone, téyé-phone…"],
        en: ["smart-phone, smart-phone…"],
      },
      dependingOn: ["third_act_begin"],
    },
    {
      messages: {
        fr: ["Ca-mion…"],
        en: ["A lor-ry…"],
      },
      dependingOn: ["fourth_act_begin"],
    },
  ],
  sleepingGuy: [
    {
      messages: {
        fr: ["ZZZzzz, mmmh ?"],
        en: ["ZZZzzz, mmmh ?"],
      },
    },
  ],
  koko: [
    {
      messages: {
        fr: [
          "Oh bah, v’là donc une nouvelle arrivante…",
          "Bienvenue au village de Trois-Rivières !",
          "Ça fait plaisir d’voir une nouvelle tête.",
          "Moi c’est Koko.",
          "J’suis au courant de tout c’qui s’passe dans l’coin !",
          "… Maï ? Un prénom pas banal dis donc !",
          "J’suis sûre que notre patelin va te plaire.",
          "Va donc y faire un tour !",
          "Et si tu cherches un endroit où dormir…",
          "Django t’accueillera sûrement, il est plus au sud.",
        ],
        en: [
          "Oh well now, look at that… a new face comin’ in.",
          "Welcome to the village of Trois-Rivières!",
          "Nice seein’ a new face ’round here.",
          "Name’s Koko.",
          "I’m up to date on everythin’ that’s happenin’ here!",
          "… Maï? Now that’s not a common name, is it!",
          "I’m sure you’re gonna like our little town.",
          "Go on, take a look ’round!",
          "And if you’re lookin’ for a place to sleep…",
          "Django’ll certainly take you in, he’s further south.",
        ],
      },
      repeat: {
        fr: [
          "Maï, si t’as fini d’visiter tout le village…",
          "va donc vers le sud pour trouver où dormir.",
        ],
        en: [
          "Maï, if you’ve finished visiting the whole village…",
          "head south to find somewhere to sleep.",
        ],
      },
    },
    {
      messages: {
        fr: [
          "Tu as rencontré Django ?",
          "C’est la personne la plus gentille que j’connaisse.",
          "Tu devrais aller voir ce qui se trame à l’est…",
          "Il parait qu’une personne louche bloque le pont…",
        ],
        en: [
          "You met Django?",
          "He’s the kindest person I know, I’m tellin’ ya.",
          "Ya should go check out what’s goin’ on out east…",
          "Heard there’s some shady person blockin’ the bridge…",
        ],
      },
      repeat: {
        fr: [
          "Tu devrais aller voir ce qui se trame à l’est…",
          "Une personne louche bloque le pont…",
        ],
        en: [
          "You should go see what’s going on in the east…",
          "Some shady character is blocking the bridge…",
        ],
      },
      dependingOn: ["django_met"],
    },
    {
      messages: {
        fr: [
          "Olala, olala… t’as vu ça Maï ?",
          "C’est terrible c’qui arrive à notre rivière !",
          "Un truc louche se trame vers l’est, j’te l’dis !",
          "Nono, qu’habite plus au nord, en revient justement.",
          "Il est mal-en-point, comme la rivière…",
          "peut-être qu’il pourra t’en dire plus !",
        ],
        en: [
          "Oh dear, oh dear… ya see that, Maï?",
          "It’s terrible what’s happenin’ to our river!",
          "Somethin’ shady’s going on out east, I’m tellin’ ya!",
          "Nono, who lives further north, has just come back.",
          "He’s in bad shape, just like the river…",
          "Maybe he’ll be able to tell ya more!",
        ],
      },
      repeat: {
        fr: ["Au nord, Nono pourra t’éclairer sur c’qui s’passe !"],
        en: ["Up north, Nono can fill you in on what’s going on!"],
      },
      dependingOn: ["first_sleep"],
    },
    {
      messages: {
        fr: [
          "Je vois que tu as le badge de Nono…",
          "Fais attention à toi, Maï !",
        ],
        en: ["I see you've got Nono's badge...", "Take care, Maï!"],
      },
      dependingOn: ["card_for_mine"],
    },
    {
      messages: {
        fr: [
          "Maï, c’est incroyable tu trouves pas ?",
          "Le génie humain j’veux dire.",
          "Pour trois fois moins de temps,",
          "j’peux aller voir ma famille, mes amies !",
          "Moi qui ADORE être au courant de tout,",
          "ça va grandement faciliter les potins héhé.",
          "D’ailleurs t’sais pas la dernière ?",
          "Une autre usine s’est installée au nord.",
          "Ça pousse comme des champignons ces choses là !",
        ],
        en: [
          "Mai, it’s incredible, don’t ya think?",
          "Human genius, I mean.",
          "In three times less time,",
          "I can go see my family, my friends!",
          "And me, who LOVES knowin’ everything,",
          "this is gonna make gossipin’ soooo much easier, hehe.",
          "Oh! And ya haven’t heard the latest, have ya?",
          "Another factory set up north.",
          "These things pop up like mushrooms!",
        ],
      },
      repeat: {
        fr: [
          "Tu d’vrais aller voir cette usine au nord",
          "p’têtre que t’y trouveras encore du travail !",
        ],
        en: [
          "Ya should go check out that factory up north",
          "maybe you’ll find some work there!",
        ],
      },
      dependingOn: ["second_act_begin"],
    },
    {
      messages: {
        fr: [
          "B’jour Maï ! Dis-moi…",
          "Tu peux m’aider à choisir un nouveau smartphone ?",
          "Le mien est déjà trop lent…",
          "C’est vraiment pratique pour être au courant de tout !",
          "D’ailleurs une nouvelle usine a ouvert à l’ouest.",
        ],
        en: [
          "Mornin’, Mai! Tell me…",
          "Think ya could help me pick a new smartphone?",
          "Mine’s already way too slow…",
          "It’s real handy for stayin’ up-to-date on everything!",
          "Oh, and a new factory opened out west.",
        ],
      },
      repeat: {
        fr: ["Tu vas aller voir cette nouvelle usine à l’ouest ?"],
        en: ["Ya gonna go check out that new factory out west?"],
      },
      dependingOn: ["third_act_begin"],
    },
    {
      messages: [
        "Maï…",
        "J’avais tellement la tête plongée dans les écrans…",
        "Que j’n’ai pas remarqué l’état de nos rivières !",
        "Qu’les oiseaux et les papillons ont disparu !",
        "QUOI ? Tu dis qu’il faut se mobiliser ?",
        "C’est une bonne idée !",
        "J’vais réunir les troupes.",
        "En attendant, t’pourrais faire une action d’éclat.",
        "Oh, je sais : éteindre les panneaux de pub !",
        "Les enfants m’ont dit qu’on pouvait les éteindre…",
        "en passant par derrière !",
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
        "T’as réussi à éteindre un écran pub ?",
        "C’pas bien… et… c’est bien, à la fois !",
        "Si j’étais toi… J’en éteindrais d’autres !",
      ],
      repeat: ["Pourquoi ne pas éteindre d’autres écrans ?"],
      dependingOn: ["screens_shutdown_first"],
    },
    {
      messages: [
        "Merci Maï pour tout c’que t’as fait.",
        "Grâce à toi, tous les villageois…",
        "S’retrouvent pour une cause commune…",
        "L’avenir de notre village !",
      ],
      repeat: ["Merci encore, Maï."],
      dependingOn: ["strike_begin"],
    },
  ],
  nono: [
    {
      messages: [
        "C’est donc toi Maï ?",
        "Ton arrivée dans le village ne passe pas inaperçue.",
        "Comme tu peux le constater dans mon fauteuil roulant…",
        "tu ne me vois pas au meilleur de ma forme !",
        "À l’est, une mine vient de s’installer.",
        "J’ai tenté d’y travailler mais…",
        "il m’est arrivé un accident malencontreux.",
        "Il faut dire qu’on n’est pas très bien protégé.",
        "Et le rythme de travail y est extrêmement soutenu !",
        "Bref. Je te dirais bien d’en prendre garde mais…",
        "Je vois dans ton regard que tu es déterminée à y aller.",
      ],
      unlockEvents: ["pre_card_for_mine"],
    },
    {
      messages: [
        "Prends mon laissez-passer, je n’en ai plus besoin.",
        "Mais promets moi de faire bien attention à toi !",
      ],
      repeat: ["Fais bon usage de mon badge… et sois prudente."],
      dependingOn: ["pre_card_for_mine"],
      unlockEvents: ["card_for_mine"],
    },
    {
      messages: [
        "La situation de nos rivières est perturbante,",
        "mais je dois bien avouer que ces nouvelles routes…",
        "facilitent énormément mes déplacements !",
        "Et quand j’irai mieux…",
        "… je postulerai à la nouvelle usine au nord d’ici.",
      ],
      repeat: ["Je pense postuler à l’usine au nord d’ici…"],
      dependingOn: ["second_act_begin"],
    },
    {
      messages: [
        "C’est assez formidable n’est-ce pas ?",
        "Ce confort, et l’accès à tout le savoir je veux dire.",
        "Il faut bien sûr réussir à bien s’informer…",
        "Heureusement, je sais démêler le vrai du faux !",
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
      messages: {
        fr: [
          "Ooola, quel bon vent nous amène là !",
          "… Maï ? Quel joli prénom.",
          "Et donc tu cherches un lieu où dormir cette nuit ?",
          "Tu frappes à la bonne porte !",
          "Comme je le dis souvent, il faut qu’une porte…",
          "soit ouverte ou fermée…",
          "et la mienne sera toujours ouverte !",
          "Donc reviens au coucher du soleil !",
        ],
        en: [
          "Hey, what brings you here?",
          "… Maï? What a pretty name.",
          "So you’re looking for a place to sleep tonight?",
          "You’ve come to the right place!",
          "As I often say, a door must either be…",
          "open or closed…",
          "and mine will always be open!",
          "So come back at sunset!",
        ],
      },
      repeat: {
        fr: ["Fais un tour du village et reviens ce soir."],
        en: ["Take a walk around and come back this evening."],
      },
      unlockEvents: ["django_met"],
    },
    {
      messages: [
        "Aah, tu es revenue ! Comme disait ma grand-mère…",
        "un bon arbre peut loger dix mille oiseaux.",
        "Allez, entre !",
      ],
      dependingOn: ["miner_first_met"],
      unlockEvents: ["pre_first_sleep"],
    },
    {
      messages: [
        "Bien dormi, Maï ?",
        "Je suis désolé de te l’apprendre au réveil mais…",
        "quelque chose de terrible est arrivé au village !",
        "Vois par toi-même, je reste ici me calmer l’esprit.",
      ],
      repeat: ["Ooh pauvre rivière, laisse moi te jouer une prière."],
      dependingOn: ["first_sleep"],
      unlockEvents: ["first_sleep_save"],
    },
    {
      messages: [
        "Bien dormi Maï ?",
        "Après toutes ces semaines d’efforts à la mine,",
        "je tenais à te remercier.",
        "Grâce à toi, on a la confirmation",
        "que les eaux usées de la mine sont bien responsables",
        "de la pollution de la rivière.",
        "Mais dans le même temps, le village a pu se moderniser.",
        "Je dois avouer être un peu partagé.",
        "Est-ce un mal pour un bien ?",
        "Je n’ai pas la réponse",
        "et je ne voudrais pas t’influencer.",
        "Maintenant que tu as fini ton travail à la mine,",
        "tu as tout le temps de te balader dans le village.",
        "Si tu croises Koko, tu la salueras pour moi.",
      ],
      repeat: [
        "Une chose reste immuable dans tout ce bouleversement",
        "ce sont les 6 cordes de ma guitare.",
      ],
      dependingOn: ["second_act_begin"],
      unlockEvents: ["second_act_save"],
    },
    {
      messages: [
        "Bonjour Maï, le sommeil a été un peu agité ?",
        "Ah ! Tu arrêtes de travailler à l’usine ?",
        "C’est bien de savoir que l’usine est responsable…",
        "de la baisse du niveau d’eau dans nos rivières.",
        "Le mal est fait, on n’arrête pas le progrès…",
        "On a besoin de produire des équipements numériques",
        "même si cela consomme beaucoup d’eau.",
        "Je partirais bien loin de ces problèmes…",
        "Un voyage, c’est ça qu’il me faut !",
      ],
      repeat: ["J’ai envie de voyager, partir loin…"],
      dependingOn: ["third_act_begin"],
      unlockEvents: ["third_act_save"],
    },
    {
      messages: [
        "Salut Maï !",
        "L’usine de recyclage pompe l’eau de la rivière ?",
        "Grâce à l’eau, les matières recyclées sont séparées ?",
        "La conséquence sur nos rivières reste préoccupante.",
        "Et ça continue, vois le chantier près de chez moi.",
        "Je ne sais pas ce qui se passe encore…",
      ],
      repeat: ["Un chantier au milieu de notre village…"],
      dependingOn: ["fourth_act_begin"],
      unlockEvents: ["fourth_act_save"],
    },
    {
      messages: [
        "Tu as raison, Maï…",
        "On ne peut plus laisser toutes ces industries…",
        "détruire notre village…",
        "pomper et polluer nos rivières…",
        "Quand on l’attaque, le village contre-attaque.",
        "Je suis partant pour une mobilisation générale !",
        "J’amène ma guitare et j’arrive.",
      ],
      dependingOn: ["screens_shutdown_end"],
      unlockEvents: ["django_ready_for_strike"],
    },
    {
      messages: [
        "Habitants et habitantes de Trois-Rivières !",
        "Vous savez ce qui se passe dans notre village.",
        "Nos ressources et nos rivières ont été accaparées…",
        "Par des industries destructrices et polluantes.",
        "Aujourd’hui nous leur disons stop !",
        "Comme le disait ma grand-mère…",
        "On peut couper nos branches mais pas nos racines.",
        "La défense de notre village ne fait que commencer !",
      ],
      dependingOn: ["strike_begin"],
      unlockEvents: ["strike_end"],
    },
    {
      messages: [
        "Salut Maï ! Ça fait plaisir de te revoir !",
        "T’as vu le village ?",
        "La nature a repris ses droits, et nous nos esprits.",
        "Il faut dire qu’il n’y avait plus rien à exploiter ici.",
        "Les industriels sont ainsi partis voir ailleurs…",
        "Et les oiseaux sont revenus.",
        "Presque tous… c’est toujours mieux qu’aucun.",
        "Allez, viens. On t’attendait pour pique-niquer !",
      ],
      dependingOn: ["django_final"],
      unlockEvents: ["django_final_end"],
    },
  ],
  fisherman: [
    {
      messages: {
        fr: [
          "…chut, tu vas faire fuir les poissons…",
          "Et voilà, raté… Va parler aux autres, je suis concentré là.",
        ],
        en: ["…"],
      },
      repeat: { fr: ["…"], en: ["…"] },
    },
    {
      messages: {
        fr: [
          "Par la barbe du %?#%, je ne vais plus pouvoir pêcher.",
          "Qui sont les responsables de ce #?%@ ???",
        ],
        en: [
          "%?#%, I won’t be able to fish anymore.",
          "Who’s responsible for this #?%@???",
        ],
      },
      repeat: {
        fr: ["Si j’attrape les responsables de ce #?%@…"],
        en: ["If I catch those responsible for this #?%@…"],
      },
      dependingOn: ["first_sleep"],
    },
    {
      messages: {
        fr: [
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
        en: [
          "… Everyone has become a fan,",
          "of these roads, these cars…",
          "It’s easy to forget where we come from.",
          "A mine is built, then a factory…",
          "The river has dropped in level,",
          "in just a few weeks.",
          "I feel a bit helpless in the face of all this…",
          "But it comforts me that you’re continuing…",
          "to conduct your little investigation, Maï.",
        ],
      },
      repeat: {
        fr: ["Continue ton enquête, moi je surveille la rivière."],
        en: ["Continue your investigation, I’ll keep an eye on the river."],
      },
      dependingOn: ["second_act_begin"],
    },
    {
      messages: {
        fr: [
          "Ce que je craignais est arrivé.",
          "Trois-Rivières a complètement changé…",
          "et nos habitudes avec.",
          "Heureusement moi, je tiens bon la barre !",
          "(Attendre ici me donne faim par contre…)",
          "(Je mangerais bien un bon burger tiens !)",
        ],
        en: [
          "What I feared has happened.",
          "Trois-Rivières has completely changed…",
          "and so have our habits.",
          "Fortunately, I’m holding steady!",
          "(Waiting here is making me hungry, though…)",
          "(I could really go for a good burger right now!)",
        ],
      },
      repeat: {
        fr: ["(Burger… burger…) hmmmmm, je disais quoi déjà ?"],
        en: ["(Burger… burger…) Hmmmmm, what was I saying?"],
      },
      dependingOn: ["third_act_begin"],
    },
    {
      messages: {
        fr: ["Tout part à la dérive, comme mon vieux bateau…"],
        en: ["Everything is drifting away, like my old boat…"],
      },
      dependingOn: ["fourth_act_begin"],
    },
    {
      messages: {
        fr: [
          "J’me demande bien comment on va se débarrasser…",
          "…de ces #?%@ qui polluent nos rivières !",
        ],
        en: [
          "I wonder how we’re going to get rid of…",
          "…these #?%@ polluting our rivers!",
        ],
      },
      dependingOn: ["strike_begin"],
    },
  ],
  boy: [
    {
      messages: {
        fr: [
          "YOUPIII, on peut se baigner quand on veut !",
          "Faudrait trop qu’on ramène nos potes un jour !",
        ],
        en: [
          "YAY, we can go swimming whenever we want!",
          "We really should bring our mates along one day!",
        ],
      },
    },
    {
      messages: {
        fr: [
          "Oh nooon, on ne peut plus jouer dans l’eau…",
          "Qu’est-ce qu’on va faire maintenant ?",
        ],
        en: [
          "Oh no, we can’t play in the river anymore…",
          "What are we going to do now?",
        ],
      },
      repeat: {
        fr: ["On ne peut plus jouer dans l’eau…"],
        en: ["we can’t play in the river anymore…"],
      },
      dependingOn: ["first_sleep"],
    },
    {
      messages: {
        fr: ["Y’a moins d’eau dans la rivière maintenant…"],
        en: ["Oh no, there’s less water in the river now…"],
      },
      dependingOn: ["second_act_begin"],
    },
    {
      messages: {
        fr: ["… Mmmmh, et si on mangeait un gros burger…"],
        en: ["Mmmm, how about we have a big burger…"],
      },
      dependingOn: ["third_act_begin"],
    },
    {
      messages: {
        fr: ["… Il est louche le monsieur là…"],
        en: ["… That man over there looks shady…"],
      },
      dependingOn: ["fourth_act_begin"],
    },
    {
      messages: {
        fr: ["C’est notre première manif, trop chouette !"],
        en: ["It’s our first protest, how exciting!"],
      },
      dependingOn: ["strike_begin"],
    },
  ],
  girl: [
    {
      messages: {
        fr: ["…"],
        en: ["…"],
      },
    },
    {
      messages: ["Y’a moins d’eau dans la rivière maintenant…"],
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
      messages: ["On devrait pas rester ici…"],
      dependingOn: ["fourth_act_begin"],
    },
    {
      messages: ["Tante Koko et oncle Django sont trop forts !"],
      dependingOn: ["strike_begin"],
    },
  ],
  cat: [
    {
      messages: {
        fr: ["Miaou…"],
        en: ["Meow…"],
      },
    },
  ],
  dog: [
    {
      messages: {
        fr: ["Wof…"],
        en: ["Woof…"],
      },
    },
  ],
  cow: [
    {
      messages: {
        fr: ["Meuh…"],
        en: ["Moo…"],
      },
    },
  ],
  veal: [
    {
      messages: {
        fr: ["Mmmmh…"],
        en: ["Mmmmh…"],
      },
    },
  ],
  escargot: [
    {
      messages: {
        fr: ["…"],
        en: ["…"],
      },
    },
  ],
  miner: [
    {
      messages: {
        fr: ["Interdit de passer par ici."],
        en: ["It is forbidden to pass through here."],
      },
      repeat: {
        fr: ["J’ai dit qu’on ne passe pas !"],
        en: ["I said no passing through!"],
      },
    },
    {
      messages: {
        fr: [
          "Hop hop hop… il est trop tard pour passer, désolé.",
          "Reviens demain.",
          "(Vivement que mon tour de garde se termine bientôt…)",
          "(j’ai des fourmis dans les jambes)",
        ],
        en: [
          "Stop! It’s too late to come in, sorry.",
          "Come back tomorrow.",
          "(I can’t wait for my shift to end…)",
          "(I’ve got ants in my pants.)",
        ],
      },
      repeat: {
        fr: ["Il est trop tard pour passer, reviens demain."],
        en: ["It’s too late to come in now, come back tomorrow."],
      },
      unlockEvents: ["miner_first_met"],
      dependingOn: ["django_met"],
    },
    {
      messages: {
        fr: [
          "Il faut un laissez-passer pour… passer.",
          "Nouvelle directive des chefs !",
        ],
        en: ["You need a pass to… pass.", "New directive from the bosses!"],
      },
      repeat: {
        fr: ["Je t’ai dit qu’il faut un laissez-passer…"],
        en: ["I told you that you need a pass…"],
      },
      dependingOn: ["first_sleep"],
    },
    {
      messages: {
        fr: [
          "Je ne sais pas comment tu as eu ce badge…",
          "mais te voilà donc libre de passer.",
          "D’toute façon, on a besoin de bras pour bosser…",
        ],
        en: [
          "I don’t know how you got that badge…",
          "but now you’re free to pass through.",
          "Anyway, we need workers…",
        ],
      },
      repeat: {
        fr: ["Tu peux passer…"],
        en: ["You can pass…"],
      },
      dependingOn: ["card_for_mine"],
      unlockEvents: ["mine_access_validation"],
    },
    {
      messages: {
        fr: [
          "Apparemment, ils n’ont plus besoin de nous…",
          "Pas autant en tout cas.",
          "Les machines que nous avons créées nous remplacent.",
        ],
        en: [
          "Apparently, they don’t need us anymore…",
          "Not as much, anyway.",
          "The machines we created are replacing us.",
        ],
      },
      repeat: {
        fr: ["Ils n’ont plus besoin de nous…"],
        en: ["They don’t need us anymore…"],
      },
      dependingOn: ["second_act_begin"],
    },
  ],
  minerChief: [
    {
      messages: {
        fr: [
          "Bienvenue à Grise Mine, LA mine responsable !",
          "D’ici sortent des tonnes de minerais chaque jour…",
          "extraits avec de l’énergie bas-carbone s’il vous plait !",
          "Nous utilisons l’eau de façon raisonnée…",
          "traitons nos employés de manière exemplaire, et…",
          "Ça ne t’intéresse pas mon discours ?",
          "…",
          "Tu quoi ? Tu es là pour travailler ???",
          "Hahaha, elle est bien bonne celle-là.",
          "Mes meilleurs hommes sont épuisés très vite…",
          "tu ne tiendras pas une seconde là-dedans !",
          "Mais ok, je veux bien te faire une formation express.",
          "Apprête-toi à te faire miner… le moral HAHAHA",
        ],
        en: [
          "Welcome to Grey Mine, THE responsible mine!",
          "Tons of ore come out of here every day…",
          "extracted with low-carbon energy, please!",
          "We use water wisely…",
          "treat our employees in an exemplary manner, and…",
          "Aren’t you interested in what I’m saying?",
          "…",
          "What? Are you here to work???",
          "Hahaha, your jokes are a gold mine…",
          "My best men get exhausted very quickly…",
          "You won’t last a second in there!",
          "But okay, I’ll give you a crash course.",
          "Get ready… You’ll be our canary in a coal mine, HAHAHA",
        ],
      },
      unlockEvents: ["mine_start"],
    },
  ],
  minerDirty2: [
    {
      messages: {
        fr: [
          "J’suis content d’avoir trouvé ce boulot…",
          "même si c’est pas forcément bien payé.",
        ],
        en: [
          "I’m glad I found this job…",
          "even if it doesn’t necessarily pay well.",
        ],
      },
      repeat: {
        fr: ["Ce boulot est pas forcément bien payé."],
        en: ["This job doesn’t pay well."],
      },
    },
  ],
  minerDirty3: [
    {
      messages: {
        fr: [
          "Fiouuu… ça fait du bien une petite pause…",
          "Je plains celui qui devra dépolluer ces bassins d’eau.",
          "Enfin… si on le fait un jour…",
        ],
        en: [
          "Phew… it’s nice to have a little break…",
          "I feel sorry…",
          "… for those who will have to clean up these water basins.",
          "Well… if we ever do…",
        ],
      },
    },
  ],
  minerDirty4: [
    {
      messages: {
        fr: [
          "Si tu cherches le chef, il est devant l’entrée.",
          "Maintenant laisse moi contempler la vue du progrès.",
        ],
        en: [
          "If you’re looking for the boss…",
          "he’s in front of the entrance.",
          "Now let me contemplate the view of progress.",
        ],
      },
      repeat: {
        fr: ["Contemple avec moi, la vue du progrès."],
        en: ["Contemplate with me the view of progress."],
      },
    },
  ],
  mine: [
    {
      messages: [
        isMobileOrTablet()
          ? "Installe-toi…\n(touche pour continuer)"
          : "Installe-toi…\n(espace pour continuer)",
        "Comme tu es nouvelle, je te mets sur un poste simple…",
        "…le nettoyage !",
        "Les roches vont avancer sur le tapis roulant…",
        "et tu devras les nettoyer pour éliminer les impuretés !",
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
        "J’espère que t’as bien tout compris !",
        "J’peux pas me permettre que tu ralentisses le train…",
        "de la mine !",
      ],
      unlockEvents: ["mine_tuto_begin"],
    },
    {
      messages: [
        "Tu n’as pas compris comment ça fonctionne ???",
        "Tu dois nettoyer la roche à CENT POUR CENT !",
        "On ne peut pas l’envoyer à moitié nettoyée.",
        isMobileOrTablet()
          ? "Bouge le tuyau avec le joystick."
          : "Bouge le tuyau avec les flèches ← → ↑ ↓",
        isMobileOrTablet()
          ? "En bougeant le tuyau, l’eau est pulvérisée. Allez !"
          : "Et pulvérise l’eau avec la barre ESPACE. Allez !",
      ],
      dependingOn: ["mine_tuto_missed"],
      unlockEvents: ["mine_tuto_begin"],
    },
    {
      messages: [
        "Tu as compris comment ça fonctionne…",
        "Passons aux choses sérieuses !",
      ],
      dependingOn: ["mine_tuto_end"],
      unlockEvents: ["mine_show_score_board"],
    },
    {
      messages: [
        "Ça, c’est ce qui va contrôler ton travail.",
        "Si tu rates trop souvent, une croix s’allumera.",
        "Au bout de trois croix…",
        "je viendrai moi-même t’accompagner à la sortie !",
        "…",
        "Quoi ?? Qu’est-ce qui ne va pas ?",
        "Oui… On extrait l’eau de la rivière !",
        "Et on stocke les déchets dans des réservoirs.",
        "Je te rappelle qu’on est une mine responsable.",
        "C’est du sérieux. On ne fait pas n’importe quoi !",
        "Bon, arrête de poser des questions, au boulot !",
      ],
      dependingOn: ["mine_show_score_board"],
      unlockEvents: ["mine_after_tuto"],
    },
    {
      messages: [
        "C’est bien ce qu’il me semblait…",
        "tu ne peux pas tenir un rythme aussi soutenu !",
        "On arrête les frais pour aujourd’hui.",
        "Allez… ne fais pas grise mine !",
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
        "ou la non qualité de ton travail ?",
        "Tu n’es plus la bienvenue à l’usine. Ordre du chef !",
      ],
      repeat: ["Tu n’es plus la bienvenue ici."],
      dependingOn: ["third_act_begin"],
    },
  ],
  whiteWorker2: [
    {
      messages: [
        "Je m’y connais pas trop en électronique…",
        "mais il faut bien que je mange !",
      ],
      repeat: ["Je travaille ici car il faut que je mange !"],
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
        "Oui ? … Tu t’appelles Maï et tu veux travailler ?",
        "Bien sûr, comme tout le monde ici.",
        "Une usine dernier cri attire forcément…",
        "des ploucs euh… des gens comme vous.",
        "Pour t’expliquer en langage simple…",
        "Ici chez Nano World Company…",
        "… on assemble des circuits électroniques…",
        "Qui finissent ensuite dans des écrans ou téléphones.",
        "Sois contente, tu peux faire une période d’essai.",
        "Est-ce que tu penses en être capable ?",
        "Voyons voir ce que tu vaux !",
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
        "Alors… ça vous dit de… tester une journée de travail ?",
        "Ça nous arrange d’avoir… des femmes.",
        "Vu qu’on vous paie moins… euh… oubliez ça.",
        "Suivez-moi !",
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
        "Les clients n’attendent pas !",
        isMobileOrTablet()
          ? "Choisis le bon composant en appuyant à gauche ou à droite."
          : "Choisis le bon composant avec les flèches ← →",
        isMobileOrTablet()
          ? "Et installe le composant choisi en appuyant au centre."
          : "Et installe le composant choisi avec la barre ESPACE",
        "C’est parti !",
      ],
      unlockEvents: ["factory_tuto_begin"],
    },
    {
      messages: [
        "Tête de linotte !",
        "Tu n’as pas compris comment ça fonctionne ?",
        "Tu dois monter les composants sur les cartes…",
        isMobileOrTablet()
          ? "Choisis le bon composant en appuyant à gauche ou à droite."
          : "Choisis le bon composant avec les flèches ← →",
        isMobileOrTablet()
          ? "Et installe le composant choisi en appuyant au centre."
          : "Et installe le composant choisi avec la barre ESPACE",
        "C’est à la portée du premier venu !",
      ],
      dependingOn: ["factory_tuto_missed"],
      unlockEvents: ["factory_tuto_begin"],
    },
    {
      messages: [
        "Tu sembles avoir compris comment ça fonctionne…",
        "Passons aux choses sérieuses !",
      ],
      dependingOn: ["factory_tuto_end"],
      unlockEvents: ["factory_show_score_board"],
    },
    {
      messages: [
        "Si tu rates l’assemblage, une croix s’allumera.",
        "Au bout de trois croix…",
        "je viendrai moi-même t’accompagner à la sortie !",
        "As-tu d’autres questions ???",
        "Tu dis que l’eau utilisé assèche la rivière ?",
        "Et qu’est-ce que ça peut me faire ?",
        "Tout le monde sera bien content…",
        "d’avoir des téléphones derniers cris !",
        "Arrête de te poser des questions et au boulot.",
      ],
      dependingOn: ["factory_show_score_board"],
      unlockEvents: ["factory_after_tuto"],
    },
    {
      messages: [
        "C’est bien ce qu’il me semblait…",
        "tu ne peux pas tenir un rythme aussi soutenu !",
        "On arrête les frais pour aujourd’hui.",
        "Allez… Rentre chez toi !",
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
        "Le mode doit correspondre au déchet qui tombe !",
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
        "Allez euh… au boulot !",
      ],
      dependingOn: ["recycling_show_score_board"],
      unlockEvents: ["recycling_after_tuto"],
    },
    {
      messages: [
        "Bon euh… c’est fini pour aujourd’hui.",
        "Il faudra être plus performante pour…",
        "sauver la planète !",
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
        "Comment tu nous as trouvé ?",
        "Nous étions des ouvriers et avons déserté la mine…",
        "… nous avons abandonné notre travail…",
        "… et avons créé cette petite communauté…",
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
        "Cependant, on vit cachés dans la forêt.",
      ],
      repeat: ["On est obligé de vivre cachés dans la forêt."],
    },
  ],
};

const uiMessages = {
  "game.newGame": {
    fr: "Nouvelle partie",
    en: "New game",
  },

  "game.continueGame": {
    fr: "Continuer la partie",
    en: "Continue the game",
  },

  "game.play": {
    fr: "Jouer",
    en: "Play",
  },

  "game.loading": {
    fr: "Chargement…",
    en: "Loading…",
  },

  "game.mine": {
    fr: "La mine",
    en: "The mine",
  },

  "game.factory": {
    fr: "L’usine",
    en: "The factory",
  },

  "game.recycling": {
    fr: "Le recyclage",
    en: "The recycling",
  },

  "game.credits": {
    fr: "Crédits",
    en: "Credits",
  },

  "game.howToPlay": {
    fr: "Déplace-toi avec les touches ← → ↑ ↓ (ou ZQSD)",
    en: "Move using the arrow keys ← → ↑ ↓ (or WASD)",
  },

  "game.action": {
    fr: isMobileOrTablet() ? "Appuyer pour continuer" : "Appuyer sur espace",
    en: isMobileOrTablet() ? "Press to continue" : "Press space bar",
  },

  "mine.faster": {
    fr: "Plus vite !",
    en: "Faster!",
  },
  "mine.fasterAgain": {
    fr: "Encore plus vite, allez !!!",
    en: "Even faster, come on!!!",
  },
  "mine.waterEmpty": {
    fr: "Réservoir d’eau vide ! Tu dois attendre son remplissage.",
    en: "The water tank is empty! You must wait for it to refill.",
  },
  "mine.waterFull": {
    fr: "Réservoir d’eau plein, allez !!!",
    en: "Water tank full! Come on!!!",
  },
  "mine.moreMaterials": {
    fr: "Arrivage de minerais, on augmente la cadence !",
    en: "Ore arrivals, we’re picking up the pace!",
  },
  "mine.warning": {
    fr: "Ressaisis-toi, on est là pour faire du chiffre !",
    en: "Pull yourself together, we’re here to make money!",
  },
  "mine.lastWarning": {
    fr: "Dernier avertissement, concentre-toi !",
    en: "This is your last warning, pay attention!",
  },

  "factory.faster": {
    fr: "Validé! Plus vite maintenant!!!",
    en: "Approved! Now hurry up!!!",
  },
  "factory.welldone": {
    fr: "C’est bien, tu es productive !",
    en: "That’s great, you’re being productive!",
  },
  "factory.error": {
    fr: "C’est quoi ce boulot ? Ressaisis-toi la nouvelle !",
    en: "What kind of job is this? Pull yourself together, newbie!",
  },

  "recycling.faster": {
    fr: "Allez, Euh… On augmente le rythme !",
    en: "Come on, um… Let’s pick up the pace!",
  },
  "recycling.error": {
    fr: "Euh… il va falloir faire mieux que ça !",
    en: "Um… you’ll have to do better than that!",
  },

  "betweenActs.later": {
    fr: "Quelque temps plus tard…",
    en: "Some time later…",
  },
  "final.later": {
    fr: "Quelque temps plus tard…",
    en: "Some time later…",
  },

  "progression.saved": {
    fr: "Progression enregistrée",
    en: "Progress saved",
  },

  "generic.1": {
    fr: "L’extraction minière est l’industrie la plus polluante au monde.",
    en: "Mining is the most polluting industry in the world.",
  },
  "generic.2": {
    fr: "La mine a des conséquences éternelles sur les habitants et les écosystèmes.",
    en: "Mining has lasting consequences for inhabitants and ecosystems.",
  },
  "generic.3": {
    fr: "La production d’objets numériques participe à l’épuisement des ressources… et des ouvriers.",
    en: "The production of digital devices contributes to the depletion of resources and the exhaustion of workers.",
  },
  "generic.4": {
    fr: "Le recyclage n’est pas une solution miracle…",
    en: "Recycling is not a miracle solution…",
  },
  "generic.5": {
    fr: "Pour économiser les ressources, ne cédons pas aux objets connectés inutiles.",
    en: "To save resources, let’s not give in to unnecessary connected devices.",
  },
  "generic.6": {
    fr: "Et gardons les appareils utiles plus longtemps.",
    en: "And let’s keep useful devices for longer.",
  },
  "generic.7": {
    fr: "Ce jeu est dédié au vivant, humains compris, qui chaque jour paye de plus en plus cher, l’accélération technologique.",
    en: "This game is dedicated to living beings, including humans, who are paying an increasingly high price for technological acceleration every day.",
  },
  "generic.thanks": {
    fr: "Merci d’avoir joué.",
    en: "Thank you for playing.",
  },
  "generic.credits": {
    fr: "Idée originale, game design et programmation\n\n  Richard Hanna.\n\nGraphisme, level design et game design\n\n  Philippe Salib.\n\nGame design, narration, musiques et effets sonores\n\n  David Fonteix.",
    en: "Original concept, game design and programming\n\n  Richard Hanna.\n\nGraphics, level design and game design\n\n  Philippe Salib.\n\nGame design, narration, music and sound effects\n\n  David Fonteix.",
  },
};

const getUiMessage = (name) => uiMessages[name][getLocale()];

export { spriteNames, messageWorkflow, getUiMessage };
