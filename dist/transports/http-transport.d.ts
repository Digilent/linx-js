import { GenericTransport } from '@digilent/linx-device-js';
export declare class HttpTransportService extends GenericTransport {
    address: string;
    endpoint: string;
    start: number;
    finish: number;
    constructor(address: string, endpoint: string);
    writeRead(data: any): Promise<any>;
}
