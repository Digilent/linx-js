import { ConnectionHandlerService } from '../connection-handler/connection-handler';
import { LinxDevice } from '../linx-device/linx-device';
export declare class LinxAgent {
    agentAddress: string;
    connectionHandlerService: ConnectionHandlerService;
    devices: LinxDevice[];
    activeDevice: LinxDevice;
    activeDeviceIndex: number;
    constructor(agentAddress: string);
    private genericResponseHandler(endpoint, commandObject);
    enumerateDevices(): Promise<any>;
    getAgentInfo(): Promise<any>;
    getActiveDevice(): Promise<any>;
    setActiveDevice(device: string): Promise<any>;
    releaseActiveDevice(): Promise<any>;
}
