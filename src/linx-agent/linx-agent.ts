import { ConnectionHandlerService } from '../connection-handler/connection-handler';
import { LinxDevice } from '../linx-device/linx-device';

export class LinxAgent {
    public agentAddress: string;
    public connectionHandlerService: ConnectionHandlerService;
    public devices: LinxDevice[] = [];
    public activeDevice: LinxDevice;
    public activeDeviceIndex: number;

    constructor(agentAddress: string) {
        console.log('AgentService constructor');
        this.connectionHandlerService = new ConnectionHandlerService();
        if (agentAddress.indexOf('http://') === -1 && agentAddress.indexOf('https://') === -1) {
            this.agentAddress = 'http://' + agentAddress;
        }
        else {
            this.agentAddress = agentAddress;
        }
    }

    private genericResponseHandler(endpoint: string, commandObject: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this.connectionHandlerService.transport.writeRead(this.agentAddress, endpoint, JSON.stringify(commandObject), 'json')
                .then((jsonString) => {
                    let data;
                    try {
                        data = JSON.parse(jsonString);
                    }
                    catch (e) {
                        reject(e);
                        return;
                    }
                    if (data == undefined || data.agent == undefined) {
                        reject(data);
                        return;
                    }
                    data.agent.forEach((val, index, array) => {
                        if (val.statusCode == undefined || val.statusCode !== 0) {
                            reject(data);
                            return;
                        }
                    });
                    resolve(data);
                })
                .catch((e) => {
                    reject(e);
                });
        });
    }

    enumerateDevices(): Promise<any> {
        let command = {
            agent: [
                {
                    command: 'enumerateDevices'
                }
            ]
        };
        return this.genericResponseHandler('/config', command);
    }

    getAgentInfo(): Promise<any> {
        let command = {
            agent: [
                {
                    command: "getInfo"
                }
            ]
        };
        return this.genericResponseHandler('/config', command);
    }

    getActiveDevice(): Promise<any> {
        let command = {
            agent: [
                {
                    command: "getActiveDevice"
                }
            ]
        };
        return this.genericResponseHandler('/config', command);
    }

    setActiveDevice(device: string): Promise<any> {
        let command = {
            agent: [
                {
                    command: "setActiveDevice",
                    device: device
                }
            ]
        };
        return new Promise((resolve, reject) => {
            this.genericResponseHandler('/config', command)
                .then((data) => {
                    this.devices.push(new LinxDevice(this.agentAddress));
                    this.activeDeviceIndex = this.devices.length - 1;
                    this.activeDevice = this.devices[this.activeDeviceIndex];
                    resolve(data);
                })
                .catch((e) => {
                    reject(e);
                });
        });
    }

    releaseActiveDevice(): Promise<any> {
        let command = {
            agent: [
                {
                    command: "releaseActiveDevice"
                }
            ]
        };
        return this.genericResponseHandler('/config', command);
    }

}