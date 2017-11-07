"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var linx_device_js_1 = require('@digilent/linx-device-js');
var HttpTransportService = (function (_super) {
    __extends(HttpTransportService, _super);
    function HttpTransportService(address, endpoint) {
        _super.call(this);
        this.address = address;
        this.endpoint = endpoint;
        this.start = 0;
        this.finish = 0;
        console.log('HttpTransportService constructor');
    }
    HttpTransportService.prototype.writeRead = function (data) {
        var _this = this;
        var uri = this.address + this.endpoint;
        console.log(uri);
        return new Promise(function (resolve, reject) {
            var XHR = new XMLHttpRequest();
            XHR.addEventListener("load", function (event) {
                console.log(event.currentTarget.response);
                _this.finish = performance.now();
                console.log('FLIGHT TIME: ' + (_this.finish - _this.start));
                resolve(event.currentTarget.response);
            });
            XHR.addEventListener("error", function (event) {
                reject(event);
            });
            XHR.addEventListener("timeout", function (event) {
                reject(event);
            });
            // We set up our request
            try {
                XHR.open("POST", uri);
                XHR.timeout = 5000;
                XHR.responseType = 'arraybuffer';
                _this.start = performance.now();
                XHR.send(data);
            }
            catch (err) {
                reject(event);
            }
        });
    };
    return HttpTransportService;
}(linx_device_js_1.GenericTransport));
exports.HttpTransportService = HttpTransportService;
//# sourceMappingURL=http-transport.js.map