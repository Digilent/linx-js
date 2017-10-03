"use strict";
var http_transport_1 = require('../transports/http-transport');
var ConnectionHandlerService = (function () {
    function ConnectionHandlerService() {
        console.log('ConnectionHandlerService constructor');
        this.transport = new http_transport_1.HttpTransportService();
    }
    ConnectionHandlerService.prototype.setHttpTransport = function () {
        this.transport = new http_transport_1.HttpTransportService();
        this.transportType = 'http';
    };
    return ConnectionHandlerService;
}());
exports.ConnectionHandlerService = ConnectionHandlerService;
//# sourceMappingURL=connection-handler.js.map