import { Request, Response } from "express";

export class AuthController {

    // TODO: DI
    constructor() {

    }

    public login = ( req: Request, res: Response ) => {
        res.status(200).json({ msg: 'login' })
    }

    public registerUser = ( req: Request, res: Response ) => {
        res.status(200).json({ msg: 'register' })
    }

    public renewToken = ( req: Request, res: Response ) => {
        res.status(200).json({ msg: 'renewToken' })
    }


}
