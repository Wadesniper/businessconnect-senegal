import { Request, Response, NextFunction } from '../types/custom.express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { UserPayload } from '../types/user';
import { logger } from '../utils/logger';
import { RequestHandler } from 'express';

export const authenticate: RequestHandler = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return (res as Response).status(401).json({ error: 'Token manquant' });
    }

    const decoded = jwt.verify(token, config.JWT_SECRET) as UserPayload;
    req.user = decoded;
    
    next();
  } catch (error) {
    logger.error('Authentication error:', error);
    return (res as Response).status(401).json({ error: 'Token invalide' });
  }
};

export const isAdmin: RequestHandler = (req, res, next) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return (res as Response).status(403).json({
        success: false,
        message: 'Accès non autorisé. Utilisateur non authentifié ou privilèges administrateur requis.'
      });
    }
    next();
  } catch (error) {
    logger.error('Erreur de vérification admin:', error);
    return (res as Response).status(500).json({
      success: false,
      message: 'Erreur lors de la vérification des privilèges'
    });
  }
};

export const isEmployeur: RequestHandler = (req, res, next) => {
  try {
    if (!req.user || req.user.role !== 'employeur') {
      return (res as Response).status(403).json({
        success: false,
        message: 'Accès non autorisé. Utilisateur non authentifié ou privilèges employeur requis.'
      });
    }
    next();
  } catch (error) {
    logger.error('Erreur de vérification employeur:', error);
    return (res as Response).status(500).json({
      success: false,
      message: 'Erreur lors de la vérification des privilèges'
    });
  }
};

export const isAnnonceur: RequestHandler = (req, res, next) => {
  try {
    if (!req.user || req.user.role !== 'annonceur') {
      return (res as Response).status(403).json({
        success: false,
        message: 'Accès non autorisé. Utilisateur non authentifié ou privilèges annonceur requis.'
      });
    }
    next();
  } catch (error) {
    logger.error('Erreur de vérification annonceur:', error);
    return (res as Response).status(500).json({
      success: false,
      message: 'Erreur lors de la vérification des privilèges'
    });
  }
};

export const isEtudiant: RequestHandler = (req, res, next) => {
  try {
    if (!req.user || req.user.role !== 'etudiant') {
      return (res as Response).status(403).json({
        success: false,
        message: 'Accès non autorisé. Utilisateur non authentifié ou privilèges étudiant requis.'
      });
    }
    next();
  } catch (error) {
    logger.error('Erreur de vérification étudiant:', error);
    return (res as Response).status(500).json({
      success: false,
      message: 'Erreur lors de la vérification des privilèges'
    });
  }
};

export { authenticate as default }; 