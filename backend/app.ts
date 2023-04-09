#!/usr/bin/env ts-node-script
import { App } from '@deepkit/app';
import { Logger } from '@deepkit/logger';
import { cli, Command } from '@deepkit/app';
import { FrameworkModule } from '@deepkit/framework';
import {UsersController} from "./src/controllers/UsersController";
import {ExternalServiceProvider} from "./src/providers/externalServiceProvider";
import {http} from "@deepkit/http";
import {RpcController} from "./src/controllers/rpc.controller";
import {SQLiteDatabase} from "./src/db/database";
import { ApiConsoleModule } from '@deepkit/api-console-module';
import { OrmBrowserModule } from '@deepkit/orm-browser-module';
import { OpenAPIModule } from 'deepkit-openapi';
import {Config} from "./config";

@http.controller('/')
class MyWebsite {
    constructor() {
    }
    @http.GET().name('hello')
    helloWorld() {
        return 'Hello from cucu';
    }
}


@cli.controller('test')
export class TestCommand implements Command {
    constructor(protected logger: Logger) {
    }

    async execute() {
        this.logger.log('Hello World!');
    }
}

new App({
    config: Config,
    controllers: [TestCommand,RpcController,MyWebsite,UsersController],
    providers: [ExternalServiceProvider, SQLiteDatabase],
    listeners: [RpcController],
    imports: [
    new FrameworkModule({
        httpLog: true,
        debug: true,
        host: 'localhost',
    }),
    new OpenAPIModule({ prefix: '/openapi/' }),
    new OrmBrowserModule({ path: '/data' }),
    new ApiConsoleModule({ path: '/api' })],
}).run();
