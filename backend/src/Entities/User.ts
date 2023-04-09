import {AutoIncrement, entity, MinLength, PrimaryKey, Unique} from "@deepkit/type";

@entity.name('user')
export class User {
    id: number & PrimaryKey & AutoIncrement = 0;

    constructor(
        public username: string & MinLength<3> & Unique
    ) {
    }

}
