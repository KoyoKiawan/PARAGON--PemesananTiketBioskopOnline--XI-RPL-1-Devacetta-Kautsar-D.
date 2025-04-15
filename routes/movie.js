const express = require('express');
const app = express();
const movieController = require('../controllers/movie.Controller');
const checkAuth = require('../middleware/check-auth');
const router = express.Router();
const upload = require('../middleware/upload');
const { movies } = require('../models'); // ✅ Correct way to import model
const generateSeats = require('../utils/generateSeats');

// ✅ Upload Movie Poster
router.post('/uploads', upload.single('poster_url'), async (req, res) => {
    try {
        
        const { title } = req.body;
        const poster_url = req.file ? `/uploads/movies/${req.file.filename}` : null; // Save correct path
        
        // ✅ Save to database
        const newMovie = await movies.create({ title, poster_url });
        await generateSeats(newMovie.id); // Generate seats for the new movie
        res.status(201).json(newMovie);
    } catch (error) {
        console.error("Error adding movie:", error);
        res.status(500).json({ message: "Failed to add movie" });
    }
});



app.get("/uploads/movies/:filename", (req, res) => {
    const filePath = path.join(__dirname, "uploads/movies", req.params.filename);
    res.sendFile(filePath);
});

// ✅ Movie Routes
router.get('/', movieController.index); // Public
router.get('/:id', movieController.getMovieById); // Public
router.patch('/:id', checkAuth.checkAuth, movieController.update); // Admin only
router.delete('/delete/:id', async (req, res) => {
  const id = req.params.id;

  try {
      const deleted = await movies.destroy({ where: { id } });

      if (deleted === 0) {
          return res.status(404).json({ message: "Movie not found!" });
      }

      res.status(200).json({ message: "Movie deleted successfully" });
  } catch (error) {
      res.status(500).json({ message: "Something went wrong!", error });
  }
});

module.exports = router;
