import { rpc } from '@deepkit/rpc';
import { Observable, Subject } from 'rxjs';
import {eventDispatcher} from "@deepkit/event";
import {UserAdded} from "../events/UserEvent";
import {User} from "../Entities/User";
import {SQLiteDatabase} from "../db/database";

@rpc.controller('test-rpc')
export class RpcController {
    _subject = new Subject<User>();

    constructor(protected database: SQLiteDatabase) {
    }

    @eventDispatcher.listen(UserAdded)
    onUserAdded(event: typeof UserAdded.event) {
        console.log('User added!', event.data.username);
        this._subject.next(event.data);
    }

    @rpc.action()
    async getAllUsers(): Promise<User[]> {
        return await this.database.query(User).find();
    }

    @rpc.action()
    async getUserById(id: number): Promise<User> {
        return await this.database.query(User).filter({id}).findOne();
    }

    @rpc.action()
    users(): Subject<User> {
        this._subject = new Subject<User>();
        // setTimeout(() => {
        //     this._subject.complete();
        // }, 10_000);

        setTimeout(() => {
            this._subject.next(new User('New Subscriber!'));
        }, 1000);

        return this._subject;
    }

    @rpc.action()
    hello(title: string): string {
        return 'Hello ' + title;
    }

    @rpc.action()
    timesSubject(): Subject<Date> {
        const subject = new Subject<Date>();

        const interval = setInterval(() => {
            subject.next(new Date);
        }, 1000);

        setTimeout(() => {
            subject.complete();
        }, 10_000);

        subject.subscribe().add(() => {
            clearTimeout(interval);
        });

        return subject;
    }

    @rpc.action()
    timesObservable(): Observable<Date> {
        return new Observable((observer) => {
            const interval = setInterval(() => {
                observer.next(new Date);
            }, 1000);

            setTimeout(() => {
                observer.complete();
                clearTimeout(interval);
            }, 10_000);

            return {
                unsubscribe() {
                    clearTimeout(interval);
                }
            };
        });
    }

}
