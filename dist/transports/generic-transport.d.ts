export declare abstract class GenericTransportService {
    constructor();
    abstract writeRead(address: string, endpoint: string, data: any, returnType: 'binary' | 'json'): Promise<any>;
}
