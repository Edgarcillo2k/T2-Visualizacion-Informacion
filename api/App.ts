import express, { Response, Request } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import { createServer, Server } from 'http';
import util from 'util';
//@ts-ignore
import { loadNuxt, build } from 'nuxt';
import nuxtConfig from '../nuxt.config.js';
import fs from "fs";
import mm from "musicmetadata";

class App {
    private app: express.Application;
    private httpServer!: Server;

    constructor(){
        this.app = express();
        this.configMiddlewares();
        this.configRoutes();
        this.configNuxt();
        this.httpServer = createServer(this.app);
        this.httpServer.listen(3000);
    }

    private configMiddlewares(){
        this.app.use(morgan('tiny'));
        this.app.use(express.json());
        this.app.use(cors());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(express.static(path.join(__dirname,'public')));
    }

    private configRoutes(){
        this.app.get('/api/music', async (req: Request, res: Response) => {
            try{
                const files = fs.readdirSync(path.join(__dirname,'/assets/musica'));
                const response: any[] = [];
                const promise = util.promisify(mm);
                for (const file of files) {
                    const result = await promise(fs.createReadStream(path.join(__dirname,'/assets/musica',file)));
                    response.push(result);
                }
                return res.status(200).json({files: response});
            }
            catch(error){
                console.log(error);
                return res.status(500).json(error);
            }
        });
    }

    private async configNuxt(){
        // We instantiate Nuxt.js with the options
        const nuxt = await loadNuxt(nuxtConfig.dev ? 'dev' : 'start');

        // Build only in dev mode
        if (nuxtConfig.dev)
            build(nuxt);

        this.app.use(nuxt.render)
    }
}

export default new App();