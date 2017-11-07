/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

exports.LinxDevice = __webpack_require__(3).LinxDevice;
exports.GenericTransport = __webpack_require__(4).GenericTransport

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__dist_linx_device_manager_linx_device_manager__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__dist_linx_device_manager_linx_device_manager___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__dist_linx_device_manager_linx_device_manager__);

window.LinxDeviceManager = __WEBPACK_IMPORTED_MODULE_0__dist_linx_device_manager_linx_device_manager__["LinxDeviceManager"];

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var linx_device_js_1 = __webpack_require__(0);
var http_transport_1 = __webpack_require__(5);
var LinxDeviceManager = (function () {
    function LinxDeviceManager() {
    }
    LinxDeviceManager.prototype.addDevice = function (address, endpoint, connectionType) {
        if (connectionType === void 0) { connectionType = 'http'; }
        var transport;
        switch (connectionType) {
            case 'http':
                transport = new http_transport_1.HttpTransportService(address, endpoint);
                break;
            default:
                throw 'invalid connection type';
        }
        return new linx_device_js_1.LinxDevice(transport);
    };
    return LinxDeviceManager;
}());
exports.LinxDeviceManager = LinxDeviceManager;
//# sourceMappingURL=linx-device-manager.js.map

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var LinxDevice = (function () {
    function LinxDevice(transport) {
        this.transport = transport;
        this.packetNumber = 0;
    }
    /**************************************************************************
    *   Device
    **************************************************************************/
    /**
     * Sync with LINX device.
     * @return Promise that resolves with an object containing a message and a statusCode
     */
    LinxDevice.prototype.sync = function () {
        var packet = this.generatePacket(this.getPacketSize(), 0);
        return this.genericReturnHandler(packet);
    };
    /**
     * Get LINX device family and id.
     * @return Promise that resolves with an object containing a message, statusCode, deviceFamily, and deviceId
     */
    LinxDevice.prototype.getDeviceId = function () {
        var _this = this;
        var packet = this.generatePacket(this.getPacketSize(), 3);
        return new Promise(function (resolve, reject) {
            _this.sendPacketAndParseResponse(packet)
                .then(function (data) {
                resolve({
                    statusCode: 0,
                    message: 'ok',
                    deviceFamily: data[5],
                    deviceId: data[6]
                });
            })
                .catch(function (err) {
                reject({
                    statusCode: 1,
                    message: err,
                    deviceFamily: null,
                    deviceId: null
                });
            });
        });
    };
    /**
     * Get LINX api version on device.
     * @return Promise that resolves with an object containing a message, statusCode, major, minor, subminor, and build
     */
    LinxDevice.prototype.getLinxApiVersion = function () {
        var _this = this;
        var packet = this.generatePacket(this.getPacketSize(), 4);
        return new Promise(function (resolve, reject) {
            _this.sendPacketAndParseResponse(packet)
                .then(function (data) {
                resolve({
                    statusCode: 0,
                    message: 'ok',
                    major: data[5],
                    minor: data[6],
                    subminor: data[7],
                    build: data[8]
                });
            })
                .catch(function (err) {
                reject({
                    statusCode: 1,
                    message: err,
                    major: null,
                    minor: null,
                    subminor: null,
                    build: null
                });
            });
        });
    };
    /**
     * Get max baud rate for LINX device.
     * @return Promise that resolves with an object containing a message, statusCode, and baudRate
     */
    LinxDevice.prototype.getMaxBaudRate = function () {
        var _this = this;
        var packet = this.generatePacket(this.getPacketSize(), 5);
        return new Promise(function (resolve, reject) {
            _this.sendPacketAndParseResponse(packet)
                .then(function (data) {
                resolve({
                    statusCode: 0,
                    message: 'ok',
                    baudRate: (data[5] & 255) << 24 | (data[6] & 255) << 16 | (data[7] & 255) << 8 | data[8]
                });
            })
                .catch(function (err) {
                reject({
                    statusCode: 1,
                    message: err,
                    baudRate: null
                });
            });
        });
    };
    /**
     * Set the baud rate for the LINX device.
     * @param baudRate the desired baud rate
     * @return Promise that resolves with an object containing a message, statusCode, and actualBaud
     */
    LinxDevice.prototype.setBaudRate = function (baudRate) {
        var _this = this;
        var commandParams = this.numberAsByteArray(baudRate, 4);
        var packet = this.generatePacket(this.getPacketSize(commandParams), 6, commandParams);
        return new Promise(function (resolve, reject) {
            _this.sendPacketAndParseResponse(packet)
                .then(function (data) {
                resolve({
                    statusCode: 0,
                    message: 'ok',
                    actualBaud: (data[4] & 255) << 24 | (data[5] & 255) << 16 | (data[6] & 255) << 8 | data[7]
                });
            })
                .catch(function (err) {
                reject({
                    statusCode: 1,
                    message: err,
                    actualBaud: null
                });
            });
        });
    };
    /**
     * Set the desired userId for the LINX device.
     * @param userId the desired userId
     * @return Promise that resolves with an object containing a message and statusCode
     */
    LinxDevice.prototype.setDeviceUserId = function (userId) {
        var commandParams = this.numberAsByteArray(userId, 2);
        var packet = this.generatePacket(this.getPacketSize(commandParams), 18, commandParams);
        return this.genericReturnHandler(packet);
    };
    /**
     * Set the value for the given key.
     * @return Promise that resolves when the value is set
     */
    LinxDevice.prototype.getDeviceUserId = function () {
        var _this = this;
        var packet = this.generatePacket(this.getPacketSize(), 19);
        return new Promise(function (resolve, reject) {
            _this.sendPacketAndParseResponse(packet)
                .then(function (data) {
                resolve({
                    statusCode: 0,
                    message: 'ok',
                    userId: (data[5] & 255) << 8 | data[6]
                });
            })
                .catch(function (err) {
                reject({
                    statusCode: 1,
                    message: err,
                    userId: null
                });
            });
        });
    };
    /**
     * Get the name of the LINX device.
     * @return Promise that resolves with an object containing a message, statusCode, and deviceName
     */
    LinxDevice.prototype.getDeviceName = function () {
        var _this = this;
        var packet = this.generatePacket(this.getPacketSize(), 36);
        return new Promise(function (resolve, reject) {
            _this.sendPacketAndParseResponse(packet)
                .then(function (data) {
                var deviceName = String.fromCharCode.apply(null, data.slice(5, data.length - 2));
                resolve({
                    statusCode: 0,
                    message: 'ok',
                    deviceName: deviceName
                });
            })
                .catch(function (err) {
                reject({
                    statusCode: 1,
                    message: err,
                    deviceName: null
                });
            });
        });
    };
    /**************************************************************************
    *   Digital
    **************************************************************************/
    /**
     * Gets the valid digital channels.
     * @return Promise that resolves with an object containing a message, statusCode, and chans array
     */
    LinxDevice.prototype.digitalGetChans = function () {
        var _this = this;
        var packet = this.generatePacket(this.getPacketSize(), 8);
        return new Promise(function (resolve, reject) {
            _this.sendPacketAndParseResponse(packet)
                .then(function (data) {
                var digitalChans = [];
                var packetSize = (data[1] << 8) | data[2];
                for (var i = 0; i < packetSize - 6; i++) {
                    digitalChans.push(data[i + 5]);
                }
                resolve({
                    statusCode: 0,
                    message: 'ok',
                    chans: digitalChans
                });
            })
                .catch(function (err) {
                reject({
                    statusCode: 1,
                    message: err,
                    chans: []
                });
            });
        });
    };
    /**
     * Digital write the pinNumber to the desired value.
     * @param pinNumber the pinNumber you want to write
     * @param value the value for this pinNumber
     * @return Promise that resolves with an object containing a message and a statusCode
     */
    LinxDevice.prototype.digitalWrite = function (pinNumber, value) {
        return this.digitalWriteAdvanced(1, [pinNumber], [value]);
    };
    /**
     * Digital write the pinNumbers to the desired values.
     * @param numPins the number of pins you want to write
     * @param pinNumbers the pinNumbers you want to write
     * @param values the values you want to write to the associated pinNumber
     * @return Promise that resolves with an object containing a message and a statusCode
     */
    LinxDevice.prototype.digitalWriteAdvanced = function (numPins, pinNumbers, values) {
        if (pinNumbers.length !== values.length) {
            new Promise(function (resolve, reject) {
                reject({ statusCode: 1, message: 'Invalid write' });
                return;
            });
        }
        var commandParams = new Uint8Array(2 * pinNumbers.length + 1);
        commandParams[0] = numPins & 255;
        for (var i = 0; i < pinNumbers.length; i++) {
            commandParams[i + 1] = pinNumbers[i] & 255;
        }
        for (var i = 0; i < values.length; i++) {
            commandParams[i + 1 + pinNumbers.length] = values[i] ? 1 : 0;
        }
        var packet = this.generatePacket(this.getPacketSize(commandParams), 65, commandParams);
        return this.genericReturnHandler(packet);
    };
    /**
     * Digital read the pinNumber.
     * @param pinNumber the pinNumber you want to read
     * @return Promise that resolves with an object containing a message, statusCode, and value
     */
    LinxDevice.prototype.digitalRead = function (pinNumber) {
        var _this = this;
        var commandParams = new Uint8Array(1);
        commandParams[0] = pinNumber;
        var packet = this.generatePacket(this.getPacketSize(commandParams), 66, commandParams);
        return new Promise(function (resolve, reject) {
            _this.sendPacketAndParseResponse(packet)
                .then(function (data) {
                resolve({
                    statusCode: 0,
                    message: 'ok',
                    value: data[5]
                });
            })
                .catch(function (err) {
                reject({
                    statusCode: 1,
                    message: err,
                    value: null
                });
            });
        });
    };
    /**
     * Digital read the pinNumbers.
     * @param pinNumbers the number of pins you want to read
     * @return Promise that resolves with an object containing a message, statusCode, and values array
     */
    LinxDevice.prototype.digitalReadAdvanced = function (pinNumbers) {
        var _this = this;
        var commandParams = new Uint8Array(pinNumbers);
        var packet = this.generatePacket(this.getPacketSize(commandParams), 66, commandParams);
        return new Promise(function (resolve, reject) {
            _this.sendPacketAndParseResponse(packet)
                .then(function (data) {
                var returnValues = [];
                for (var i = 0; i < data[1] - 6; i++) {
                    returnValues.push(data[i + 5]);
                }
                resolve({
                    statusCode: 0,
                    message: 'ok',
                    values: returnValues
                });
            })
                .catch(function (err) {
                reject({
                    statusCode: 1,
                    message: err,
                    values: null
                });
            });
        });
    };
    /**
     * Digital write square wave on the specified channel, frequency, and duration.
     * @param channel the desired channel
     * @param frequency the desired frequency
     * @param duration the desired duration
     * @return Promise that resolves with an object containing a message and a statusCode
     */
    LinxDevice.prototype.digitalWriteSquareWave = function (channel, frequency, duration) {
        var commandParams = new Uint8Array(9);
        commandParams[0] = channel;
        var frequencyAsU32 = this.numberAsByteArray(frequency, 4);
        var typedDuration = duration == undefined ? new Uint8Array(4) : this.numberAsByteArray(duration, 4);
        commandParams.set(frequencyAsU32, 1);
        commandParams.set(typedDuration, 5);
        var packet = this.generatePacket(this.getPacketSize(commandParams), 67, commandParams);
        return this.genericReturnHandler(packet);
    };
    /**************************************************************************
    *   Analog
    **************************************************************************/
    /**
     * Analog read the pinNumber.
     * @param pinNumber the pinNumber you want to read
     * @return Promise that resolves with an object containing a message, statusCode, and value
     */
    LinxDevice.prototype.analogRead = function (pinNumber) {
        var _this = this;
        var commandParams = new Uint8Array(1);
        commandParams[0] = pinNumber;
        var packet = this.generatePacket(this.getPacketSize(commandParams), 100, commandParams);
        return new Promise(function (resolve, reject) {
            _this.sendPacketAndParseResponse(packet)
                .then(function (data) {
                resolve({
                    statusCode: 0,
                    message: 'ok',
                    value: data[5]
                });
            })
                .catch(function (err) {
                reject({
                    statusCode: 1,
                    message: err,
                    value: null
                });
            });
        });
    };
    /**
     * Analog read the pinNumbers.
     * @param pinNumbers the pinNumbers you want to read
     * @return Promise that resolves with an object containing a message, statusCode, and values array
     */
    LinxDevice.prototype.analogReadAdvanced = function (pinNumbers) {
        var _this = this;
        var commandParams = new Uint8Array(pinNumbers);
        var packet = this.generatePacket(this.getPacketSize(commandParams), 100, commandParams);
        return new Promise(function (resolve, reject) {
            _this.sendPacketAndParseResponse(packet)
                .then(function (data) {
                var returnValues = [];
                for (var i = 0; i < data[1] - 6; i++) {
                    returnValues.push(data[i + 5]);
                }
                resolve({
                    statusCode: 0,
                    message: 'ok',
                    values: returnValues
                });
            })
                .catch(function (err) {
                reject({
                    statusCode: 1,
                    message: err,
                    values: null
                });
            });
        });
    };
    /**
     * Analog write the pinNumber to the desired value.
     * @param pinNumber the pinNumber you want to write
     * @param value the value for this pinNumber
     * @return Promise that resolves with an object containing a message and a statusCode
     */
    LinxDevice.prototype.analogWrite = function (pinNumber, value) {
        return this.analogWriteAdvanced(1, [pinNumber], [value]);
    };
    /**
     * Analog write the pinNumbers to the desired values.
     * @param numPins the number of pins you want to write
     * @param pinNumbers the pinNumbers you want to write
     * @param values the values for the corresponding pinNumbers
     * @return Promise that resolves with an object containing a message and a statusCode
     */
    LinxDevice.prototype.analogWriteAdvanced = function (numPins, pinNumbers, values) {
        if (pinNumbers.length !== values.length) {
            new Promise(function (resolve, reject) {
                reject({ statusCode: 1, message: 'Invalid write' });
                return;
            });
        }
        var commandParams = new Uint8Array(2 * pinNumbers.length + 1);
        commandParams[0] = numPins & 255;
        for (var i = 0; i < pinNumbers.length; i++) {
            commandParams[i + 1] = pinNumbers[i] & 255;
        }
        for (var i = 0; i < values.length; i++) {
            commandParams[i + 1 + pinNumbers.length] = values[i] & 255;
        }
        var packet = this.generatePacket(this.getPacketSize(commandParams), 101, commandParams);
        return this.genericReturnHandler(packet);
    };
    /**************************************************************************
    *   Servo
    **************************************************************************/
    /**
     * Get the valid servo channels.
     * @return Promise that resolves with an object containing a message, statusCode, and channels array
     */
    LinxDevice.prototype.servoGetChannels = function () {
        var _this = this;
        var packet = this.generatePacket(this.getPacketSize(), 8);
        return new Promise(function (resolve, reject) {
            _this.sendPacketAndParseResponse(packet)
                .then(function (data) {
                var channels = [];
                for (var i = 0; i < data[1] - 6; i++) {
                    channels.push(data[i + 5]);
                }
                resolve({
                    statusCode: 0,
                    message: 'ok',
                    channels: channels
                });
            })
                .catch(function (err) {
                reject({
                    statusCode: 1,
                    message: err,
                    channels: null
                });
            });
        });
    };
    /**
     * Open the desired servo channels.
     * @param channels the channels you want to open
     * @return Promise that resolves with an object containing a message and a statusCode
     */
    LinxDevice.prototype.servoOpen = function (channels) {
        var typedChannelNums = new Uint8Array(channels);
        var packet = this.generatePacket(this.getPacketSize(typedChannelNums), 320, typedChannelNums);
        return this.genericReturnHandler(packet);
    };
    /**
     * Set the desired pulse width on the specified servo channel.
     * @param channel the channel you want to configure
     * @param value the desired pulse width
     * @return Promise that resolves with an object containing a message and a statusCode
     */
    LinxDevice.prototype.servoSetPulseWidth = function (channel, value) {
        return this.servoSetPulseWidthAdvanced(1, [channel], [value]);
    };
    /**
     * Set the desired pulse widths on the specified servo channels.
     * @param numChans the number of channels you want to configure
     * @param channels the channels you want to configure
     * @param values the values for the corresponding channels
     * @return Promise that resolves with an object containing a message and a statusCode
     */
    LinxDevice.prototype.servoSetPulseWidthAdvanced = function (numChans, channels, values) {
        if (channels.length !== values.length) {
            new Promise(function (resolve, reject) {
                reject();
                return;
            });
            return;
        }
        var typedChannelNums = new Uint8Array(channels);
        var typedValuesArray = new Uint8Array(values.length * 2);
        for (var i = 0, j = 0; i < values.length; j = j + 2, i++) {
            typedValuesArray[j] = (values[i] >> 8) & 255;
            typedValuesArray[j + 1] = values[i] & 255;
        }
        var combinedArray = new Uint8Array(typedChannelNums.length + typedValuesArray.length + 1);
        combinedArray[0] = numChans & 255;
        combinedArray.set(typedChannelNums, 1);
        combinedArray.set(typedValuesArray, typedChannelNums.length + 1);
        var packet = this.generatePacket(this.getPacketSize(combinedArray), 321, combinedArray);
        return this.genericReturnHandler(packet);
    };
    /**
     * Close the specified servo channels.
     * @param channels the channels you want to close
     * @return Promise that resolves with an object containing a message and a statusCode
     */
    LinxDevice.prototype.servoClose = function (channels) {
        var typedChannelNums = new Uint8Array(channels);
        var packet = this.generatePacket(this.getPacketSize(typedChannelNums), 322, typedChannelNums);
        return this.genericReturnHandler(packet);
    };
    /**************************************************************************
    *   SPI
    **************************************************************************/
    /**
     * Open the specified spi channel.
     * @param channel the channel you want to open
     * @return Promise that resolves with an object containing a message and a statusCode
     */
    LinxDevice.prototype.spiOpen = function (channel) {
        var typedChannelNum = new Uint8Array(1);
        typedChannelNum[0] = channel;
        var packet = this.generatePacket(this.getPacketSize(typedChannelNum), 256, typedChannelNum);
        return this.genericReturnHandler(packet);
    };
    /**
     * Set the desired bitorder on the specified spi channel.
     * @param channel the channel you want to configure
     * @param bitOrder the desired bitOrder ('lsbFirst' | 'msbFirst')
     * @return Promise that resolves with an object containing a message and a statusCode
     */
    LinxDevice.prototype.spiSetBitOrder = function (channel, bitOrder) {
        var spiInfo = new Uint8Array(2);
        spiInfo[0] = channel;
        spiInfo[1] = bitOrder === 'lsbFirst' ? 0 : 1;
        var packet = this.generatePacket(this.getPacketSize(spiInfo), 257, spiInfo);
        return this.genericReturnHandler(packet);
    };
    /**
     * Set the desired clock frequency on the specified spi channel.
     * @param channel the channel you want to configure
     * @param targetFrequency the target frequency
     * @return Promise that resolves with an object containing a message, statusCode, and actualFrequency
     */
    LinxDevice.prototype.spiSetClockFrequency = function (channel, targetFrequency) {
        var _this = this;
        var spiInfo = new Uint8Array(5);
        spiInfo[0] = channel;
        var adjustedTargetFreq = this.numberAsByteArray(targetFrequency, 4);
        spiInfo.set(adjustedTargetFreq, 1);
        var packet = this.generatePacket(this.getPacketSize(spiInfo), 258, spiInfo);
        return new Promise(function (resolve, reject) {
            _this.sendPacketAndParseResponse(packet)
                .then(function (data) {
                resolve({
                    statusCode: 0,
                    message: 'ok',
                    actualFrequency: data[5] << 24 | data[6] << 16 | data[7] << 8 | data[8]
                });
            })
                .catch(function (err) {
                reject({
                    statusCode: 1,
                    message: err,
                    actualFrequency: null
                });
            });
        });
    };
    /**
     * Set the desired mode on the specified spi channel.
     * @param channel the channel you want to configure
     * @param mode the desired mode
     * @return Promise that resolves with an object containing a message and a statusCode
     */
    LinxDevice.prototype.spiSetMode = function (channel, mode) {
        if (mode < 0 || mode > 3) {
            return new Promise(function (resolve, reject) {
                reject({
                    statusCode: 1,
                    message: 'SPI Mode Must Be Between 0 and 3'
                });
                return;
            });
        }
        var spiInfo = new Uint8Array(2);
        spiInfo[0] = channel;
        spiInfo[1] = mode;
        var packet = this.generatePacket(this.getPacketSize(spiInfo), 259, spiInfo);
        return this.genericReturnHandler(packet);
    };
    /**
     * Read on the specified spi channel.
     * @param channel the channel you want to read/write
     * @param csPin the chip select pin number
     * @param csLogicLevel the logic level ('activeHigh' | 'activeLow')
     * @param data the data you want to write
     * @return Promise that resolves with an object containing a message, statusCode, and returnData
     */
    LinxDevice.prototype.spiWriteRead = function (channel, csPin, csLogicLevel, data) {
        var frameSize = data.length;
        return this.spiWriteReadAdvanced(channel, frameSize, csPin, csLogicLevel, data);
    };
    /**
     * Read on the specified spi channel.
     * @param channel the channel you want to read/write
     * @param frameSize the frame size of the transfer
     * @param csPin the chip select pin number
     * @param csLogicLevel the logic level ('activeHigh' | 'activeLow')
     * @param data the data array you want to write
     * @return Promise that resolves with an object containing a message, statusCode, and returnData
     */
    LinxDevice.prototype.spiWriteReadAdvanced = function (channel, frameSize, csPin, csLogicLevel, data) {
        var _this = this;
        var spiInfo = new Uint8Array(4 + data.length);
        spiInfo[0] = channel;
        spiInfo[1] = frameSize;
        spiInfo[2] = csPin;
        spiInfo[3] = csLogicLevel === 'activeHigh' ? 1 : 0;
        var typedDataArray = new Uint8Array(data);
        spiInfo.set(typedDataArray, 4);
        var packet = this.generatePacket(this.getPacketSize(spiInfo), 263, spiInfo);
        return new Promise(function (resolve, reject) {
            _this.sendPacketAndParseResponse(packet)
                .then(function (data) {
                var returnData = [];
                for (var i = 0; i < data[1] - 6; i++) {
                    returnData.push(data[5 + i]);
                }
                resolve({
                    statusCode: 0,
                    message: 'ok',
                    data: returnData
                });
            })
                .catch(function (err) {
                reject({
                    statusCode: 1,
                    message: err,
                    data: null
                });
            });
        });
    };
    /**************************************************************************
    *   I2C
    **************************************************************************/
    /**
     * Read on the specified spi channel.
     * @param channel the channel you want to open
     * @return Promise that resolves with an object containing a message and statusCode
     */
    LinxDevice.prototype.i2cOpen = function (channel) {
        var typedChannelNum = new Uint8Array(1);
        typedChannelNum[0] = channel;
        var packet = this.generatePacket(this.getPacketSize(typedChannelNum), 224, typedChannelNum);
        return this.genericReturnHandler(packet);
    };
    /**
     * Set the desired i2c speed on the specified channel.
     * @param channel the channel you want to configure
     * @param frequency the desired frequency
     * @return Promise that resolves with an object containing a message, statusCode, and actualFrequency
     */
    LinxDevice.prototype.i2cSetSpeed = function (channel, frequency) {
        var _this = this;
        var i2cInfo = new Uint8Array(5);
        i2cInfo[0] = channel;
        var adjustedTargetFreq = this.numberAsByteArray(frequency, 4);
        i2cInfo.set(adjustedTargetFreq, 1);
        var packet = this.generatePacket(this.getPacketSize(i2cInfo), 225, i2cInfo);
        return new Promise(function (resolve, reject) {
            _this.sendPacketAndParseResponse(packet)
                .then(function (data) {
                resolve({
                    statusCode: 0,
                    message: 'ok',
                    actualFrequency: data[5] << 24 | data[6] << 16 | data[7] << 8 | data[8]
                });
            })
                .catch(function (err) {
                reject({
                    statusCode: 1,
                    message: err,
                    actualFrequency: null
                });
            });
        });
    };
    /**
     * Read on the specified i2c channel.
     * @param channel the channel you want to read
     * @param slaveAddress slave address of target
     * @param numBytesToRead the number of bytes to read
     * @param timeout milliseconds to wait until timeout
     * @param eofConfig end of file configuration ('default' | 'restart' | 'restartNoStop' | 'noStop')
     * @return Promise that resolves with an object containing a message, statusCode, and returnData
     */
    LinxDevice.prototype.i2cRead = function (channel, slaveAddress, numBytesToRead, timeout, eofConfig) {
        var _this = this;
        var i2cInfo = new Uint8Array(6);
        var timeoutAsU16 = this.numberAsByteArray(timeout, 2);
        var eofConfigDict = {
            default: 0,
            restart: 1,
            restartNoStop: 2,
            noStop: 3
        };
        i2cInfo[0] = channel;
        i2cInfo[1] = slaveAddress & 127;
        i2cInfo[2] = numBytesToRead & 255;
        i2cInfo.set(timeoutAsU16, 3);
        i2cInfo[5] = eofConfigDict[eofConfig] || 0;
        var packet = this.generatePacket(this.getPacketSize(i2cInfo), 227, i2cInfo);
        return new Promise(function (resolve, reject) {
            _this.sendPacketAndParseResponse(packet)
                .then(function (data) {
                var returnData = [];
                for (var i = 0; i < data[1] - 6; i++) {
                    returnData.push(data[i + 5]);
                }
                resolve({
                    statusCode: 0,
                    message: 'ok',
                    data: returnData
                });
            })
                .catch(function (err) {
                reject({
                    statusCode: 1,
                    message: err,
                    data: null
                });
            });
        });
    };
    /**
     * Read on the specified i2c channel.
     * @param channel the channel you want to write
     * @param slaveAddress slave address of target
     * @param eofConfig end of file configuration ('default' | 'restart' | 'restartNoStop' | 'noStop')
     * @param data the data to write
     * @return Promise that resolves with an object containing a message and statusCode
     */
    LinxDevice.prototype.i2cWrite = function (channel, slaveAddress, eofConfig, data) {
        var i2cInfo = new Uint8Array(3 + data.length);
        var eofConfigDict = {
            default: 0,
            restart: 1,
            restartNoStop: 2,
            noStop: 3
        };
        i2cInfo[0] = channel;
        i2cInfo[1] = slaveAddress & 127;
        i2cInfo[2] = eofConfigDict[eofConfig] || 0;
        i2cInfo.set(new Uint8Array(data), 3);
        var packet = this.generatePacket(this.getPacketSize(i2cInfo), 226, i2cInfo);
        return this.genericReturnHandler(packet);
    };
    /**
     * Read on the specified i2c channel.
     * @param channel the channel you want to close
     * @return Promise that resolves with an object containing a message and statusCode
     */
    LinxDevice.prototype.i2cClose = function (channel) {
        var i2cInfo = new Uint8Array(1);
        i2cInfo[0] = channel;
        var packet = this.generatePacket(this.getPacketSize(i2cInfo), 228, i2cInfo);
        return this.genericReturnHandler(packet);
    };
    /**************************************************************************
    *   PWM
    **************************************************************************/
    /**
     * Set the desired duty cycle on the specified pinNumber.
     * @param pinNumber the pinNumber you want to configure
     * @return Promise that resolves with an object containing a message and statusCode
     */
    LinxDevice.prototype.pwmSetDutyCycle = function (pinNumber, dutyCycle) {
        return this.pwmSetDutyCycleAdvanced(1, [pinNumber], [dutyCycle]);
    };
    /**
     * Set the desired duty cycles on the specified pinNumbers.
     * @param numPins the number of pins to configure
     * @param pinNumbers the pinNumbers to configure
     * @param dutyCycles the desired duty cycles corresponding with the specified pinNumbers
     * @return Promise that resolves with an object containing a message and statusCode
     */
    LinxDevice.prototype.pwmSetDutyCycleAdvanced = function (numPins, pinNumbers, dutyCycles) {
        if (pinNumbers.length !== dutyCycles.length) {
            return new Promise(function (resolve, reject) {
                reject();
                return;
            });
        }
        var pwmInfo = new Uint8Array(1 + pinNumbers.length * 2);
        var typedPinNumbersArray = new Uint8Array(pinNumbers);
        var typedDutyCyclesArray = new Uint8Array(dutyCycles);
        pwmInfo[0] = numPins & 255;
        pwmInfo.set(typedPinNumbersArray, 1);
        pwmInfo.set(typedDutyCyclesArray, 1 + typedPinNumbersArray.length);
        var packet = this.generatePacket(this.getPacketSize(pwmInfo), 131, pwmInfo);
        return this.genericReturnHandler(packet);
    };
    /**
     * Set the desired frequencies on the specified pinNumbers.
     * @param numPins the number of pins to configure
     * @param pinNumbers the pinNumbers to configure
     * @param frequencies the desired frequencies corresponding with the specified pinNumbers
     * @return Promise that resolves with an object containing a message and statusCode
     */
    LinxDevice.prototype.pwmSetFrequencyAdvanced = function (numPins, pinNumbers, frequencies) {
        if (pinNumbers.length !== frequencies.length) {
            return new Promise(function (resolve, reject) {
                reject();
                return;
            });
        }
        var pwmInfo = new Uint8Array(1 + pinNumbers.length + 4 * frequencies.length);
        var typedPinNumbersArray = new Uint8Array(pinNumbers);
        var typedFrequenciesArray = new Uint8Array(4 * frequencies.length);
        pwmInfo[0] = numPins & 255;
        pwmInfo.set(typedPinNumbersArray, 1);
        for (var i = 0; i < typedFrequenciesArray.length; i++) {
            var frequencyAsU32 = this.numberAsByteArray(frequencies[i], 4);
            typedFrequenciesArray.set(frequencyAsU32, (4 * i) + 2);
        }
        var packet = this.generatePacket(this.getPacketSize(pwmInfo), 130, pwmInfo);
        return this.genericReturnHandler(packet);
    };
    /**************************************************************************
    *   UART
    **************************************************************************/
    /**
     * Uart open on the specified channel and initialize to a specific baud rate.
     * @param channel the desired channel
     * @param baud the desired baud rate
     * @return Promise that resolves with an object containing a message, the actual baud rate, and a statusCode
     */
    LinxDevice.prototype.uartOpen = function (channel, baud) {
        var _this = this;
        var uartInfo = new Uint8Array(5);
        uartInfo[0] = channel;
        var adjustedBaud = this.numberAsByteArray(baud, 4);
        uartInfo.set(adjustedBaud, 1);
        var packet = this.generatePacket(this.getPacketSize(uartInfo), 192, uartInfo);
        return new Promise(function (resolve, reject) {
            _this.sendPacketAndParseResponse(packet)
                .then(function (data) {
                resolve({
                    statusCode: 0,
                    message: 'ok',
                    actualBaud: data[5] << 24 | data[6] << 16 | data[7] << 8 | data[8]
                });
            })
                .catch(function (err) {
                reject({
                    statusCode: 1,
                    message: err,
                    actualBaud: null
                });
            });
        });
    };
    /**
     * Set baud rate on the specified channel.
     * @param channel the desired channel
     * @param baud the desired baud rate
     * @return Promise that resolves with an object containing a message, the actual baud rate, and a statusCode
     */
    LinxDevice.prototype.uartSetBaudRate = function (channel, baud) {
        var _this = this;
        var uartInfo = new Uint8Array(5);
        uartInfo[0] = channel;
        var adjustedBaud = this.numberAsByteArray(baud, 4);
        uartInfo.set(adjustedBaud, 1);
        var packet = this.generatePacket(this.getPacketSize(uartInfo), 192, uartInfo);
        return new Promise(function (resolve, reject) {
            _this.sendPacketAndParseResponse(packet)
                .then(function (data) {
                resolve({
                    statusCode: 0,
                    message: 'ok',
                    actualBaud: data[5] << 24 | data[6] << 16 | data[7] << 8 | data[8]
                });
            })
                .catch(function (err) {
                reject({
                    statusCode: 1,
                    message: err,
                    actualBaud: null
                });
            });
        });
    };
    /**
     * Uart get bytes available on the specified channel.
     * @param channel the desired channel
     * @return Promise that resolves with an object containing a message, the number of bytes, and a statusCode
     */
    LinxDevice.prototype.uartGetBytesAvailable = function (channel) {
        var _this = this;
        var commandParams = new Uint8Array(1);
        commandParams[0] = channel;
        var packet = this.generatePacket(this.getPacketSize(commandParams), 194, commandParams);
        return new Promise(function (resolve, reject) {
            _this.sendPacketAndParseResponse(packet)
                .then(function (data) {
                resolve({
                    statusCode: 0,
                    message: 'ok',
                    numBytes: data[5]
                });
            })
                .catch(function (err) {
                reject({
                    statusCode: 1,
                    message: err,
                    numBytes: null
                });
            });
        });
    };
    /**
     * Uart read a specific number of bytes on the specified channel.
     * @param channel the desired channel
     * @param numBytes the number of bytes to read
     * @return Promise that resolves with an object containing a message, a byte array of data, and a statusCode
     */
    LinxDevice.prototype.uartRead = function (channel, numBytes) {
        var _this = this;
        var commandParams = new Uint8Array(2);
        commandParams[0] = channel;
        commandParams[1] = numBytes;
        var packet = this.generatePacket(this.getPacketSize(commandParams), 195, commandParams);
        return new Promise(function (resolve, reject) {
            _this.sendPacketAndParseResponse(packet)
                .then(function (data) {
                var returnData = [];
                for (var i = 0; i < data[1] - 6; i++) {
                    returnData.push(data[i + 5]);
                }
                resolve({
                    statusCode: 0,
                    message: 'ok',
                    data: returnData
                });
            })
                .catch(function (err) {
                reject({
                    statusCode: 1,
                    message: err,
                    data: null
                });
            });
        });
    };
    /**
     * Uart write on the specified channel.
     * @param channel the desired channel
     * @param data the byte array to send
     * @return Promise that resolves with an object containing a message and a statusCode
     */
    LinxDevice.prototype.uartWrite = function (channel, data) {
        var uartInfo = new Uint8Array(1 + data.length);
        uartInfo[0] = channel;
        var typedData = new Uint8Array(data);
        uartInfo.set(typedData, 1);
        var packet = this.generatePacket(this.getPacketSize(uartInfo), 196, uartInfo);
        return this.genericReturnHandler(packet);
    };
    /**
     * Uart close on the specified channel.
     * @param channel the desired channel
     * @return Promise that resolves with an object containing a message and a statusCode
     */
    LinxDevice.prototype.uartClose = function (channel) {
        var typedChannelNum = new Uint8Array(1);
        typedChannelNum[0] = channel;
        var packet = this.generatePacket(this.getPacketSize(typedChannelNum), 197, typedChannelNum);
        return this.genericReturnHandler(packet);
    };
    /**************************************************************************
    *   Utilities
    **************************************************************************/
    /**
     * Call writeRead on supplied transport and return response.
     * @param packet the packet to send
     * @return Promise that resolves with the response packet
     */
    LinxDevice.prototype.sendPacketAndParseResponse = function (packet) {
        var _this = this;
        console.log('sending packet: ');
        console.log(packet);
        this.packetNumber++;
        return new Promise(function (resolve, reject) {
            _this.transport.writeRead(packet)
                .then(function (data) {
                data = new Uint8Array(data);
                console.log(data);
                var packetCalculatedSize = (data[1] << 8) | (data[2] & 255);
                var checksum = _this.generateChecksum(data);
                if (checksum !== data[data.length - 1]) {
                    reject('Invalid checksum');
                    return;
                }
                if (data[0] !== 255) {
                    reject('Invalid first byte');
                    return;
                }
                if (data.length !== packetCalculatedSize) {
                    reject('Invalid packet size');
                    return;
                }
                resolve(data);
            })
                .catch(function (err) {
                reject(err);
            });
        });
    };
    /**
     * Get packet size of command.
     * @param [commandParams] the parameters to send
     * @return Packet size
     */
    LinxDevice.prototype.getPacketSize = function (commandParams) {
        if (commandParams == undefined) {
            return 7;
        }
        return 7 + commandParams.length;
    };
    /**
     * Generates packet based on packet size, command number, and command parameters.
     * @param packetSize the size of the packet to send
     * @param commandNumber the LINX command number for this packet
     * @param [commandParams] the parameters to send
     * @return The packet to send
     */
    LinxDevice.prototype.generatePacket = function (packetSize, commandNumber, commandParams) {
        var packet = new Uint8Array(packetSize);
        packet[0] = 255;
        var packetSizeByteArray = this.numberAsByteArray(packetSize, 2);
        packet[1] = packetSizeByteArray[0];
        packet[2] = packetSizeByteArray[1];
        packet[3] = this.packetNumber & 255;
        var commandNumberByteArray = this.numberAsByteArray(commandNumber, 2);
        packet[4] = commandNumberByteArray[0];
        packet[5] = commandNumberByteArray[1];
        if (commandParams != undefined) {
            for (var i = 0; i < commandParams.length; i++) {
                packet[i + 6] = commandParams[i];
            }
        }
        packet[packetSize - 1] = this.generateChecksum(packet);
        return packet;
    };
    /**
     * Creates a byte array of a specified number with a specific number of bytes.
     * @param number the number to convert
     * @param numBytes the number of bytes to represent the number
     * @return Byte array representation of number
     */
    LinxDevice.prototype.numberAsByteArray = function (number, numBytes) {
        var byteArray = new Uint8Array(numBytes);
        for (var i = 0; i < numBytes; i++) {
            byteArray[i] = (number >> (8 * (numBytes - i - 1))) & 255;
        }
        return byteArray;
    };
    /**
     * Generate checksum from command array.
     * @param commandArray the packet to send
     * @return The computed checksum
     */
    LinxDevice.prototype.generateChecksum = function (commandArray) {
        var checksum = 0;
        var maxVal = Math.pow(2, 8);
        for (var i = 0; i < commandArray.length - 1; i++) {
            checksum += commandArray[i];
        }
        return checksum % maxVal;
    };
    /**
     * Generic promise wrapper for default responses.
     * @param packet the packet to send
     * @return Promise that resolves with an object containing a message and a statusCode
     */
    LinxDevice.prototype.genericReturnHandler = function (packet) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.sendPacketAndParseResponse(packet)
                .then(function (data) {
                resolve({
                    statusCode: 0,
                    message: 'ok'
                });
            })
                .catch(function (err) {
                reject({
                    statusCode: 1,
                    message: err
                });
            });
        });
    };
    return LinxDevice;
}());
exports.LinxDevice = LinxDevice;
var Return;
(function (Return) {
    ;
    ;
    ;
    ;
    ;
    ;
    ;
    ;
    ;
    ;
    ;
    ;
    ;
    ;
    ;
    ;
    ;
    ;
    ;
    ;
    ;
})(Return = exports.Return || (exports.Return = {}));
//# sourceMappingURL=linx-device.js.map

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var GenericTransport = (function () {
    function GenericTransport() {
    }
    return GenericTransport;
}());
exports.GenericTransport = GenericTransport;
//# sourceMappingURL=generic-transport.js.map

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var linx_device_js_1 = __webpack_require__(0);
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

/***/ })
/******/ ]);