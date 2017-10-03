"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var generic_transport_1 = require('./generic-transport');
var HttpTransportService = (function (_super) {
    __extends(HttpTransportService, _super);
    function HttpTransportService() {
        _super.call(this);
        this.start = 0;
        this.finish = 0;
        console.log('HttpTransportService constructor');
    }
    HttpTransportService.prototype.writeRead = function (address, endpoint, data, returnType) {
        var _this = this;
        var uri = address + endpoint;
        console.log(uri);
        return new Promise(function (resolve, reject) {
            var XHR = new XMLHttpRequest();
            // We define what will happen if the data are successfully sent
            XHR.addEventListener("load", function (event) {
                console.log(event.currentTarget.response);
                _this.finish = performance.now();
                console.log('FLIGHT TIME: ' + (_this.finish - _this.start));
                resolve(event.currentTarget.response);
            });
            // We define what will happen in case of error
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
                if (returnType === 'binary') {
                    //Set response type as arraybuffer to receive response as bytes
                    XHR.responseType = 'arraybuffer';
                }
                _this.start = performance.now();
                XHR.send(data);
            }
            catch (err) {
                reject(event);
            }
        });
    };
    return HttpTransportService;
}(generic_transport_1.GenericTransportService));
exports.HttpTransportService = HttpTransportService;
//# sourceMappingURL=http-transport.js.map