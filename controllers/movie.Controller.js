const validator = require('fastest-validator');
const models = require('../models');
const upload = require('../middleware/upload');


function save(req, res) {
    
    if (!req.file) {
        return res.status(400).json({ message: "Poster is required" });
    }

    const movies = {
        title: req.body.title,
        description: req.body.description,
        poster_url: `/uploads/movies/${req.file.filename}`,
        release_date: new Date(req.body.release_date),
        duration: parseInt(req.body.duration, 10)
    };

    
    const schema = {
        title: { type: "string", optional: false, max: "100" },
        description: { type: "string", optional: false, max: "500" },
        poster_url: { type: "string", optional: true },
        release_date: { type: "date", optional: false },
        duration: { type: "number", integer: true, optional: false }
    };

    const v = new validator();
    const validationResponse = v.validate(movies, schema);

    if (validationResponse !== true) {
        return res.status(400).json({
            message: "Validation failed",
            errors: validationResponse
        });
    }

    models.movies.create(movies)
        .then(result => {
            res.status(201).json({
                message: "Movie created successfully",
                movie: result
            });
        })
        .catch(error => {
            res.status(500).json({
                message: "Something went wrong",
                error: error.message
            });
        });
}

function show(req,res){
    const id = req.params.id;
    
    models.movies.findByPk(id).then(result=>{
        if(result){
            res.status(200).json(result);
        }else{
            res.status(500).json({
                message:"Movie not found!"
            })
        }
        
    }).catch(error=>{
        res.status(500).json({
            message:"Something went wrong!"
        })
    });
}

function index(req,res){
    models.movies.findAll().then(result=>{
        if(result){
            res.status(200).json(result);
        }else{
            res.status(500).json({
                message:"Something went wrong!"
            })
        }
        
    }).catch(error=>{
        res.status(500).json({
            message:"Something went wrong!"
        })
    });
}

function update(req,res){
    upload.single('poster_url')(req, res, function (err) {
        if (err) {
            return res.status(400).json({ message: err.message });
        }

    const id = req.params.id;
    const updatedmovie = {
        title: req.body.title,
        description: req.body.description,
        poster_url: req.file ? `/uploads/movies/${req.file.filename}` : null,
        release_date: new Date(req.body.release_date),
        duration: parseInt(req.body.duration, 10)
    }

    const schema ={
        title: { type: "string", optional: false, max: "100" },
        description: { type: "string", optional: false, max: "500" },
        poster_url: { type: "string", optional: false },
        release_date: {type:"date",optional: false },
        duration: { type: "number", integer: true, optional: false }
    }

    const v = new validator();
    const validationResponse = v.validate(updatedmovie,schema);

    if(validationResponse !== true){
        return res.status(400).json({
            message:"Validation failed",
            errors: validationResponse
        });
    }

    models.movies.update(updatedmovie,{where:{id:id}}).then(result=>{
        if(result){
            res.status(200).json({
                message:"Movie updated successfully",
                movie:updatedmovie
            })
        }else{
            res.status(500).json({
                message:"Something went wrong!",
                error:error
            })
        }
        
    }).catch(error=>{
        res.status(500).json({
            message:"Something went wrong!",
            error:error
        })
    })
})
}

function destroy(req,res){
    const id = req.params.id;

    models.movies.destroy({where:{id:id}}).then(result=>{
        if(result){
            res.status(200).json({
                message:"Movie deleted successfully"
            })
        }else{
            res.status(500).json({
            message:"Something went wrong!"})
        }
        
    }).catch(error=>{
        res.status(500).json({
            message:"Something went wrong!",
            error:error
        })
    });
}

module.exports = {
    save: save,
    show:show,
    index:index,
    update:update,
    destroy:destroy
}