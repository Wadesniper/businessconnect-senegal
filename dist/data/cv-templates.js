"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cvTemplates = void 0;
exports.cvTemplates = [
    {
        id: 'tech-1',
        sector: 'Technologie',
        profile: {
            fullName: 'Aminata Diallo',
            title: 'Développeuse Full Stack Senior',
            email: 'aminata.diallo@email.com',
            phone: '+221 77 123 45 67',
            location: 'Dakar, Sénégal',
            photo: '/images/cv-templates/profiles/tech-profile-1.jpg',
            linkedin: 'linkedin.com/in/aminatadiallo',
            portfolio: 'github.com/aminatadiallo'
        },
        summary: 'Développeuse Full Stack passionnée avec plus de 5 ans d\'expérience dans la création d\'applications web innovantes. Experte en React, Node.js et architectures cloud, avec un fort accent sur les pratiques DevOps et l\'agilité.',
        experience: [
            {
                company: 'TechWave Sénégal',
                position: 'Lead Développeuse Full Stack',
                location: 'Dakar, Sénégal',
                startDate: '2021-01',
                current: true,
                description: [
                    'Direction d\'une équipe de 6 développeurs sur des projets d\'envergure nationale',
                    'Mise en place d\'une architecture microservices avec Docker et Kubernetes',
                    'Implémentation de CI/CD avec GitHub Actions et AWS'
                ],
                achievements: [
                    'Réduction de 40% du temps de déploiement',
                    'Amélioration de 60% des performances applicatives'
                ]
            },
            {
                company: 'Digital Solutions Africa',
                position: 'Développeuse Full Stack',
                location: 'Dakar, Sénégal',
                startDate: '2018-03',
                endDate: '2020-12',
                description: [
                    'Développement d\'applications web avec React et Node.js',
                    'Mise en place d\'APIs RESTful et GraphQL',
                    'Optimisation des performances et de la sécurité'
                ]
            }
        ],
        education: [
            {
                school: 'École Supérieure Polytechnique de Dakar',
                degree: 'Master',
                field: 'Génie Logiciel',
                startDate: '2016',
                endDate: '2018',
                description: 'Major de promotion'
            },
            {
                school: 'Université Cheikh Anta Diop',
                degree: 'Licence',
                field: 'Informatique',
                startDate: '2013',
                endDate: '2016'
            }
        ],
        skills: [
            {
                category: 'Technologies Frontend',
                items: [
                    { name: 'React', level: 5 },
                    { name: 'TypeScript', level: 5 },
                    { name: 'Next.js', level: 4 },
                    { name: 'CSS/SASS', level: 4 }
                ]
            },
            {
                category: 'Technologies Backend',
                items: [
                    { name: 'Node.js', level: 5 },
                    { name: 'Python', level: 4 },
                    { name: 'MongoDB', level: 4 },
                    { name: 'PostgreSQL', level: 4 }
                ]
            },
            {
                category: 'DevOps',
                items: [
                    { name: 'Docker', level: 4 },
                    { name: 'Kubernetes', level: 4 },
                    { name: 'AWS', level: 4 },
                    { name: 'CI/CD', level: 4 }
                ]
            }
        ],
        languages: [
            { name: 'Français', level: 'Natif' },
            { name: 'Anglais', level: 'Avancé' },
            { name: 'Wolof', level: 'Natif' }
        ],
        certifications: [
            {
                name: 'AWS Certified Solutions Architect',
                issuer: 'Amazon Web Services',
                date: '2022-06',
                url: 'aws.amazon.com/certification'
            },
            {
                name: 'Professional Scrum Master I',
                issuer: 'Scrum.org',
                date: '2021-03'
            }
        ]
    },
    {
        id: 'finance-1',
        sector: 'Finance',
        profile: {
            fullName: 'Fatou Ndiaye',
            title: 'Analyste Financière Senior',
            email: 'fatou.ndiaye@email.com',
            phone: '+221 77 234 56 78',
            location: 'Dakar, Sénégal',
            photo: '/images/cv-templates/profiles/finance-profile-1.jpg',
            linkedin: 'linkedin.com/in/fatoundiaye'
        },
        summary: 'Analyste financière chevronnée avec 7 ans d\'expérience dans le secteur bancaire et la gestion d\'actifs. Expertise en analyse de risques, modélisation financière et gestion de portefeuille.',
        experience: [
            {
                company: 'Banque Atlantique Sénégal',
                position: 'Analyste Financière Senior',
                location: 'Dakar, Sénégal',
                startDate: '2020-01',
                current: true,
                description: [
                    'Gestion d\'un portefeuille de 50M€ d\'actifs',
                    'Développement de stratégies d\'investissement innovantes',
                    'Analyse des risques et opportunités de marché'
                ],
                achievements: [
                    'Augmentation de 25% du rendement du portefeuille',
                    'Réduction de 30% des risques opérationnels'
                ]
            }
        ],
        education: [
            {
                school: 'HEC Paris',
                degree: 'Master',
                field: 'Finance',
                startDate: '2014',
                endDate: '2016'
            },
            {
                school: 'IAM Dakar',
                degree: 'Licence',
                field: 'Gestion',
                startDate: '2011',
                endDate: '2014'
            }
        ],
        skills: [
            {
                category: 'Analyse Financière',
                items: [
                    { name: 'Modélisation Financière', level: 5 },
                    { name: 'Analyse de Risques', level: 5 },
                    { name: 'Valorisation', level: 4 }
                ]
            },
            {
                category: 'Outils',
                items: [
                    { name: 'Bloomberg Terminal', level: 5 },
                    { name: 'Excel Avancé', level: 5 },
                    { name: 'Python Finance', level: 4 }
                ]
            }
        ],
        languages: [
            { name: 'Français', level: 'Natif' },
            { name: 'Anglais', level: 'Avancé' },
            { name: 'Wolof', level: 'Natif' }
        ],
        certifications: [
            {
                name: 'CFA Niveau III',
                issuer: 'CFA Institute',
                date: '2019-06'
            },
            {
                name: 'Financial Risk Manager (FRM)',
                issuer: 'GARP',
                date: '2018-05'
            }
        ]
    },
    {
        id: 'marketing-1',
        sector: 'Marketing Digital',
        profile: {
            fullName: 'Aïssatou Sow',
            title: 'Responsable Marketing Digital',
            email: 'aissatou.sow@email.com',
            phone: '+221 77 345 67 89',
            location: 'Dakar, Sénégal',
            photo: '/images/cv-templates/profiles/marketing-profile-1.jpg',
            linkedin: 'linkedin.com/in/aissatousow',
            portfolio: 'aissatousow.com'
        },
        summary: 'Stratège marketing digital créative avec 6 ans d\'expérience dans la conception et l\'exécution de campagnes numériques performantes. Expertise en SEO/SEA, médias sociaux et marketing de contenu.',
        experience: [
            {
                company: 'Digitalis Africa',
                position: 'Responsable Marketing Digital',
                location: 'Dakar, Sénégal',
                startDate: '2020-06',
                current: true,
                description: [
                    'Direction de la stratégie marketing digital pour plus de 15 clients majeurs',
                    'Gestion d\'une équipe de 8 spécialistes marketing',
                    'Développement et exécution de campagnes cross-canal'
                ],
                achievements: [
                    'Augmentation de 150% du trafic organique en 12 mois',
                    'Amélioration de 75% du ROI des campagnes publicitaires'
                ]
            },
            {
                company: 'MediaGroup Sénégal',
                position: 'Spécialiste Marketing Digital',
                location: 'Dakar, Sénégal',
                startDate: '2017-03',
                endDate: '2020-05',
                description: [
                    'Gestion des campagnes sur les réseaux sociaux',
                    'Création et optimisation de contenu SEO',
                    'Analyse des données et reporting'
                ]
            }
        ],
        education: [
            {
                school: 'ESSEC Business School',
                degree: 'Master',
                field: 'Marketing Digital',
                startDate: '2015',
                endDate: '2017',
                description: 'Spécialisation en stratégie digitale'
            },
            {
                school: 'ISM Dakar',
                degree: 'Licence',
                field: 'Marketing et Communication',
                startDate: '2012',
                endDate: '2015'
            }
        ],
        skills: [
            {
                category: 'Marketing Digital',
                items: [
                    { name: 'SEO/SEA', level: 5 },
                    { name: 'Social Media Marketing', level: 5 },
                    { name: 'Content Marketing', level: 4 },
                    { name: 'Email Marketing', level: 4 }
                ]
            },
            {
                category: 'Outils',
                items: [
                    { name: 'Google Analytics', level: 5 },
                    { name: 'Google Ads', level: 5 },
                    { name: 'Hootsuite', level: 4 },
                    { name: 'Mailchimp', level: 4 }
                ]
            },
            {
                category: 'Création',
                items: [
                    { name: 'Adobe Photoshop', level: 4 },
                    { name: 'Canva', level: 5 },
                    { name: 'Premier Pro', level: 3 }
                ]
            }
        ],
        languages: [
            { name: 'Français', level: 'Natif' },
            { name: 'Anglais', level: 'Avancé' },
            { name: 'Wolof', level: 'Natif' }
        ],
        certifications: [
            {
                name: 'Google Analytics Individual Qualification',
                issuer: 'Google',
                date: '2022-01'
            },
            {
                name: 'Facebook Blueprint Certification',
                issuer: 'Meta',
                date: '2021-06'
            }
        ]
    },
    {
        id: 'consulting-1',
        sector: 'Conseil en Management',
        profile: {
            fullName: 'Moussa Diop',
            title: 'Consultant Senior en Stratégie',
            email: 'moussa.diop@email.com',
            phone: '+221 77 456 78 90',
            location: 'Dakar, Sénégal',
            photo: '/images/cv-templates/profiles/consulting-profile-1.jpg',
            linkedin: 'linkedin.com/in/moussadiop'
        },
        summary: 'Consultant en stratégie avec 8 ans d\'expérience dans le conseil aux entreprises en Afrique de l\'Ouest. Expert en transformation digitale et optimisation des processus d\'entreprise.',
        experience: [
            {
                company: 'Deloitte Afrique',
                position: 'Senior Manager',
                location: 'Dakar, Sénégal',
                startDate: '2019-01',
                current: true,
                description: [
                    'Direction de projets de transformation pour des clients du CAC40',
                    'Gestion d\'équipes multiculturelles de 5 à 15 consultants',
                    'Développement de la practice Digital en Afrique de l\'Ouest'
                ],
                achievements: [
                    'Plus de 50M€ d\'économies générées pour les clients',
                    'Croissance de 40% du portefeuille clients en 2 ans'
                ]
            },
            {
                company: 'McKinsey & Company',
                position: 'Consultant',
                location: 'Paris, France',
                startDate: '2015-09',
                endDate: '2018-12',
                description: [
                    'Conseil en stratégie pour grands groupes internationaux',
                    'Spécialisation en transformation digitale',
                    'Développement de business plans et études de marché'
                ]
            }
        ],
        education: [
            {
                school: 'INSEAD',
                degree: 'MBA',
                field: 'Business Administration',
                startDate: '2014',
                endDate: '2015',
                description: 'Bourse d\'excellence'
            },
            {
                school: 'École Polytechnique de Paris',
                degree: 'Ingénieur',
                field: 'Génie Industriel',
                startDate: '2011',
                endDate: '2014'
            }
        ],
        skills: [
            {
                category: 'Conseil',
                items: [
                    { name: 'Stratégie d\'entreprise', level: 5 },
                    { name: 'Gestion de projet', level: 5 },
                    { name: 'Analyse financière', level: 4 },
                    { name: 'Change Management', level: 4 }
                ]
            },
            {
                category: 'Secteurs',
                items: [
                    { name: 'Services Financiers', level: 5 },
                    { name: 'Télécoms', level: 4 },
                    { name: 'Energie', level: 4 }
                ]
            },
            {
                category: 'Outils',
                items: [
                    { name: 'PowerBI', level: 4 },
                    { name: 'Tableau', level: 4 },
                    { name: 'Excel Avancé', level: 5 }
                ]
            }
        ],
        languages: [
            { name: 'Français', level: 'Natif' },
            { name: 'Anglais', level: 'Avancé' },
            { name: 'Wolof', level: 'Natif' }
        ],
        certifications: [
            {
                name: 'Project Management Professional (PMP)',
                issuer: 'PMI',
                date: '2020-03'
            },
            {
                name: 'Lean Six Sigma Black Belt',
                issuer: 'ASQ',
                date: '2019-11'
            }
        ]
    },
    {
        id: 'education-1',
        sector: 'Éducation',
        profile: {
            fullName: 'Mariama Bâ',
            title: 'Professeure de Sciences et Coordinatrice Pédagogique',
            email: 'mariama.ba@email.com',
            phone: '+221 77 567 89 01',
            location: 'Dakar, Sénégal',
            photo: '/images/cv-templates/profiles/education-profile-1.jpg',
            linkedin: 'linkedin.com/in/mariamaba'
        },
        summary: 'Enseignante passionnée avec 10 ans d\'expérience dans l\'éducation secondaire et supérieure. Spécialisée dans l\'innovation pédagogique et l\'intégration des technologies dans l\'enseignement.',
        experience: [
            {
                company: 'Lycée d\'Excellence de Dakar',
                position: 'Coordinatrice Pédagogique & Professeure de Sciences',
                location: 'Dakar, Sénégal',
                startDate: '2019-09',
                current: true,
                description: [
                    'Coordination de l\'équipe pédagogique de 25 enseignants',
                    'Développement de programmes innovants en STEM',
                    'Mise en place de méthodes d\'apprentissage actif'
                ],
                achievements: [
                    'Amélioration de 35% des résultats en sciences',
                    'Création d\'un laboratoire d\'innovation pédagogique'
                ]
            },
            {
                company: 'Université Cheikh Anta Diop',
                position: 'Chargée de cours',
                location: 'Dakar, Sénégal',
                startDate: '2016-09',
                endDate: '2019-07',
                description: [
                    'Enseignement en licence de sciences',
                    'Supervision de projets étudiants',
                    'Organisation de séminaires pédagogiques'
                ]
            }
        ],
        education: [
            {
                school: 'Université Paris-Saclay',
                degree: 'Doctorat',
                field: 'Didactique des Sciences',
                startDate: '2013',
                endDate: '2016',
                description: 'Thèse sur l\'innovation pédagogique dans l\'enseignement des sciences'
            },
            {
                school: 'ENS Dakar',
                degree: 'Master',
                field: 'Enseignement des Sciences',
                startDate: '2011',
                endDate: '2013'
            }
        ],
        skills: [
            {
                category: 'Pédagogie',
                items: [
                    { name: 'Méthodes actives', level: 5 },
                    { name: 'Différenciation pédagogique', level: 5 },
                    { name: 'Évaluation formative', level: 4 },
                    { name: 'Gestion de classe', level: 5 }
                ]
            },
            {
                category: 'Technologies Éducatives',
                items: [
                    { name: 'E-learning', level: 4 },
                    { name: 'Outils numériques', level: 4 },
                    { name: 'Moodle', level: 4 }
                ]
            }
        ],
        languages: [
            { name: 'Français', level: 'Natif' },
            { name: 'Anglais', level: 'Avancé' },
            { name: 'Wolof', level: 'Natif' }
        ],
        certifications: [
            {
                name: 'Certification en Innovation Pédagogique',
                issuer: 'UNESCO',
                date: '2021-04'
            },
            {
                name: 'Google Certified Educator Level 2',
                issuer: 'Google',
                date: '2020-06'
            }
        ]
    },
    {
        id: 'health-1',
        sector: 'Santé',
        profile: {
            fullName: 'Dr. Aminata Seck',
            title: 'Médecin Spécialiste en Santé Publique',
            email: 'dr.aminata.seck@email.com',
            phone: '+221 77 678 90 12',
            location: 'Dakar, Sénégal',
            photo: '/images/cv-templates/profiles/health-profile-1.jpg',
            linkedin: 'linkedin.com/in/draminataseck'
        },
        summary: 'Médecin spécialiste en santé publique avec 12 ans d\'expérience dans la gestion de programmes de santé et la coordination d\'équipes médicales. Expertise en santé maternelle et infantile.',
        experience: [
            {
                company: 'OMS Afrique de l\'Ouest',
                position: 'Coordinatrice de Programmes de Santé',
                location: 'Dakar, Sénégal',
                startDate: '2018-03',
                current: true,
                description: [
                    'Direction de programmes de santé maternelle et infantile',
                    'Coordination avec les ministères de la santé de 5 pays',
                    'Gestion d\'un budget de 10M$ et d\'une équipe de 30 personnes'
                ],
                achievements: [
                    'Réduction de 40% de la mortalité maternelle dans les zones ciblées',
                    'Mise en place de 15 centres de santé communautaires'
                ]
            },
            {
                company: 'Hôpital Principal de Dakar',
                position: 'Chef de Service Pédiatrie',
                location: 'Dakar, Sénégal',
                startDate: '2014-01',
                endDate: '2018-02',
                description: [
                    'Direction d\'une équipe de 20 professionnels de santé',
                    'Mise en place de protocoles de soins innovants',
                    'Formation du personnel médical'
                ]
            }
        ],
        education: [
            {
                school: 'Harvard School of Public Health',
                degree: 'Master',
                field: 'Santé Publique',
                startDate: '2012',
                endDate: '2014',
                description: 'Spécialisation en santé maternelle et infantile'
            },
            {
                school: 'Université Cheikh Anta Diop',
                degree: 'Doctorat en Médecine',
                field: 'Médecine',
                startDate: '2005',
                endDate: '2012'
            }
        ],
        skills: [
            {
                category: 'Expertise Médicale',
                items: [
                    { name: 'Santé publique', level: 5 },
                    { name: 'Pédiatrie', level: 5 },
                    { name: 'Épidémiologie', level: 4 },
                    { name: 'Vaccination', level: 5 }
                ]
            },
            {
                category: 'Gestion',
                items: [
                    { name: 'Gestion de programmes', level: 5 },
                    { name: 'Leadership d\'équipe', level: 4 },
                    { name: 'Gestion budgétaire', level: 4 }
                ]
            }
        ],
        languages: [
            { name: 'Français', level: 'Natif' },
            { name: 'Anglais', level: 'Avancé' },
            { name: 'Wolof', level: 'Natif' }
        ],
        certifications: [
            {
                name: 'Certification en Gestion de Crise Sanitaire',
                issuer: 'OMS',
                date: '2020-05'
            },
            {
                name: 'Leadership in Healthcare',
                issuer: 'Harvard Medical School',
                date: '2019-06'
            }
        ]
    },
    {
        id: 'entrepreneurship-1',
        sector: 'Entrepreneuriat',
        profile: {
            fullName: 'Omar Sy',
            title: 'Entrepreneur & Fondateur',
            email: 'omar.sy@email.com',
            phone: '+221 77 789 01 23',
            location: 'Dakar, Sénégal',
            photo: '/images/cv-templates/profiles/entrepreneur-profile-1.jpg',
            linkedin: 'linkedin.com/in/omarsy',
            portfolio: 'omarsy.com'
        },
        summary: 'Entrepreneur innovant avec une expérience réussie dans la création et le développement de startups tech en Afrique. Passionné par l\'innovation sociale et le développement durable.',
        experience: [
            {
                company: 'EcoTech Sénégal',
                position: 'Fondateur & CEO',
                location: 'Dakar, Sénégal',
                startDate: '2018-01',
                current: true,
                description: [
                    'Création et développement d\'une startup dans les énergies renouvelables',
                    'Levée de fonds de 2M€',
                    'Direction d\'une équipe de 45 personnes'
                ],
                achievements: [
                    'Installation de solutions solaires dans 100+ villages',
                    'Impact sur plus de 50 000 personnes'
                ]
            },
            {
                company: 'Africa Startup Lab',
                position: 'Mentor & Investisseur',
                location: 'Dakar, Sénégal',
                startDate: '2016-06',
                current: true,
                description: [
                    'Mentorat de plus de 30 startups',
                    'Investissement dans 5 startups prometteuses',
                    'Organisation d\'événements d\'entrepreneuriat'
                ]
            }
        ],
        education: [
            {
                school: 'MIT Sloan School of Management',
                degree: 'MBA',
                field: 'Entrepreneuriat',
                startDate: '2014',
                endDate: '2016',
                description: 'Focus sur l\'innovation sociale et le développement durable'
            },
            {
                school: 'ESP Dakar',
                degree: 'Ingénieur',
                field: 'Génie Électrique',
                startDate: '2010',
                endDate: '2014'
            }
        ],
        skills: [
            {
                category: 'Entrepreneuriat',
                items: [
                    { name: 'Business Development', level: 5 },
                    { name: 'Levée de fonds', level: 5 },
                    { name: 'Innovation', level: 5 },
                    { name: 'Leadership', level: 5 }
                ]
            },
            {
                category: 'Gestion',
                items: [
                    { name: 'Gestion de projet', level: 4 },
                    { name: 'Finance', level: 4 },
                    { name: 'Marketing', level: 4 }
                ]
            },
            {
                category: 'Technique',
                items: [
                    { name: 'Énergies renouvelables', level: 4 },
                    { name: 'Gestion de produit', level: 4 },
                    { name: 'Analyse de données', level: 4 }
                ]
            }
        ],
        languages: [
            { name: 'Français', level: 'Natif' },
            { name: 'Anglais', level: 'Avancé' },
            { name: 'Wolof', level: 'Natif' }
        ],
        certifications: [
            {
                name: 'Certified Entrepreneur',
                issuer: 'African Leadership Academy',
                date: '2020-03'
            },
            {
                name: 'Impact Investment Certificate',
                issuer: 'GIIN',
                date: '2019-09'
            }
        ]
    },
    {
        id: 'fashion-1',
        sector: 'Mode et Design',
        profile: {
            fullName: 'Adama Fall',
            title: 'Styliste & Directrice Créative',
            email: 'adama.fall@email.com',
            phone: '+221 77 890 12 34',
            location: 'Dakar, Sénégal',
            photo: '/images/cv-templates/profiles/fashion-profile-1.jpg',
            linkedin: 'linkedin.com/in/adamafall',
            portfolio: 'adamafall.com'
        },
        summary: 'Styliste créative avec 8 ans d\'expérience dans la mode africaine contemporaine. Spécialisée dans la fusion des tissus traditionnels et du design moderne. Engagement fort pour la mode durable et éthique.',
        experience: [
            {
                company: 'Maison Adama Fall',
                position: 'Fondatrice & Directrice Créative',
                location: 'Dakar, Sénégal',
                startDate: '2019-03',
                current: true,
                description: [
                    'Direction artistique de collections saisonnières',
                    'Gestion d\'un atelier de 15 artisans',
                    'Développement de collaborations internationales'
                ],
                achievements: [
                    'Présentation à la Fashion Week de Dakar 2022',
                    'Collection capsule pour une marque internationale'
                ]
            },
            {
                company: 'Dakar Fashion House',
                position: 'Styliste Senior',
                location: 'Dakar, Sénégal',
                startDate: '2015-09',
                endDate: '2019-02',
                description: [
                    'Création de collections prêt-à-porter',
                    'Supervision des productions',
                    'Formation des jeunes stylistes'
                ]
            }
        ],
        education: [
            {
                school: 'ESMOD Paris',
                degree: 'Master',
                field: 'Fashion Design',
                startDate: '2013',
                endDate: '2015',
                description: 'Spécialisation en mode éthique'
            },
            {
                school: 'Institut Supérieur des Arts de Dakar',
                degree: 'Licence',
                field: 'Design de Mode',
                startDate: '2010',
                endDate: '2013'
            }
        ],
        skills: [
            {
                category: 'Design',
                items: [
                    { name: 'Illustration de mode', level: 5 },
                    { name: 'Patronage', level: 5 },
                    { name: 'Design durable', level: 4 },
                    { name: 'Textile', level: 5 }
                ]
            },
            {
                category: 'Technique',
                items: [
                    { name: 'Adobe Illustrator', level: 4 },
                    { name: 'CLO 3D', level: 4 },
                    { name: 'Photoshop', level: 4 }
                ]
            },
            {
                category: 'Gestion',
                items: [
                    { name: 'Gestion de production', level: 4 },
                    { name: 'Direction artistique', level: 5 },
                    { name: 'Marketing de mode', level: 4 }
                ]
            }
        ],
        languages: [
            { name: 'Français', level: 'Natif' },
            { name: 'Anglais', level: 'Avancé' },
            { name: 'Wolof', level: 'Natif' }
        ],
        certifications: [
            {
                name: 'Certification en Mode Durable',
                issuer: 'Fashion Revolution',
                date: '2021-05'
            },
            {
                name: 'Digital Fashion Pro Certification',
                issuer: 'Fashion Design Institute',
                date: '2020-03'
            }
        ]
    },
    {
        id: 'media-1',
        sector: 'Médias et Communication',
        profile: {
            fullName: 'Ibrahima Diop',
            title: 'Journaliste & Producteur de Contenu Digital',
            email: 'ibrahima.diop@email.com',
            phone: '+221 77 901 23 45',
            location: 'Dakar, Sénégal',
            photo: '/images/cv-templates/profiles/media-profile-1.jpg',
            linkedin: 'linkedin.com/in/ibrahimadiop',
            portfolio: 'ibrahimadiop.com'
        },
        summary: 'Journaliste multimédia avec 10 ans d\'expérience dans la production de contenus digitaux et la couverture de l\'actualité africaine. Expert en storytelling digital et en production de documentaires.',
        experience: [
            {
                company: 'Africa News Network',
                position: 'Rédacteur en Chef Digital',
                location: 'Dakar, Sénégal',
                startDate: '2020-01',
                current: true,
                description: [
                    'Direction de la stratégie éditoriale digitale',
                    'Management d\'une équipe de 12 journalistes',
                    'Production de contenus multimédia innovants'
                ],
                achievements: [
                    'Augmentation de 200% de l\'audience digitale',
                    'Prix du meilleur média digital africain 2022'
                ]
            },
            {
                company: 'Dakar Media Group',
                position: 'Journaliste Senior',
                location: 'Dakar, Sénégal',
                startDate: '2016-03',
                endDate: '2019-12',
                description: [
                    'Production de reportages et documentaires',
                    'Couverture d\'événements internationaux',
                    'Animation d\'émissions d\'actualité'
                ]
            }
        ],
        education: [
            {
                school: 'Sciences Po Paris',
                degree: 'Master',
                field: 'Journalisme',
                startDate: '2014',
                endDate: '2016',
                description: 'Spécialisation en journalisme numérique'
            },
            {
                school: 'CESTI Dakar',
                degree: 'Licence',
                field: 'Sciences de l\'Information',
                startDate: '2011',
                endDate: '2014'
            }
        ],
        skills: [
            {
                category: 'Journalisme',
                items: [
                    { name: 'Rédaction', level: 5 },
                    { name: 'Investigation', level: 5 },
                    { name: 'Fact-checking', level: 5 },
                    { name: 'Interview', level: 5 }
                ]
            },
            {
                category: 'Production Multimédia',
                items: [
                    { name: 'Montage vidéo', level: 4 },
                    { name: 'Podcast', level: 4 },
                    { name: 'Photojournalisme', level: 4 }
                ]
            },
            {
                category: 'Digital',
                items: [
                    { name: 'SEO', level: 4 },
                    { name: 'Analytics', level: 4 },
                    { name: 'Réseaux sociaux', level: 5 }
                ]
            }
        ],
        languages: [
            { name: 'Français', level: 'Natif' },
            { name: 'Anglais', level: 'Avancé' },
            { name: 'Wolof', level: 'Natif' },
            { name: 'Arabe', level: 'Intermédiaire' }
        ],
        certifications: [
            {
                name: 'Google News Initiative',
                issuer: 'Google',
                date: '2022-01'
            },
            {
                name: 'Certification en Journalisme de Données',
                issuer: 'DataJournalism.com',
                date: '2021-06'
            }
        ]
    }
];
//# sourceMappingURL=cv-templates.js.map