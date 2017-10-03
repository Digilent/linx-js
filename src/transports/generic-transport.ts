export abstract class GenericTransportService {

    constructor() {
        console.log('GenericTransportService constructor');
    }

    abstract writeRead(address: string, endpoint: string, data: any, returnType: 'binary' | 'json'): Promise<any>;

}