import { Router } from "express";
import { AuthController } from "./auth.controller";
import { AuthService } from "../services/auth.service";

export class AuthRoutes {

    static get routes() {
        const router = Router();
        const controller = new AuthController( new AuthService() );

        router.get('/renew-token', controller.renewToken );
        router.post('/login', controller.login );
        router.post('/register', controller.registerUser );

        return router;
    }

}
