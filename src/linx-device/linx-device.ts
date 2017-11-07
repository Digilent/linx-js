import { GenericLinxDevice, GenericTransport, Return } from '@digilent/linx-device-js';
import { HttpTransportService } from '../transports/http-transport';

export class LinxDevice extends GenericLinxDevice {
    protected transport: GenericTransport;

    constructor() {
        super();
    }

    open(connectionType: 'http', params: HttpParameters): Return.Default {
        let transport: GenericTransport;
        switch(connectionType) {
            case 'http':
                if (params.address == undefined || params.endpoint == undefined) { 
                    return {
                        message: 'invalid parameters',
                        statusCode: 1
                    };
                }
                this.transport = new HttpTransportService(params.address, params.endpoint);
                break;
            default:
                return {
                    message: 'invalid connection type',
                    statusCode: 1
                };
        }
        return {
            message: 'ok',
            statusCode: 0
        }
    }

    close() {

    }
}

export interface HttpParameters {
    address: string,
    endpoint: string
}