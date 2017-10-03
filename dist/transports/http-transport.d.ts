import { GenericTransportService } from './generic-transport';
export declare class HttpTransportService extends GenericTransportService {
    start: number;
    finish: number;
    constructor();
    writeRead(address: string, endpoint: string, data: any, returnType: 'binary' | 'json'): Promise<any>;
}
