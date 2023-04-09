import {Thing} from "../types/external-service/Thing";

export class ExternalServiceProvider{
    externalFunction():Thing {
        return new Thing('thing', 'thing description');
    }
}
