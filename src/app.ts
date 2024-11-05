import { JWTAdapter } from "./adapters/jwt.adapter";
import { envs } from "./config/envs";
import { Routes } from "./presentation/routes";
import { Server } from "./presentation/server";


const main = () => {

    const server = new Server({
        port: envs.PORT,
        routes: Routes.routes,
    });

    server.start();
}

( () => {
    main();
})();
