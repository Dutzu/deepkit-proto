import {BaseEvent, DataEvent, EventToken} from '@deepkit/event';
import {User} from "../Entities/User";

export class UserEvent extends BaseEvent {
    constructor(public user: User) {
        super();
    }
}

export const UserAdded = new EventToken('user-added', DataEvent<User>)
