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
        "Je m'occupe de mon petit potager...",
      ],
    },
    {
      messages: [
        "J'adore mon potager...",
      ],
    },
    {
      messages: [
        "Oh la la, mais qu'est-il arrivé à la rivière ? Tu as vu ça ?",
      ],
      dependingOn: [
        'first_sleep',
      ],
    },
  ],
  koko: [
    {
      messages: [
        "Oh bah, v’là donc une nouvelle arrivante, ça fait plaisir d’voir une nouvelle tête !",
        "Bienvenue au village de Trois-Rivières !",
        "Moi c'est Koko.",
        "Maï ? Joli prénom...",
        "J’suis sûre que notre patelin va te plaire, va donc y faire un tour !",
        "Et si tu cherches un endroit où dormir, y’a de quoi faire au sud.",
      ],
    },
    {
      messages: [
        "Maï, si t’as fini d’visiter tout le village, va donc vers le sud pour trouver où dormir."
      ],
    },
    {
      messages: [
        "Tu as rencontré Django ? C'est la personne la plus gentille que j'connaisse.",
      ],
      unlockEdependingOnvents: [
        'django_met',
      ],
    },
    {
      messages: [
        "Oh la la, le pauv'Nono, il est dans un état lamentable.",
        "Lamentable, comme la rivière qui est toute polluée.",
        "Tu peux aller voir Nono, il habite au nord du village.",
      ],
      dependingOn: [
        'first_sleep',
      ],
    },
    {
      messages: [
        "Je me demande ce qui est arrivé à la rivière, toute marron, beurk.",
      ],
      dependingOn: [
        'nono_first_met',
      ],
    },
  ],
  nono: [
    {
      messages: [
        "Salut Maï !",
        "Comment je connais ton prénom ? C'est Koko qui me l'a dit.",
        "Elle aime bien tout savoir et que tout se sache ici !",
        "Je suis dans un sale état, car j'ai eu un accident de travail.",
        "Je travaillais à la mine, à l'est du village...",
        "Et pas de bol, un effondrement de roches...",
        "Je m'en sors plutôt pas trop mal, j'aurais pu y laisser ma peau.",
        "La rivière polluée ? Oui j'ai appris la mauvaise nouvelle...",
      ],
      unlockEvents: [
        'nono_first_met',
      ],
    },
    {
      messages: [
        "Je dois me reposer, fini le travail à la mine pour l'instant.",
      ],
    },
    {
      messages: [
        "Quoi ? Tu veux aller voir la mine ?",
        "Pour chercher l'origine de la pollution de la rivière ?",
        "Ok, pourquoi pas, je te prête mon laisser-passer pour la mine...",
        "Sois très prudente, reste discrète et reviens vite !",
      ],
      dependingOn: [
        'nono_first_met',
        'miner_ask_for_card',
      ],
      unlockEvents: [
        'card_for_mine',
      ],
    },
    {
      messages: [
        "Fais bon usage de mon laisser-passer pour la mine... et sois très prudente !",
      ],
    },
  ],
  fisherman: [
    {
      messages: [
        "Pas un bruit, j'ai une touche !",
      ],
    },
    {
      messages: [
        "Fichtre, je ne vais plus pouvoir pêcher. Qui sont les responsables de ce #?%@ ???",
      ],
      dependingOn: [
        'first_sleep',
      ],
    },
  ],
  django: [
    {
      messages: [
        "Salut ! Moi c'est Django. ►",
        "Maï ? Joli prénom ! Tu es la bienvenue dans notre village. ►",
        "Si tu cherches un hébergement pour la nuit, tu es la bienvenue. ►",
        "J'ai une chambre pour les amis !",
      ],
      unlockEvents: [
        'django_met',
      ],
    },
    {
      messages: [
        "Tu es la bienvenue chez moi ce soir. ►",
        "J'ai une chambre pour les amis et visiteurs de passage !",
      ],
    },
    {
      messages: [
        "Il se fait tard ! Je t'ai préparé la chambre d'ami...",
      ],
      dependingOn: [
        'miner_first_met',
      ],
      unlockEvents: [
        'first_sleep',
      ],
    },
    {
      messages: [
        "Bonjour Maï ! Bien dormie ?",
        "Tu es la bienvenue pendant le temps que tu souhaites.",
        "Il s'est passé une chose terrible au village, une des rivières est polluée !",
      ],
      dependingOn: [
        'first_sleep',
      ],
    },
    {
      messages: [
        "Il s'est passé une chose terrible au village, une des rivières est polluée !",
      ],
    },
  ],
  miner: [
    {
      messages: [
        "Stop ! On ne passe pas.",
      ],
    },
    {
      messages: [
        "Stop ! On ne passe pas. De toute façon, le soleil se couche.",
        "Reviens demain matin, on causera.",
      ],
      unlockEvents: [
        'miner_first_met',
      ],
      dependingOn: [
        'django_met',
      ],
    },
    {
      messages: [
        "J'ai dit qu'on ne passe pas. Il est tard, rentre chez toi !"
      ],
    },
    {
      messages: [
        "Encore toi ? On ne passe pas !",
        "Ici c'est l'accès à la mine...",
        "et seules les personnes ayant un laisser-passer de travail peuvent traverser !",
      ],
      dependingOn: [
        'first_sleep',
      ],
      unlockEvents: [
        'miner_ask_for_card',
      ],
    },
    {
      messages: [
        "Sans un laisser-passer de travail, tu ne traverses pas.",
      ],
    },
    {
      messages: [
        "T'es revenue ?",
        "Je vois que tu as un laisser-passer, je ne sais pas d'où tu le sors...",
        "Mais tu peux y aller, d'toute façon, on cherche des gens pour bosser à la mine...",
      ],
      dependingOn: [
        'card_for_mine',
      ],
      unlockEvents: [
        'mine_access_validation',
      ],
    },
    {
      messages: [
        "Tu vas pouvoir commencer à bosser !",
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
    {
      messages: [
        "Oh non, on ne peut plus se baigner...",
      ],
      dependingOn: [
        'first_sleep',
      ],
    },
  ],
};

export { spriteNames, messageWorkflow };
