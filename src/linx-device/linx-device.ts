import { ConnectionHandlerService } from '../connection-handler/connection-handler';

export class LinxDevice {
    private packetNumber: number = 0;
    public connectionHandlerService: ConnectionHandlerService;
    public deviceAddress: string;

    constructor(deviceAddress: string) {
        this.connectionHandlerService = new ConnectionHandlerService();
        this.deviceAddress = deviceAddress;
        console.log('DeviceService constructor');
    }

    /**************************************************************************
    *   Device
    **************************************************************************/

    /**
     * Sync with LINX device.
     * @return Promise that resolves with an object containing a message and a statusCode 
     */
    sync(): Promise<Return.Default> {
        let packet = this.generatePacket(this.getPacketSize(), 0);
        return this.genericReturnHandler(packet);
    }

    /**
     * Get LINX device family and id.
     * @return Promise that resolves with an object containing a message, statusCode, deviceFamily, and deviceId
     */
    getDeviceId(): Promise<Return.DeviceId> {
        let packet = this.generatePacket(this.getPacketSize(), 3);
        return new Promise((resolve, reject) => {
            this.sendPacketAndParseResponse(packet)
                .then((data) => {
                    resolve({
                        statusCode: 0,
                        message: 'ok',
                        deviceFamily: data[5],
                        deviceId: data[6]
                    });

                })
                .catch((err) => {
                    reject({
                        statusCode: 1,
                        message: err,
                        deviceFamily: null,
                        deviceId: null
                    });
                });
        });
    }

    /**
     * Get LINX api version on device.
     * @return Promise that resolves with an object containing a message, statusCode, major, minor, subminor, and build
     */
    getLinxApiVersion(): Promise<Return.ApiVersion> {
        let packet = this.generatePacket(this.getPacketSize(), 4);
        return new Promise((resolve, reject) => {
            this.sendPacketAndParseResponse(packet)
                .then((data) => {
                    resolve({
                        statusCode: 0,
                        message: 'ok',
                        major: data[5],
                        minor: data[6],
                        subminor: data[7],
                        build: data[8]
                    });

                })
                .catch((err) => {
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
    }

    /**
     * Get max baud rate for LINX device.
     * @return Promise that resolves with an object containing a message, statusCode, and baudRate
     */
    getMaxBaudRate(): Promise<Return.GetMaxBaudRate> {
        let packet = this.generatePacket(this.getPacketSize(), 5);
        return new Promise((resolve, reject) => {
            this.sendPacketAndParseResponse(packet)
                .then((data) => {
                    resolve({
                        statusCode: 0,
                        message: 'ok',
                        baudRate: (data[5] & 255) << 24 | (data[6] & 255) << 16 | (data[7] & 255) << 8 | data[8]
                    });

                })
                .catch((err) => {
                    reject({
                        statusCode: 1,
                        message: err,
                        baudRate: null
                    });
                });
        });
    }

    /**
     * Set the baud rate for the LINX device.
     * @param baudRate the desired baud rate
     * @return Promise that resolves with an object containing a message, statusCode, and actualBaud
     */
    setBaudRate(baudRate: number): Promise<Return.UartSetBaudRate> {
        let commandParams = this.numberAsByteArray(baudRate, 4);
        let packet = this.generatePacket(this.getPacketSize(commandParams), 6, commandParams);
        return new Promise((resolve, reject) => {
            this.sendPacketAndParseResponse(packet)
                .then((data) => {
                    resolve({
                        statusCode: 0,
                        message: 'ok',
                        actualBaud: (data[4] & 255) << 24 | (data[5] & 255) << 16 | (data[6] & 255) << 8 | data[7]
                    });

                })
                .catch((err) => {
                    reject({
                        statusCode: 1,
                        message: err,
                        actualBaud: null
                    });
                });
        });
    }

    /**
     * Set the desired userId for the LINX device.
     * @param userId the desired userId
     * @return Promise that resolves with an object containing a message and statusCode
     */
    setDeviceUserId(userId: number): Promise<Return.Default> {
        let commandParams = this.numberAsByteArray(userId, 2);
        let packet = this.generatePacket(this.getPacketSize(commandParams), 18, commandParams);
        return this.genericReturnHandler(packet);
    }

    /**
     * Set the value for the given key.
     * @return Promise that resolves when the value is set
     */
    getDeviceUserId(): Promise<Return.GetDeviceUserId> {
        let packet = this.generatePacket(this.getPacketSize(), 19);
        return new Promise((resolve, reject) => {
            this.sendPacketAndParseResponse(packet)
                .then((data) => {
                    resolve({
                        statusCode: 0,
                        message: 'ok',
                        userId: (data[5] & 255) << 8 | data[6]
                    });

                })
                .catch((err) => {
                    reject({
                        statusCode: 1,
                        message: err,
                        userId: null
                    });
                });
        });
    }

    /**
     * Get the name of the LINX device.
     * @return Promise that resolves with an object containing a message, statusCode, and deviceName
     */
    getDeviceName(): Promise<Return.GetDeviceName> {
        let packet = this.generatePacket(this.getPacketSize(), 36);
        return new Promise((resolve, reject) => {
            this.sendPacketAndParseResponse(packet)
                .then((data) => {
                    let deviceName = String.fromCharCode.apply(null, data.slice(5, data.length - 2));
                    resolve({
                        statusCode: 0,
                        message: 'ok',
                        deviceName: deviceName
                    });

                })
                .catch((err) => {
                    reject({
                        statusCode: 1,
                        message: err,
                        deviceName: null
                    });
                });
        });
    }

    /**************************************************************************
    *   Digital
    **************************************************************************/

    /**
     * Gets the valid digital channels.
     * @return Promise that resolves with an object containing a message, statusCode, and chans array
     */
    digitalGetChans(): Promise<Return.DigitalGetChans> {
        let packet = this.generatePacket(this.getPacketSize(), 8);
        return new Promise((resolve, reject) => {
            this.sendPacketAndParseResponse(packet)
                .then((data) => {
                    let digitalChans = [];
                    let packetSize = (data[1] << 8) | data[2];
                    for (let i = 0; i < packetSize - 6; i++) {
                        digitalChans.push(data[i + 5]);
                    }
                    resolve({
                        statusCode: 0,
                        message: 'ok',
                        chans: digitalChans
                    })
                })
                .catch((err) => {
                    reject({
                        statusCode: 1,
                        message: err,
                        chans: []
                    })
                });
        });
    }

    /**
     * Digital write the pinNumber to the desired value.
     * @param pinNumber the pinNumber you want to write
     * @param value the value for this pinNumber
     * @return Promise that resolves with an object containing a message and a statusCode
     */
    digitalWrite(pinNumber: number, value: boolean): Promise<Return.Default> {
        return this.digitalWriteAdvanced(1, [pinNumber], [value]);
    }

    /**
     * Digital write the pinNumbers to the desired values.
     * @param numPins the number of pins you want to write
     * @param pinNumbers the pinNumbers you want to write
     * @param values the values you want to write to the associated pinNumber
     * @return Promise that resolves with an object containing a message and a statusCode
     */
    digitalWriteAdvanced(numPins: number, pinNumbers: number[], values: boolean[]): Promise<Return.Default> {
        if (pinNumbers.length !== values.length) {
            new Promise((resolve, reject) => {
                reject({ statusCode: 1, message: 'Invalid write' });
                return;
            });
        }
        let commandParams = new Uint8Array(2 * pinNumbers.length + 1);
        commandParams[0] = numPins & 255;
        for (let i = 0; i < pinNumbers.length; i++) {
            commandParams[i + 1] = pinNumbers[i] & 255;
        }
        for (let i = 0; i < values.length; i++) {
            commandParams[i + 1 + pinNumbers.length] = values[i] ? 1 : 0;
        }
        let packet = this.generatePacket(this.getPacketSize(commandParams), 65, commandParams);
        return this.genericReturnHandler(packet);
    }

    /**
     * Digital read the pinNumber.
     * @param pinNumber the pinNumber you want to read
     * @return Promise that resolves with an object containing a message, statusCode, and value
     */
    digitalRead(pinNumber: number): Promise<Return.DigitalRead> {
        let commandParams = new Uint8Array(1);
        commandParams[0] = pinNumber;
        let packet = this.generatePacket(this.getPacketSize(commandParams), 66, commandParams);
        return new Promise((resolve, reject) => {
            this.sendPacketAndParseResponse(packet)
                .then((data) => {
                    resolve({
                        statusCode: 0,
                        message: 'ok',
                        value: data[5]
                    });

                })
                .catch((err) => {
                    reject({
                        statusCode: 1,
                        message: err,
                        value: null
                    });
                });
        });
    }

    /**
     * Digital read the pinNumbers.
     * @param pinNumbers the number of pins you want to read
     * @return Promise that resolves with an object containing a message, statusCode, and values array
     */
    digitalReadAdvanced(pinNumbers: number[]): Promise<Return.DigitalReadAdvanced> {
        let commandParams = new Uint8Array(pinNumbers);
        let packet = this.generatePacket(this.getPacketSize(commandParams), 66, commandParams);
        return new Promise((resolve, reject) => {
            this.sendPacketAndParseResponse(packet)
                .then((data) => {
                    let returnValues: number[] = [];
                    for (let i = 0; i < data[1] - 6; i++) {
                        returnValues.push(data[i + 5]);
                    }
                    resolve({
                        statusCode: 0,
                        message: 'ok',
                        values: returnValues
                    });

                })
                .catch((err) => {
                    reject({
                        statusCode: 1,
                        message: err,
                        values: null
                    });
                });
        });
    }

    /**
     * Digital write square wave on the specified channel, frequency, and duration.
     * @param channel the desired channel
     * @param frequency the desired frequency
     * @param duration the desired duration
     * @return Promise that resolves with an object containing a message and a statusCode
     */
    digitalWriteSquareWave(channel: number, frequency: number, duration?: number): Promise<Return.Default> {
        let commandParams: Uint8Array = new Uint8Array(9);
        commandParams[0] = channel;
        let frequencyAsU32 = this.numberAsByteArray(frequency, 4);
        let typedDuration = duration == undefined ? new Uint8Array(4) : this.numberAsByteArray(duration, 4);
        commandParams.set(frequencyAsU32, 1);
        commandParams.set(typedDuration, 5);
        let packet = this.generatePacket(this.getPacketSize(commandParams), 67, commandParams);
        return this.genericReturnHandler(packet);
    }

    /**************************************************************************
    *   Analog
    **************************************************************************/

    /**
     * Analog read the pinNumber.
     * @param pinNumber the pinNumber you want to read
     * @return Promise that resolves with an object containing a message, statusCode, and value
     */
    analogRead(pinNumber: number): Promise<Return.AnalogRead> {
        let commandParams = new Uint8Array(1);
        commandParams[0] = pinNumber;
        let packet = this.generatePacket(this.getPacketSize(commandParams), 100, commandParams);
        return new Promise((resolve, reject) => {
            this.sendPacketAndParseResponse(packet)
                .then((data) => {
                    resolve({
                        statusCode: 0,
                        message: 'ok',
                        value: data[5]
                    });

                })
                .catch((err) => {
                    reject({
                        statusCode: 1,
                        message: err,
                        value: null
                    });
                });
        });
    }

    /**
     * Analog read the pinNumbers.
     * @param pinNumbers the pinNumbers you want to read
     * @return Promise that resolves with an object containing a message, statusCode, and values array
     */
    analogReadAdvanced(pinNumbers: number[]): Promise<Return.AnalogReadAdvanced> {
        let commandParams = new Uint8Array(pinNumbers);
        let packet = this.generatePacket(this.getPacketSize(commandParams), 100, commandParams);
        return new Promise((resolve, reject) => {
            this.sendPacketAndParseResponse(packet)
                .then((data) => {
                    let returnValues: number[] = [];
                    for (let i = 0; i < data[1] - 6; i++) {
                        returnValues.push(data[i + 5]);
                    }
                    resolve({
                        statusCode: 0,
                        message: 'ok',
                        values: returnValues
                    });

                })
                .catch((err) => {
                    reject({
                        statusCode: 1,
                        message: err,
                        values: null
                    });
                });
        });
    }

    /**
     * Analog write the pinNumber to the desired value.
     * @param pinNumber the pinNumber you want to write
     * @param value the value for this pinNumber
     * @return Promise that resolves with an object containing a message and a statusCode
     */
    analogWrite(pinNumber: number, value: number): Promise<Return.Default> {
        return this.analogWriteAdvanced(1, [pinNumber], [value]);
    }

    /**
     * Analog write the pinNumbers to the desired values.
     * @param numPins the number of pins you want to write
     * @param pinNumbers the pinNumbers you want to write
     * @param values the values for the corresponding pinNumbers
     * @return Promise that resolves with an object containing a message and a statusCode
     */
    analogWriteAdvanced(numPins: number, pinNumbers: number[], values: number[]): Promise<Return.Default> {
        if (pinNumbers.length !== values.length) {
            new Promise((resolve, reject) => {
                reject({ statusCode: 1, message: 'Invalid write' });
                return;
            });
        }
        let commandParams = new Uint8Array(2 * pinNumbers.length + 1);
        commandParams[0] = numPins & 255;
        for (let i = 0; i < pinNumbers.length; i++) {
            commandParams[i + 1] = pinNumbers[i] & 255;
        }
        for (let i = 0; i < values.length; i++) {
            commandParams[i + 1 + pinNumbers.length] = values[i] & 255;
        }
        let packet = this.generatePacket(this.getPacketSize(commandParams), 101, commandParams);
        return this.genericReturnHandler(packet);
    }

    /**************************************************************************
    *   Servo
    **************************************************************************/

    /**
     * Get the valid servo channels.
     * @return Promise that resolves with an object containing a message, statusCode, and channels array
     */
    servoGetChannels(): Promise<Return.ServoGetChannels> {
        let packet = this.generatePacket(this.getPacketSize(), 8);
        return new Promise((resolve, reject) => {
            this.sendPacketAndParseResponse(packet)
                .then((data) => {
                    let channels: number[] = [];
                    for (let i = 0; i < data[1] - 6; i++) {
                        channels.push(data[i + 5]);
                    }
                    resolve({
                        statusCode: 0,
                        message: 'ok',
                        channels: channels
                    });

                })
                .catch((err) => {
                    reject({
                        statusCode: 1,
                        message: err,
                        channels: null
                    });
                });
        });
    }

    /**
     * Open the desired servo channels.
     * @param channels the channels you want to open
     * @return Promise that resolves with an object containing a message and a statusCode
     */
    servoOpen(channels: number[]): Promise<Return.Default> {
        let typedChannelNums: Uint8Array = new Uint8Array(channels);
        let packet = this.generatePacket(this.getPacketSize(typedChannelNums), 320, typedChannelNums);
        return this.genericReturnHandler(packet);
    }

    /**
     * Set the desired pulse width on the specified servo channel.
     * @param channel the channel you want to configure
     * @param value the desired pulse width
     * @return Promise that resolves with an object containing a message and a statusCode
     */
    servoSetPulseWidth(channel: number, value: number) {
        return this.servoSetPulseWidthAdvanced(1, [channel], [value]);
    }

    /**
     * Set the desired pulse widths on the specified servo channels.
     * @param numChans the number of channels you want to configure
     * @param channels the channels you want to configure
     * @param values the values for the corresponding channels
     * @return Promise that resolves with an object containing a message and a statusCode
     */
    servoSetPulseWidthAdvanced(numChans: number, channels: number[], values: number[]): Promise<Return.Default> {
        if (channels.length !== values.length) {
            new Promise((resolve, reject) => {
                reject();
                return;
            });
            return;
        }
        let typedChannelNums: Uint8Array = new Uint8Array(channels);
        let typedValuesArray: Uint8Array = new Uint8Array(values.length * 2);
        for (let i = 0, j = 0; i < values.length; j = j + 2, i++) {
            typedValuesArray[j] = (values[i] >> 8) & 255;
            typedValuesArray[j + 1] = values[i] & 255;
        }
        let combinedArray: Uint8Array = new Uint8Array(typedChannelNums.length + typedValuesArray.length + 1);
        combinedArray[0] = numChans & 255;
        combinedArray.set(typedChannelNums, 1);
        combinedArray.set(typedValuesArray, typedChannelNums.length + 1);
        let packet = this.generatePacket(this.getPacketSize(combinedArray), 321, combinedArray);
        return this.genericReturnHandler(packet);
    }

    /**
     * Close the specified servo channels.
     * @param channels the channels you want to close
     * @return Promise that resolves with an object containing a message and a statusCode
     */
    servoClose(channels: number[]): Promise<Return.Default> {
        let typedChannelNums: Uint8Array = new Uint8Array(channels);
        let packet = this.generatePacket(this.getPacketSize(typedChannelNums), 322, typedChannelNums);
        return this.genericReturnHandler(packet);
    }

    /**************************************************************************
    *   SPI
    **************************************************************************/

    /**
     * Open the specified spi channel.
     * @param channel the channel you want to open
     * @return Promise that resolves with an object containing a message and a statusCode
     */
    spiOpen(channel: number): Promise<Return.Default> {
        let typedChannelNum: Uint8Array = new Uint8Array(1);
        typedChannelNum[0] = channel;
        let packet = this.generatePacket(this.getPacketSize(typedChannelNum), 256, typedChannelNum);
        return this.genericReturnHandler(packet);
    }

    /**
     * Set the desired bitorder on the specified spi channel.
     * @param channel the channel you want to configure
     * @param bitOrder the desired bitOrder ('lsbFirst' | 'msbFirst')
     * @return Promise that resolves with an object containing a message and a statusCode
     */
    spiSetBitOrder(channel: number, bitOrder: 'lsbFirst' | 'msbFirst'): Promise<Return.Default> {
        let spiInfo: Uint8Array = new Uint8Array(2);
        spiInfo[0] = channel;
        spiInfo[1] = bitOrder === 'lsbFirst' ? 0 : 1;
        let packet = this.generatePacket(this.getPacketSize(spiInfo), 257, spiInfo);
        return this.genericReturnHandler(packet);
    }

    /**
     * Set the desired clock frequency on the specified spi channel.
     * @param channel the channel you want to configure
     * @param targetFrequency the target frequency
     * @return Promise that resolves with an object containing a message, statusCode, and actualFrequency
     */
    spiSetClockFrequency(channel: number, targetFrequency: number): Promise<Return.SpiSetClockFrequency> {
        let spiInfo: Uint8Array = new Uint8Array(5);
        spiInfo[0] = channel;
        let adjustedTargetFreq = this.numberAsByteArray(targetFrequency, 4);
        spiInfo.set(adjustedTargetFreq, 1);
        let packet = this.generatePacket(this.getPacketSize(spiInfo), 258, spiInfo);
        return new Promise((resolve, reject) => {
            this.sendPacketAndParseResponse(packet)
                .then((data) => {
                    resolve({
                        statusCode: 0,
                        message: 'ok',
                        actualFrequency: data[5] << 24 | data[6] << 16 | data[7] << 8 | data[8]
                    });

                })
                .catch((err) => {
                    reject({
                        statusCode: 1,
                        message: err,
                        actualFrequency: null
                    });
                });
        });
    }

    /**
     * Set the desired mode on the specified spi channel.
     * @param channel the channel you want to configure
     * @param mode the desired mode
     * @return Promise that resolves with an object containing a message and a statusCode
     */
    spiSetMode(channel: number, mode: number): Promise<Return.Default> {
        if (mode < 0 || mode > 3) {
            return new Promise((resolve, reject) => {
                reject({
                    statusCode: 1,
                    message: 'SPI Mode Must Be Between 0 and 3'
                });
                return;
            });
        }
        let spiInfo: Uint8Array = new Uint8Array(2);
        spiInfo[0] = channel;
        spiInfo[1] = mode;
        let packet = this.generatePacket(this.getPacketSize(spiInfo), 259, spiInfo);
        return this.genericReturnHandler(packet);
    }

    /**
     * Read on the specified spi channel.
     * @param channel the channel you want to read/write
     * @param csPin the chip select pin number
     * @param csLogicLevel the logic level ('activeHigh' | 'activeLow')
     * @param data the data you want to write
     * @return Promise that resolves with an object containing a message, statusCode, and returnData
     */
    spiWriteRead(channel: number, csPin: number, csLogicLevel: 'activeHigh' | 'activeLow', data: number[]): Promise<Return.SpiWriteRead> {
        let frameSize = data.length;
        return this.spiWriteReadAdvanced(channel, frameSize, csPin, csLogicLevel, data);
    }

    /**
     * Read on the specified spi channel.
     * @param channel the channel you want to read/write
     * @param frameSize the frame size of the transfer
     * @param csPin the chip select pin number
     * @param csLogicLevel the logic level ('activeHigh' | 'activeLow')
     * @param data the data array you want to write
     * @return Promise that resolves with an object containing a message, statusCode, and returnData
     */
    spiWriteReadAdvanced(channel: number, frameSize: number, csPin: number, csLogicLevel: 'activeHigh' | 'activeLow', data: number[]): Promise<Return.SpiWriteRead> {
        let spiInfo: Uint8Array = new Uint8Array(4 + data.length);
        spiInfo[0] = channel;
        spiInfo[1] = frameSize;
        spiInfo[2] = csPin;
        spiInfo[3] = csLogicLevel === 'activeHigh' ? 1 : 0;
        let typedDataArray: Uint8Array = new Uint8Array(data);
        spiInfo.set(typedDataArray, 4);
        let packet = this.generatePacket(this.getPacketSize(spiInfo), 263, spiInfo);
        return new Promise((resolve, reject) => {
            this.sendPacketAndParseResponse(packet)
                .then((data) => {
                    let returnData = [];
                    for (let i = 0; i < data[1] - 6; i++) {
                        returnData.push(data[5 + i]);
                    }
                    resolve({
                        statusCode: 0,
                        message: 'ok',
                        data: returnData
                    });

                })
                .catch((err) => {
                    reject({
                        statusCode: 1,
                        message: err,
                        data: null
                    });
                });
        });
    }

    /**************************************************************************
    *   I2C
    **************************************************************************/

    /**
     * Read on the specified spi channel.
     * @param channel the channel you want to open
     * @return Promise that resolves with an object containing a message and statusCode
     */
    i2cOpen(channel: number): Promise<Return.Default> {
        let typedChannelNum: Uint8Array = new Uint8Array(1);
        typedChannelNum[0] = channel;
        let packet = this.generatePacket(this.getPacketSize(typedChannelNum), 224, typedChannelNum);
        return this.genericReturnHandler(packet);
    }

    /**
     * Set the desired i2c speed on the specified channel.
     * @param channel the channel you want to configure
     * @param frequency the desired frequency
     * @return Promise that resolves with an object containing a message, statusCode, and actualFrequency
     */
    i2cSetSpeed(channel: number, frequency: number): Promise<Return.I2cSetSpeed> {
        let i2cInfo: Uint8Array = new Uint8Array(5);
        i2cInfo[0] = channel;
        let adjustedTargetFreq = this.numberAsByteArray(frequency, 4);
        i2cInfo.set(adjustedTargetFreq, 1);
        let packet = this.generatePacket(this.getPacketSize(i2cInfo), 225, i2cInfo);
        return new Promise((resolve, reject) => {
            this.sendPacketAndParseResponse(packet)
                .then((data) => {
                    resolve({
                        statusCode: 0,
                        message: 'ok',
                        actualFrequency: data[5] << 24 | data[6] << 16 | data[7] << 8 | data[8]
                    });

                })
                .catch((err) => {
                    reject({
                        statusCode: 1,
                        message: err,
                        actualFrequency: null
                    });
                });
        });
    }

    /**
     * Read on the specified i2c channel.
     * @param channel the channel you want to read
     * @param slaveAddress slave address of target
     * @param numBytesToRead the number of bytes to read
     * @param timeout milliseconds to wait until timeout
     * @param eofConfig end of file configuration ('default' | 'restart' | 'restartNoStop' | 'noStop')
     * @return Promise that resolves with an object containing a message, statusCode, and returnData
     */
    i2cRead(channel: number, slaveAddress: number, numBytesToRead: number, timeout: number, eofConfig: 'default' | 'restart' | 'restartNoStop' | 'noStop'): Promise<Return.I2cRead> {
        let i2cInfo: Uint8Array = new Uint8Array(6);
        let timeoutAsU16 = this.numberAsByteArray(timeout, 2);
        let eofConfigDict = {
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
        let packet = this.generatePacket(this.getPacketSize(i2cInfo), 227, i2cInfo);
        return new Promise((resolve, reject) => {
            this.sendPacketAndParseResponse(packet)
                .then((data) => {
                    let returnData: number[] = [];
                    for (let i = 0; i < data[1] - 6; i++) {
                        returnData.push(data[i + 5]);
                    }
                    resolve({
                        statusCode: 0,
                        message: 'ok',
                        data: returnData
                    });

                })
                .catch((err) => {
                    reject({
                        statusCode: 1,
                        message: err,
                        data: null
                    });
                });
        });
    }

    /**
     * Read on the specified i2c channel.
     * @param channel the channel you want to write
     * @param slaveAddress slave address of target
     * @param eofConfig end of file configuration ('default' | 'restart' | 'restartNoStop' | 'noStop')
     * @param data the data to write
     * @return Promise that resolves with an object containing a message and statusCode
     */
    i2cWrite(channel: number, slaveAddress: number, eofConfig: number, data: number[]): Promise<Return.Default> {
        let i2cInfo: Uint8Array = new Uint8Array(3 + data.length);
        let eofConfigDict = {
            default: 0,
            restart: 1,
            restartNoStop: 2,
            noStop: 3
        };
        i2cInfo[0] = channel;
        i2cInfo[1] = slaveAddress & 127;
        i2cInfo[2] = eofConfigDict[eofConfig] || 0;
        i2cInfo.set(new Uint8Array(data), 3);
        let packet = this.generatePacket(this.getPacketSize(i2cInfo), 226, i2cInfo);
        return this.genericReturnHandler(packet);
    }

    /**
     * Read on the specified i2c channel.
     * @param channel the channel you want to close
     * @return Promise that resolves with an object containing a message and statusCode
     */
    i2cClose(channel: number): Promise<Return.Default> {
        let i2cInfo: Uint8Array = new Uint8Array(1);
        i2cInfo[0] = channel;
        let packet = this.generatePacket(this.getPacketSize(i2cInfo), 228, i2cInfo);
        return this.genericReturnHandler(packet);
    }

    /**************************************************************************
    *   PWM
    **************************************************************************/

    /**
     * Set the desired duty cycle on the specified pinNumber.
     * @param pinNumber the pinNumber you want to configure
     * @return Promise that resolves with an object containing a message and statusCode
     */
    pwmSetDutyCycle(pinNumber: number, dutyCycle: number): Promise<Return.Default> {
        return this.pwmSetDutyCycleAdvanced(1, [pinNumber], [dutyCycle]);
    }

    /**
     * Set the desired duty cycles on the specified pinNumbers.
     * @param numPins the number of pins to configure
     * @param pinNumbers the pinNumbers to configure
     * @param dutyCycles the desired duty cycles corresponding with the specified pinNumbers
     * @return Promise that resolves with an object containing a message and statusCode
     */
    pwmSetDutyCycleAdvanced(numPins: number, pinNumbers: number[], dutyCycles: number[]): Promise<Return.Default> {
        if (pinNumbers.length !== dutyCycles.length) {
            return new Promise((resolve, reject) => {
                reject();
                return;
            });
        }
        let pwmInfo: Uint8Array = new Uint8Array(1 + pinNumbers.length * 2);
        let typedPinNumbersArray: Uint8Array = new Uint8Array(pinNumbers);
        let typedDutyCyclesArray: Uint8Array = new Uint8Array(dutyCycles);
        pwmInfo[0] = numPins & 255;
        pwmInfo.set(typedPinNumbersArray, 1);
        pwmInfo.set(typedDutyCyclesArray, 1 + typedPinNumbersArray.length);
        let packet = this.generatePacket(this.getPacketSize(pwmInfo), 131, pwmInfo);
        return this.genericReturnHandler(packet);
    }

    /**
     * Set the desired frequencies on the specified pinNumbers.
     * @param numPins the number of pins to configure
     * @param pinNumbers the pinNumbers to configure
     * @param frequencies the desired frequencies corresponding with the specified pinNumbers
     * @return Promise that resolves with an object containing a message and statusCode
     */
    pwmSetFrequencyAdvanced(numPins: number, pinNumbers: number[], frequencies: number[]): Promise<Return.Default> {
        if (pinNumbers.length !== frequencies.length) {
            return new Promise((resolve, reject) => {
                reject();
                return;
            });
        }
        let pwmInfo: Uint8Array = new Uint8Array(1 + pinNumbers.length + 4 * frequencies.length);
        let typedPinNumbersArray: Uint8Array = new Uint8Array(pinNumbers);
        let typedFrequenciesArray: Uint8Array = new Uint8Array(4 * frequencies.length);
        pwmInfo[0] = numPins & 255;
        pwmInfo.set(typedPinNumbersArray, 1);
        for (let i = 0; i < typedFrequenciesArray.length; i++) {
            let frequencyAsU32 = this.numberAsByteArray(frequencies[i], 4);
            typedFrequenciesArray.set(frequencyAsU32, (4 * i) + 2);
        }
        let packet = this.generatePacket(this.getPacketSize(pwmInfo), 130, pwmInfo);
        return this.genericReturnHandler(packet);
    }

    /**************************************************************************
    *   UART
    **************************************************************************/
    uartOpen(channel: number, baud: number): Promise<Return.UartOpen> {
        let uartInfo: Uint8Array = new Uint8Array(5);
        uartInfo[0] = channel;
        let adjustedBaud = this.numberAsByteArray(baud, 4);
        uartInfo.set(adjustedBaud, 1);
        let packet = this.generatePacket(this.getPacketSize(uartInfo), 192, uartInfo);
        return new Promise((resolve, reject) => {
            this.sendPacketAndParseResponse(packet)
                .then((data) => {
                    resolve({
                        statusCode: 0,
                        message: 'ok',
                        actualBaud: data[5] << 24 | data[6] << 16 | data[7] << 8 | data[8]
                    });

                })
                .catch((err) => {
                    reject({
                        statusCode: 1,
                        message: err,
                        actualBaud: null
                    });
                });
        });
    }

    uartSetBaudRate(channel: number, baud: number): Promise<Return.UartSetBaudRate> {
        let uartInfo: Uint8Array = new Uint8Array(5);
        uartInfo[0] = channel;
        let adjustedBaud = this.numberAsByteArray(baud, 4);
        uartInfo.set(adjustedBaud, 1);
        let packet = this.generatePacket(this.getPacketSize(uartInfo), 192, uartInfo);
        return new Promise((resolve, reject) => {
            this.sendPacketAndParseResponse(packet)
                .then((data) => {
                    resolve({
                        statusCode: 0,
                        message: 'ok',
                        actualBaud: data[5] << 24 | data[6] << 16 | data[7] << 8 | data[8]
                    });

                })
                .catch((err) => {
                    reject({
                        statusCode: 1,
                        message: err,
                        actualBaud: null
                    });
                });
        });
    }

    uartGetBytesAvailable(channel: number): Promise<Return.UartGetBytesAvailable> {
        let commandParams = new Uint8Array(1);
        commandParams[0] = channel;
        let packet = this.generatePacket(this.getPacketSize(commandParams), 194, commandParams);
        return new Promise((resolve, reject) => {
            this.sendPacketAndParseResponse(packet)
                .then((data) => {
                    resolve({
                        statusCode: 0,
                        message: 'ok',
                        numBytes: data[5]
                    });

                })
                .catch((err) => {
                    reject({
                        statusCode: 1,
                        message: err,
                        numBytes: null
                    });
                });
        });
    }

    uartRead(channel: number, numBytes: number): Promise<Return.UartRead> {
        let commandParams = new Uint8Array(2);
        commandParams[0] = channel;
        commandParams[1] = numBytes;
        let packet = this.generatePacket(this.getPacketSize(commandParams), 195, commandParams);
        return new Promise((resolve, reject) => {
            this.sendPacketAndParseResponse(packet)
                .then((data) => {
                    let returnData: number[] = [];
                    for (let i = 0; i < data[1] - 6; i++) {
                        returnData.push(data[i + 5]);
                    }
                    resolve({
                        statusCode: 0,
                        message: 'ok',
                        data: returnData
                    });

                })
                .catch((err) => {
                    reject({
                        statusCode: 1,
                        message: err,
                        data: null
                    });
                });
        });
    }

    uartWrite(channel: number, data: number[]): Promise<Return.Default> {
        let uartInfo: Uint8Array = new Uint8Array(1 + data.length);
        uartInfo[0] = channel;
        let typedData: Uint8Array = new Uint8Array(data);
        uartInfo.set(typedData, 1);
        let packet = this.generatePacket(this.getPacketSize(uartInfo), 196, uartInfo);
        return this.genericReturnHandler(packet);
    }

    uartClose(channel: number): Promise<Return.Default> {
        let typedChannelNum: Uint8Array = new Uint8Array(1);
        typedChannelNum[0] = channel;
        let packet = this.generatePacket(this.getPacketSize(typedChannelNum), 197, typedChannelNum);
        return this.genericReturnHandler(packet);
    }

    /**************************************************************************
    *   Utilities
    **************************************************************************/
    private sendPacketAndParseResponse(packet: Uint8Array): Promise<any> {
        console.log('sending packet: ');
        console.log(packet);
        this.packetNumber++;
        return new Promise((resolve, reject) => {
            this.connectionHandlerService.transport.writeRead(this.deviceAddress, '/', packet, 'binary')
                .then((data) => {
                    data = new Uint8Array(data);
                    console.log(data);
                    let packetCalculatedSize = (data[1] << 8) | (data[2] & 255);
                    let checksum = this.generateChecksum(data);
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
                .catch((err) => {
                    reject(err);
                });
        });
    }

    private getPacketSize(commandParams?: Uint8Array) {
        if (commandParams == undefined) {
            return 7;
        }
        return 7 + commandParams.length;
    }

    private generatePacket(packetSize: number, commandNumber: number, commandParams?: Uint8Array) {
        let packet: Uint8Array = new Uint8Array(packetSize);
        packet[0] = 255;
        let packetSizeByteArray: Uint8Array = this.numberAsByteArray(packetSize, 2);
        packet[1] = packetSizeByteArray[0];
        packet[2] = packetSizeByteArray[1];
        packet[3] = this.packetNumber & 255;
        let commandNumberByteArray: Uint8Array = this.numberAsByteArray(commandNumber, 2);
        packet[4] = commandNumberByteArray[0];
        packet[5] = commandNumberByteArray[1];
        if (commandParams != undefined) {
            for (let i = 0; i < commandParams.length; i++) {
                packet[i + 6] = commandParams[i];
            }
        }
        packet[packetSize - 1] = this.generateChecksum(packet);
        return packet;
    }

    private numberAsByteArray(number, numBytes): Uint8Array {
        let byteArray = new Uint8Array(numBytes);
        for (let i = 0; i < numBytes; i++) {
            byteArray[i] = (number >> (8 * (numBytes - i - 1))) & 255;
        }
        return byteArray;
    }

    private generateChecksum(commandArray: Uint8Array) {
        let checksum = 0;
        let maxVal = Math.pow(2, 8);
        for (let i = 0; i < commandArray.length - 1; i++) {
            checksum += commandArray[i];
        }
        return checksum % maxVal;
    }

    private genericReturnHandler(packet: Uint8Array): Promise<Return.Default> {
        return new Promise((resolve, reject) => {
            this.sendPacketAndParseResponse(packet)
                .then((data) => {
                    resolve({
                        statusCode: 0,
                        message: 'ok'
                    });

                })
                .catch((err) => {
                    reject({
                        statusCode: 1,
                        message: err
                    });
                });
        });
    }

}

export namespace Return {
    export interface UartRead extends Return.Default { data: number[] };
    export interface UartGetBytesAvailable extends Return.Default { numBytes: number };
    export interface UartSetBaudRate extends Return.Default { actualBaud: number };
    export interface UartOpen extends Return.Default { actualBaud: number };
    export interface I2cRead extends Return.Default { data: number[] };
    export interface I2cSetSpeed extends Return.Default { actualFrequency: number };
    export interface SpiWriteRead extends Return.Default { data: number[] };
    export interface SpiSetClockFrequency extends Return.Default { actualFrequency: number };
    export interface ServoGetChannels extends Return.Default { channels: number[] };
    export interface AnalogReadAdvanced extends Return.Default { values: number[] };
    export interface AnalogRead extends Return.Default { value: number };
    export interface DigitalReadAdvanced extends Return.Default { values: number[] };
    export interface DigitalRead extends Return.Default { value: number };
    export interface DigitalGetChans extends Return.Default { chans: number[] };
    export interface GetDeviceName extends Return.Default { deviceName: string };
    export interface GetDeviceUserId extends Return.Default { userId: number };
    export interface SetBaudRate extends Return.Default { actualBaud: number };
    export interface GetMaxBaudRate extends Return.Default { baudRate: number };
    export interface ApiVersion extends Return.Default { major: number, minor: number, subminor: number, build: number };
    export interface DeviceId extends Return.Default { deviceFamily: number, deviceId: number };
    export interface Default { statusCode: number, message: string };
}