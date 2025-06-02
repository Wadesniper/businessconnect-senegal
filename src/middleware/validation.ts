import { check } from 'express-validator';

export const userValidation = {
  create: [
    check('firstName')
      .notEmpty()
      .withMessage('Le prénom est requis')
      .isLength({ min: 2 })
      .withMessage('Le prénom doit contenir au moins 2 caractères'),
    
    check('lastName')
      .notEmpty()
      .withMessage('Le nom est requis')
      .isLength({ min: 2 })
      .withMessage('Le nom doit contenir au moins 2 caractères'),
    
    check('email')
      .notEmpty()
      .withMessage('L\'email est requis')
      .isEmail()
      .withMessage('Email invalide'),
    
    check('phone')
      .notEmpty()
      .withMessage('Le numéro de téléphone est requis')
      .matches(/^\+?[1-9]\d{1,14}$/)
      .withMessage('Numéro de téléphone invalide'),
    
    check('password')
      .notEmpty()
      .withMessage('Le mot de passe est requis')
      .isLength({ min: 6 })
      .withMessage('Le mot de passe doit contenir au moins 6 caractères'),
    
    check('role')
      .notEmpty()
      .withMessage('Le rôle est requis')
      .isIn(['admin', 'etudiant', 'annonceur', 'employeur'])
      .withMessage('Rôle invalide')
  ],

  update: [
    check('firstName')
      .optional()
      .isLength({ min: 2 })
      .withMessage('Le prénom doit contenir au moins 2 caractères'),
    
    check('lastName')
      .optional()
      .isLength({ min: 2 })
      .withMessage('Le nom doit contenir au moins 2 caractères'),
    
    check('email')
      .optional()
      .isEmail()
      .withMessage('Email invalide'),
    
    check('phone')
      .optional()
      .matches(/^\+?[1-9]\d{1,14}$/)
      .withMessage('Numéro de téléphone invalide'),
    
    check('password')
      .optional()
      .isLength({ min: 6 })
      .withMessage('Le mot de passe doit contenir au moins 6 caractères'),
    
    check('role')
      .optional()
      .isIn(['admin', 'etudiant', 'annonceur', 'employeur'])
      .withMessage('Rôle invalide')
  ]
}; 