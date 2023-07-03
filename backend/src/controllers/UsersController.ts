import {http, HttpBody, HttpNotFoundError} from '@deepkit/http';
import {DataEvent, EventDispatcher} from '@deepkit/event';
import {ExternalServiceProvider} from "../providers/externalServiceProvider";
import {User} from "../Entities/User";
import {UserAdded} from "../events/UserEvent";
import {faker} from "@faker-js/faker";
import {SQLiteDatabase} from "../db/database";

@http.controller('/users')
export class UsersController {
    constructor(private externalService: ExternalServiceProvider, protected eventDispatcher: EventDispatcher, protected database: SQLiteDatabase) {
    }

    @http.GET('/external')
    public async getExternal() {
        return this.externalService.externalFunction();
    }

    @http.GET('/')
    public async getAll() {
        return this.database.query(User).find();
    }

    @http.GET('/:id')
    public async getUser(id: number) {
        return await this.database.query(User).filter({id}).findOne();
    }

    @http.POST('/')
    public async createUser() {
        const newUser = new User('John' + Math.random(), faker.name.fullName(), faker.internet.email());
        console.log(JSON.stringify(newUser));
        await this.eventDispatcher.dispatch(UserAdded, new DataEvent<User>(newUser))
        return newUser;
    }

    @http.POST('/load')
    public async createFakeUsers() {
        await this.database.migrate();
        //using faker create 1000 users with fake generated names and store them in the db
        const userCreationPromises = [];
        for (let i = 0; i < 1000; i++) {
            const newUser = new User(faker.internet.userName() + Math.random(), faker.name.fullName(), faker.internet.email());
            console.log(i + ' saving user ' + JSON.stringify(newUser));
            userCreationPromises.push(this.database.persist(newUser));
        }
        await Promise.all(userCreationPromises);
    }

    @http.PUT('/:id')
    public async updateUser(id: number, body: HttpBody<User>) {
        console.log(body);
        const existingUser = await this.database.query(User).filter({id});
        if (!existingUser) {
            throw new HttpNotFoundError('User not found');
        }
        return await existingUser.returning('id','username', 'email', 'name').patchOne(body);
    }

    @http.DELETE('/:id')
    public async deleteUser(id: string) {
        return {name: 'John'};
    }
}
