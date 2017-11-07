import { LinxDevice, GenericTransport } from '@digilent/linx-device-js';
import { HttpTransportService } from '../transports/http-transport';

export class LinxDeviceManager {

    constructor() { }

    addDevice(address: string, endpoint: string, connectionType: 'http' = 'http'): LinxDevice {
        let transport: GenericTransport;
        switch(connectionType) {
            case 'http':
                transport = new HttpTransportService(address, endpoint);
                break;
            default:
                throw 'invalid connection type';
        }
        return new LinxDevice(transport);
    }
}