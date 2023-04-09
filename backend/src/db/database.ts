import {Config} from "../../config";
import { SQLiteDatabaseAdapter } from '@deepkit/sqlite';
import { Database } from '@deepkit/orm';
import {User} from "../Entities/User";

export class SQLiteDatabase extends Database {
    constructor(dbPath: Config['dbPath']) {
        // super(new MongoDatabaseAdapter('mongodb://localhost/example-app'), [User, Book, Author]);
        super(new SQLiteDatabaseAdapter(dbPath), [User]);
    }
}
