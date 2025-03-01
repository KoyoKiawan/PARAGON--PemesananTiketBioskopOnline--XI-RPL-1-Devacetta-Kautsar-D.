const express = require('express');
const movieController = require('../controllers/movie.Controller');
const checkAuth = require('../middleware/check-auth');
const router = express.Router();
const upload = require('../middleware/upload');

router.post('/', checkAuth.checkAuth,upload.single('poster_url'), movieController.save); // Admin only
router.get('/', movieController.index); // Public
router.get('/:id', movieController.show); // Public
router.patch('/:id', checkAuth.checkAuth, movieController.update); // Admin only
router.delete('/:id', checkAuth.checkAuth, movieController.destroy); // Admin only

module.exports = router;
