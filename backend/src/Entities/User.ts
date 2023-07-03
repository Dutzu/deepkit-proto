import {AutoIncrement, Email, entity, MaxLength, MinLength, PrimaryKey, Unique} from "@deepkit/type";

@entity.name('user')
export class User {
    id: number & PrimaryKey & AutoIncrement = 0;

    constructor(
        public username: string & MinLength<3> & Unique,
        public name: string & MinLength<2> & MaxLength<30>,
        public email: string & Unique & Email
    ) {
    }

}
