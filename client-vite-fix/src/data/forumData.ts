export interface Reply {
  id: string;
  content: string;
  author: {
    name: string;
    avatar?: string;
  };
  createdAt: string;
  likesCount: number;
}

export interface Discussion {
  id: string;
  title: string;
  content: string;
  author: {
    name: string;
    avatar?: string;
  };
  category: string;
  createdAt: string;
  repliesCount: number;
  likesCount: number;
  replies: Reply[];
}

export const discussionsData: Discussion[] = [
  {
    id: '1',
    title: 'Comment rédiger un CV efficace pour le marché sénégalais ?',
    content: 'Je suis à la recherche d\'un emploi dans le secteur IT à Dakar. Quels sont les éléments essentiels à inclure dans mon CV pour attirer l\'attention des recruteurs locaux ?',
    author: {
      name: 'Mamadou Diop',
      avatar: 'https://i.pravatar.cc/150?img=1'
    },
    category: 'emploi',
    createdAt: '2024-04-28T10:00:00Z',
    repliesCount: 3,
    likesCount: 45,
    replies: [
      {
        id: '1-1',
        content: 'Pour le marché sénégalais, je recommande fortement de mettre en avant vos compétences linguistiques (français, wolof, anglais). Ajoutez aussi vos expériences de stages, même courtes, car elles sont très valorisées ici.',
        author: {
          name: 'Sophie Faye',
          avatar: 'https://i.pravatar.cc/150?img=10'
        },
        createdAt: '2024-04-28T10:30:00Z',
        likesCount: 12
      },
      {
        id: '1-2',
        content: 'N\'oubliez pas de mentionner vos certifications techniques, particulièrement celles de Microsoft, Oracle ou AWS qui sont très recherchées à Dakar. Aussi, incluez un lien vers votre portfolio GitHub.',
        author: {
          name: 'Moussa Seck',
          avatar: 'https://i.pravatar.cc/150?img=11'
        },
        createdAt: '2024-04-28T11:15:00Z',
        likesCount: 8
      },
      {
        id: '1-3',
        content: 'Je suis recruteur chez une grande entreprise de la place. Mon conseil : mettez en avant vos projets personnels et votre implication dans la communauté tech locale (meetups, hackathons, etc.).',
        author: {
          name: 'Aminata Ba',
          avatar: 'https://i.pravatar.cc/150?img=12'
        },
        createdAt: '2024-04-28T14:20:00Z',
        likesCount: 15
      }
    ]
  },
  {
    id: '2',
    title: 'Opportunités de formation en développement web à Dakar',
    content: 'Je cherche des recommandations pour des bootcamps ou des formations intensives en développement web sur Dakar. Quelqu\'un a-t-il déjà suivi une formation chez Simplon ou à l\'Orange Digital Academy ?',
    author: {
      name: 'Fatou Sow',
      avatar: 'https://i.pravatar.cc/150?img=2'
    },
    category: 'formation',
    createdAt: '2024-04-27T15:30:00Z',
    repliesCount: 4,
    likesCount: 23,
    replies: [
      {
        id: '2-1',
        content: 'J\'ai fait la formation Simplon l\'année dernière. Le programme est intense mais très pratique. On travaille sur des projets réels avec des entreprises locales. La formation dure 6 mois et ils ont un bon taux d\'insertion.',
        author: {
          name: 'Ousmane Ndiaye',
          avatar: 'https://i.pravatar.cc/150?img=13'
        },
        createdAt: '2024-04-27T16:00:00Z',
        likesCount: 10
      },
      {
        id: '2-2',
        content: 'Orange Digital Academy propose une excellente formation en partenariat avec OpenClassrooms. L\'avantage est que vous pouvez suivre à votre rythme et c\'est gratuit si vous êtes sélectionné.',
        author: {
          name: 'Aida Dieng',
          avatar: 'https://i.pravatar.cc/150?img=14'
        },
        createdAt: '2024-04-27T17:45:00Z',
        likesCount: 7
      },
      {
        id: '2-3',
        content: 'Il y a aussi le programme Jiggen Tech qui est spécialement conçu pour les femmes. Ils offrent une formation complète en développement web et un mentorat personnalisé.',
        author: {
          name: 'Rama Fall',
          avatar: 'https://i.pravatar.cc/150?img=15'
        },
        createdAt: '2024-04-28T09:30:00Z',
        likesCount: 13
      },
      {
        id: '2-4',
        content: 'Je conseille aussi de regarder du côté de l\'ESMT qui propose des formations certifiantes en développement web. Ils ont un bon réseau d\'entreprises partenaires.',
        author: {
          name: 'Ibrahima Gueye',
          avatar: 'https://i.pravatar.cc/150?img=16'
        },
        createdAt: '2024-04-28T11:20:00Z',
        likesCount: 6
      }
    ]
  }
]; 