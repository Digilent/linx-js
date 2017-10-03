"use strict";
var connection_handler_1 = require('../connection-handler/connection-handler');
var linx_device_1 = require('../linx-device/linx-device');
var LinxAgent = (function () {
    function LinxAgent(agentAddress) {
        this.devices = [];
        console.log('AgentService constructor');
        this.connectionHandlerService = new connection_handler_1.ConnectionHandlerService();
        if (agentAddress.indexOf('http://') === -1 && agentAddress.indexOf('https://') === -1) {
            this.agentAddress = 'http://' + agentAddress;
        }
        else {
            this.agentAddress = agentAddress;
        }
    }
    LinxAgent.prototype.genericResponseHandler = function (endpoint, commandObject) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.connectionHandlerService.transport.writeRead(_this.agentAddress, endpoint, JSON.stringify(commandObject), 'json')
                .then(function (jsonString) {
                var data;
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
                data.agent.forEach(function (val, index, array) {
                    if (val.statusCode == undefined || val.statusCode !== 0) {
                        reject(data);
                        return;
                    }
                });
                resolve(data);
            })
                .catch(function (e) {
                reject(e);
            });
        });
    };
    LinxAgent.prototype.enumerateDevices = function () {
        var command = {
            agent: [
                {
                    command: 'enumerateDevices'
                }
            ]
        };
        return this.genericResponseHandler('/config', command);
    };
    LinxAgent.prototype.getAgentInfo = function () {
        var command = {
            agent: [
                {
                    command: "getInfo"
                }
            ]
        };
        return this.genericResponseHandler('/config', command);
    };
    LinxAgent.prototype.getActiveDevice = function () {
        var command = {
            agent: [
                {
                    command: "getActiveDevice"
                }
            ]
        };
        return this.genericResponseHandler('/config', command);
    };
    LinxAgent.prototype.setActiveDevice = function (device) {
        var _this = this;
        var command = {
            agent: [
                {
                    command: "setActiveDevice",
                    device: device
                }
            ]
        };
        return new Promise(function (resolve, reject) {
            _this.genericResponseHandler('/config', command)
                .then(function (data) {
                _this.devices.push(new linx_device_1.LinxDevice(_this.agentAddress));
                _this.activeDeviceIndex = _this.devices.length - 1;
                _this.activeDevice = _this.devices[_this.activeDeviceIndex];
                resolve(data);
            })
                .catch(function (e) {
                reject(e);
            });
        });
    };
    LinxAgent.prototype.releaseActiveDevice = function () {
        var command = {
            agent: [
                {
                    command: "releaseActiveDevice"
                }
            ]
        };
        return this.genericResponseHandler('/config', command);
    };
    return LinxAgent;
}());
exports.LinxAgent = LinxAgent;
//# sourceMappingURL=linx-agent.js.map