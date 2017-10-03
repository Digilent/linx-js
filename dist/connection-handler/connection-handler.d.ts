import { GenericTransportService } from '../transports/generic-transport';
export declare class ConnectionHandlerService {
    transport: GenericTransportService;
    transportType: 'http';
    constructor();
    setHttpTransport(): void;
}
