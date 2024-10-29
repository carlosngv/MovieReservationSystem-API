import { Request, Response } from "express";

export class MoviesController {

    // TODO: DI
    constructor() {

    }

    public getMovie = ( req: Request, res: Response ) => {
        const { id } = req.params;
        res.status(200).json({ msg: 'getMovie ' + id })
    }

    public getAllMovies = ( req: Request, res: Response ) => {
        res.status(200).json({ msg: 'getAllMovies' })
    }

    public createMovie = ( req: Request, res: Response ) => {
        res.status(200).json({ msg: 'createMovie' })
    }

    public updateMovie = ( req: Request, res: Response ) => {
        const { id } = req.params;
        res.status(200).json({ msg: 'updateMovie ' + id  })
    }

    public deleteMovie = ( req: Request, res: Response ) => {
        const { id } = req.params;
        res.status(200).json({ msg: 'deleteMovie ' + id })
    }


}
