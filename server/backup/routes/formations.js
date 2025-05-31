"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const formationController_1 = require("../controllers/formationController");
const router = (0, express_1.Router)();
const formationController = new formationController_1.FormationController();
// Route pour obtenir les formations Cursa selon le domaine
router.get('/cursa', formationController.getCursaFormations);
// Route pour obtenir les catégories de formations Cursa
router.get('/categories', formationController.getCategories);
exports.default = router;
