import { envs } from "./config/envs";
import { Routes } from "./presentation/routes";
import { Server } from "./presentation/server";


const main = async () => {
    const server = new Server({
        port: envs.PORT,
        routes: Routes.routes,
    });

    server.start();


}

( async () => {
    await main();
})();
