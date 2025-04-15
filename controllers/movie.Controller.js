const validator = require('fastest-validator');
const models = require('../models');
const upload = require('../middleware/upload');
const generateSeats = require('../utils/generateSeats'); // Import the generateSeats function
const v = new validator();
const db = require('../config/db')
async function save(req, res) {
    upload.single("poster_url")(req, res, async function (err) {
        if (err) {
            return res.status(400).json({ message: err.message });
        }

        console.log("Request Body:", req.body);
        console.log("Uploaded File:", req.file);

        if (!req.file) {
            return res.status(400).json({ message: "Image is required" });
        }

        const movies = {
            title: req.body.title,
            poster_url: `/uploads/movies/${req.file.filename}`
        };

        const schema = {
            title: { type: "string", optional: false, max: 100 },
            poster_url: { type: "string", optional: false }
        };

        const validationResponse = v.validate(movies, schema);
        if (validationResponse !== true) {
            return res.status(400).json({ message: "Validation failed", errors: validationResponse });
        }

        try {
            const movie = await models.movies.create({ title, poster_url }); // ✅ Await and store the result
            await generateSeats(movie.id); // ✅ Generate seats using movie.id
            console.log("Seats created for movie:", movie.id);

            res.status(201).json({ message: "Movie created successfully", movie });
        } catch (error) {
            console.error("Error creating movie:", error); // ✅ Better logging
            res.status(500).json({ message: "Something went wrong", error: error.message });
        }
    });
}

function show(req, res) {
    const id = req.params.id;

    models.movies.findByPk(id)
        .then(result => {
            if (!result) {
                return res.status(404).json({ message: "Movie not found!" });
            }
            res.status(200).json(result);
        })
        .catch(error => res.status(500).json({ message: "Something went wrong!", error }));
}

function index(req, res) {
    models.movies.findAll({
        attributes: ['id', 'title', 'poster_url'] // Ensure ID is included
    })
    .then(result => {
        console.log("Fetched Movies:", result);  // ✅ Debugging
        res.status(200).json(result);
    })
    .catch(error => res.status(500).json({ message: "Something went wrong!", error }));
}


function update(req, res) {
    upload.single('file')(req, res, function (err) {
        if (err) {
            return res.status(400).json({ message: err.message });
        }

        const id = req.params.id;
        
        models.movies.findByPk(id)
            .then(existingMovie => {
                if (!existingMovie) {
                    return res.status(404).json({ message: "Movie not found!" });
                }

                const updatedMovie = {
                    title: req.body.title,
                    
                    poster_url: req.file ? `/uploads/movies/${req.file.filename}` : existingMovie.poster_url,
                    release_date: new Date(req.body.release_date),
                    
                };

                return models.movies.update(updatedMovie, { where: { id } })
                    .then(() => res.status(200).json({ message: "Movie updated successfully", movie: updatedMovie }))
                    .catch(error => res.status(500).json({ message: "Something went wrong!", error }));
            })
            .catch(error => res.status(500).json({ message: "Something went wrong!", error }));
    });
}

function destroy(req, res) {
    const id = req.params.id;

    models.movies.destroy({ where: { id } })
        .then(deleted => {
            if (deleted === 0) {
                return res.status(404).json({ message: "Movie not found!" });
            }
            res.status(200).json({ message: "Movie deleted successfully" });
        })
        .catch(error => res.status(500).json({ message: "Something went wrong!", error }));
}
async function getMovieById(req, res) {
    const { id } = req.params;
    try {
        const movie = await models.movies.findOne({ where: { id } });
        if (!movie) {
            return res.status(404).json({ message: "Movie not found" });
        }
        res.json(movie);
    } catch (error) {
        res.status(500).json({ message: "Something went wrong", error });
    }
}


module.exports = { save, show, index, update, destroy,getMovieById };
