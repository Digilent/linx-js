import { GenericTransport } from '@digilent/linx-device-js';

export class HttpTransportService extends GenericTransport {
    public start = 0;
    public finish = 0;

    constructor(
        public address: string,
        public endpoint: string
    ) {
        super();
        console.log('HttpTransportService constructor');
    }

    writeRead(data: any): Promise<any> {
        let uri = this.address + this.endpoint;
        console.log(uri);
        return new Promise((resolve, reject) => {
            let XHR = new XMLHttpRequest();

            XHR.addEventListener("load", (event: any) => {
                console.log(event.currentTarget.response);
                this.finish = performance.now();
                console.log('FLIGHT TIME: ' + (this.finish - this.start));
                resolve(event.currentTarget.response);
            });
            
            XHR.addEventListener("error", (event) => {
                reject(event);
            });

            XHR.addEventListener("timeout", (event) => {
                reject(event);
            });

            // We set up our request
            try {
                XHR.open("POST", uri);
                XHR.timeout = 5000;
                XHR.responseType = 'arraybuffer';
                this.start = performance.now();
                XHR.send(data);
            }
            catch (err) {
                reject(event);
            }
        });
    }


}