export interface Reply {
  id: string;
  content: string;
  author: {
    id: string;
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
  category: 'emploi' | 'formation' | 'entrepreneuriat' | 'networking' | 'conseils';
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  createdAt: string;
  repliesCount: number;
  likesCount: number;
  status: 'active' | 'closed';
  replies: Reply[];
}

export const defaultDiscussions: Discussion[] = [
  {
    id: '1',
    title: 'Quels sont les métiers d\'avenir dans le numérique au Sénégal ?',
    content: `Je suis étudiant et je m'intéresse aux opportunités dans le secteur numérique. Quels sont selon vous les métiers les plus prometteurs dans ce domaine au Sénégal ? Quelles compétences faut-il développer ?`,
    category: 'emploi',
    author: {
      id: 'user1',
      name: 'Moustapha Ndiaye',
      avatar: '/images/avatars/user1.jpg'
    },
    createdAt: '2024-03-10T08:30:00Z',
    repliesCount: 2,
    likesCount: 12,
    status: 'active',
    replies: [
      {
        id: 'reply1',
        content: 'Le développement web et mobile est très demandé actuellement. Il y a aussi beaucoup d\'opportunités dans la data science et la cybersécurité. Je conseille de bien maîtriser l\'anglais technique et de suivre des formations en ligne pour rester à jour.',
        author: {
          id: 'user2',
          name: 'Abdoulaye Diop'
        },
        createdAt: '2024-03-10T09:15:00Z',
        likesCount: 5
      }
    ]
  },
  {
    id: '2',
    title: 'Retour d\'expérience : Formation en ligne vs présentiel',
    content: `J'hésite entre suivre une formation en ligne ou en présentiel pour le développement web. Ceux qui ont déjà expérimenté les deux formats, quels sont les avantages et inconvénients de chaque approche ?`,
    category: 'formation',
    author: {
      id: 'user3',
      name: 'Aminata Sow'
    },
    createdAt: '2024-03-11T10:00:00Z',
    repliesCount: 1,
    likesCount: 8,
    status: 'active',
    replies: [
      {
        id: 'reply1',
        content: 'J\'ai fait les deux. Le présentiel permet plus d\'interactions et d\'entraide entre apprenants. Le online offre plus de flexibilité et permet de revoir les cours. L\'idéal est de combiner les deux si possible.',
        author: {
          id: 'user10',
          name: 'Aida Sarr'
        },
        createdAt: '2024-03-11T11:20:00Z',
        likesCount: 6
      }
    ]
  },
  {
    id: '3',
    title: 'Comment gérer son temps en tant qu\'entrepreneur ?',
    content: `Je viens de me lancer en freelance et j'ai du mal à gérer mon temps efficacement. Comment organisez-vous vos journées ? Quels outils utilisez-vous pour la gestion de projet et la productivité ?`,
    category: 'entrepreneuriat',
    author: {
      id: 'user4',
      name: 'Fatou Diouf'
    },
    createdAt: '2024-03-12T14:20:00Z',
    repliesCount: 2,
    likesCount: 15,
    status: 'active',
    replies: [
      {
        id: 'reply1',
        content: 'J\'utilise la méthode Pomodoro (25 min de travail, 5 min de pause) et ça m\'aide beaucoup. Pour la gestion de projet, Trello est très pratique. Le plus important est de bien définir ses priorités chaque jour.',
        author: {
          id: 'user11',
          name: 'Sokhna Dieng'
        },
        createdAt: '2024-03-12T15:45:00Z',
        likesCount: 12
      }
    ]
  },
  {
    id: '4',
    title: 'Ressources gratuites pour apprendre le développement web',
    content: `Je débute en développement web et je cherche des ressources gratuites de qualité. Quels sont les meilleurs sites, chaînes YouTube ou MOOCs que vous recommandez ? Particulièrement pour HTML, CSS et JavaScript.`,
    category: 'formation',
    author: {
      id: 'user5',
      name: 'Cheikh Mbaye'
    },
    createdAt: '2024-03-13T16:45:00Z',
    repliesCount: 1,
    likesCount: 10,
    status: 'active',
    replies: [
      {
        id: 'reply1',
        content: 'FreeCodeCamp est excellent pour débuter, tout est gratuit et bien structuré. MDN (Mozilla) a aussi une super documentation. Pour les vidéos en français, je recommande Grafikart.',
        author: {
          id: 'user12',
          name: 'Omar Sy'
        },
        createdAt: '2024-03-13T17:30:00Z',
        likesCount: 8
      }
    ]
  },
  {
    id: '5',
    title: 'Conseils pour un premier entretien technique',
    content: `J'ai bientôt mon premier entretien technique pour un poste de développeur junior. Comment bien s'y préparer ? Quels types de questions sont généralement posées ?`,
    category: 'conseils',
    author: {
      id: 'user6',
      name: 'Ibrahima Fall'
    },
    createdAt: '2024-03-14T11:30:00Z',
    repliesCount: 1,
    likesCount: 13,
    status: 'active',
    replies: [
      {
        id: 'reply1',
        content: 'Révisez bien les bases (algorithmes, structures de données). Préparez des exemples de projets personnels à présenter. N\'hésitez pas à dire "je ne sais pas" si vous ne connaissez pas quelque chose, c\'est mieux que d\'inventer.',
        author: {
          id: 'user13',
          name: 'Modou Faye'
        },
        createdAt: '2024-03-14T12:15:00Z',
        likesCount: 11
      }
    ]
  }
]; 