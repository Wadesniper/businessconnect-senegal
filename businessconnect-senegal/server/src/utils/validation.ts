import { Request, Response, NextFunction } from 'express';
import validator from 'express-validator';
import { ApiResponse } from '../types/global';

export interface ValidationError {
  field: string;
  message: string;
  code?: string;
  location?: string;
}

const { validationResult, body } = validator;

export const validateRequest = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors: ValidationError[] = errors.array().map((error: any) => ({
      field: error.param,
      message: error.msg
    }));

    res.status(400).json({
      success: false,
      errors: formattedErrors
    } as ApiResponse<null>);
    return;
  }
  next();
};

export const registerValidation = [
  body('email').isEmail().withMessage('Email invalide'),
  body('password').isLength({ min: 6 }).withMessage('Le mot de passe doit contenir au moins 6 caractères'),
  body('firstName').notEmpty().withMessage('Le prénom est requis'),
  body('lastName').notEmpty().withMessage('Le nom est requis')
];

export const loginValidation = [
  body('email').isEmail().withMessage('Email invalide'),
  body('password').notEmpty().withMessage('Le mot de passe est requis')
];

export const forgotPasswordValidation = [
  body('email').isEmail().withMessage('Email invalide')
];

export const updateProfileValidation = [
  body('firstName').optional().notEmpty().withMessage('Le prénom ne peut pas être vide'),
  body('lastName').optional().notEmpty().withMessage('Le nom ne peut pas être vide'),
  body('phoneNumber').optional().matches(/^\+?[1-9]\d{1,14}$/).withMessage('Numéro de téléphone invalide')
];

export const changePasswordValidation = [
  body('currentPassword').notEmpty().withMessage('Le mot de passe actuel est requis'),
  body('newPassword').isLength({ min: 6 }).withMessage('Le nouveau mot de passe doit contenir au moins 6 caractères')
];

export const createFormationValidation = [
  body('title').notEmpty().withMessage('Le titre est requis'),
  body('description').notEmpty().withMessage('La description est requise'),
  body('price').isNumeric().withMessage('Le prix doit être un nombre'),
  body('duration').isNumeric().withMessage('La durée doit être un nombre'),
  body('level').isIn(['beginner', 'intermediate', 'advanced']).withMessage('Niveau invalide'),
  body('category').notEmpty().withMessage('La catégorie est requise')
];

export const updateFormationValidation = [
  body('title').optional().notEmpty().withMessage('Le titre ne peut pas être vide'),
  body('description').optional().notEmpty().withMessage('La description ne peut pas être vide'),
  body('price').optional().isNumeric().withMessage('Le prix doit être un nombre'),
  body('duration').optional().isNumeric().withMessage('La durée doit être un nombre'),
  body('level').optional().isIn(['beginner', 'intermediate', 'advanced']).withMessage('Niveau invalide'),
  body('category').optional().notEmpty().withMessage('La catégorie ne peut pas être vide')
];

export const createSubscriptionValidation = [
  body('type').isIn(['basic', 'premium', 'enterprise']).withMessage('Type d\'abonnement invalide'),
  body('duration').isNumeric().withMessage('La durée doit être un nombre')
];

export const updateSubscriptionValidation = [
  body('type').optional().isIn(['basic', 'premium', 'enterprise']).withMessage('Type d\'abonnement invalide'),
  body('duration').optional().isNumeric().withMessage('La durée doit être un nombre')
];

export const createJobValidation = [
  body('title').notEmpty().withMessage('Le titre est requis'),
  body('company').notEmpty().withMessage('Le nom de l\'entreprise est requis'),
  body('location').notEmpty().withMessage('La localisation est requise'),
  body('type').isIn(['full-time', 'part-time', 'contract', 'internship']).withMessage('Type de contrat invalide'),
  body('description').notEmpty().withMessage('La description est requise'),
  body('requirements').isArray().withMessage('Les prérequis doivent être une liste'),
  body('salary').optional().isNumeric().withMessage('Le salaire doit être un nombre')
];

export const updateJobValidation = [
  body('title').optional().notEmpty().withMessage('Le titre ne peut pas être vide'),
  body('company').optional().notEmpty().withMessage('Le nom de l\'entreprise ne peut pas être vide'),
  body('location').optional().notEmpty().withMessage('La localisation ne peut pas être vide'),
  body('type').optional().isIn(['full-time', 'part-time', 'contract', 'internship']).withMessage('Type de contrat invalide'),
  body('description').optional().notEmpty().withMessage('La description ne peut pas être vide'),
  body('requirements').optional().isArray().withMessage('Les prérequis doivent être une liste'),
  body('salary').optional().isNumeric().withMessage('Le salaire doit être un nombre')
]; 