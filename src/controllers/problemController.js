const Problem = require('../models/Problem');

async function getAllProblem(req, res){
    try{
        const problem = await Problem.find().select('title description difficulty tags');
        res.json(problem);
    }catch (err){
        res.status(500).json({error: 'Server error', details: err.message});

    }
}

async function getProblemById(req, res){
    try{
        const problem = await Problem.findById(req.params.id).select('title description testCases');
        if(!problem){
            return res.status(404).json({error: 'Problem not found'});

        }
        res.json(problem);
    }catch(err){
        res.status(500).json({error: 'Server error', detail: err.message});
    }
}

module.exports = {getAllProblem, getProblemById};