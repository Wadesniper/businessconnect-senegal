import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../types/custom.express.js';
import { UserPayload } from '../types/user.js';
import { config } from '../config.js';
import { logger } from '../utils/logger.js';
import { User } from '../models/User.js';
import jwt from 'jsonwebtoken';
import { RequestHandler } from 'express';

export const authenticate: RequestHandler = (req, res, next) => {
  console.log('MIDDLEWARE AUTH HIT');
  try {
    const authHeader = req.headers.authorization;
    console.log('[DEBUG AUTH] Authorization header:', authHeader);
    const token = authHeader?.split(' ')[1];
    console.log('[DEBUG AUTH] Token extrait:', token);
    if (!token) {
      return (res as Response).status(401).json({ error: 'Token manquant' });
    }
    try {
      const decoded = jwt.verify(token, config.JWT_SECRET) as UserPayload;
      req.user = decoded;
      next();
    } catch (err) {
      console.log('[DEBUG AUTH] Erreur jwt.verify:', err);
      return (res as Response).status(401).json({ error: 'Token invalide' });
    }
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