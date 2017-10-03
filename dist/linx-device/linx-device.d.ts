import { ConnectionHandlerService } from '../connection-handler/connection-handler';
export declare class LinxDevice {
    private packetNumber;
    connectionHandlerService: ConnectionHandlerService;
    deviceAddress: string;
    constructor(deviceAddress: string);
    /**************************************************************************
    *   Device
    **************************************************************************/
    /**
     * Sync with LINX device.
     * @return Promise that resolves with an object containing a message and a statusCode
     */
    sync(): Promise<Return.Default>;
    /**
     * Get LINX device family and id.
     * @return Promise that resolves with an object containing a message, statusCode, deviceFamily, and deviceId
     */
    getDeviceId(): Promise<Return.DeviceId>;
    /**
     * Get LINX api version on device.
     * @return Promise that resolves with an object containing a message, statusCode, major, minor, subminor, and build
     */
    getLinxApiVersion(): Promise<Return.ApiVersion>;
    /**
     * Get max baud rate for LINX device.
     * @return Promise that resolves with an object containing a message, statusCode, and baudRate
     */
    getMaxBaudRate(): Promise<Return.GetMaxBaudRate>;
    /**
     * Set the baud rate for the LINX device.
     * @param baudRate the desired baud rate
     * @return Promise that resolves with an object containing a message, statusCode, and actualBaud
     */
    setBaudRate(baudRate: number): Promise<Return.UartSetBaudRate>;
    /**
     * Set the desired userId for the LINX device.
     * @param userId the desired userId
     * @return Promise that resolves with an object containing a message and statusCode
     */
    setDeviceUserId(userId: number): Promise<Return.Default>;
    /**
     * Set the value for the given key.
     * @return Promise that resolves when the value is set
     */
    getDeviceUserId(): Promise<Return.GetDeviceUserId>;
    /**
     * Get the name of the LINX device.
     * @return Promise that resolves with an object containing a message, statusCode, and deviceName
     */
    getDeviceName(): Promise<Return.GetDeviceName>;
    /**************************************************************************
    *   Digital
    **************************************************************************/
    /**
     * Gets the valid digital channels.
     * @return Promise that resolves with an object containing a message, statusCode, and chans array
     */
    digitalGetChans(): Promise<Return.DigitalGetChans>;
    /**
     * Digital write the pinNumber to the desired value.
     * @param pinNumber the pinNumber you want to write
     * @param value the value for this pinNumber
     * @return Promise that resolves with an object containing a message and a statusCode
     */
    digitalWrite(pinNumber: number, value: boolean): Promise<Return.Default>;
    /**
     * Digital write the pinNumbers to the desired values.
     * @param numPins the number of pins you want to write
     * @param pinNumbers the pinNumbers you want to write
     * @param values the values you want to write to the associated pinNumber
     * @return Promise that resolves with an object containing a message and a statusCode
     */
    digitalWriteAdvanced(numPins: number, pinNumbers: number[], values: boolean[]): Promise<Return.Default>;
    /**
     * Digital read the pinNumber.
     * @param pinNumber the pinNumber you want to read
     * @return Promise that resolves with an object containing a message, statusCode, and value
     */
    digitalRead(pinNumber: number): Promise<Return.DigitalRead>;
    /**
     * Digital read the pinNumbers.
     * @param pinNumbers the number of pins you want to read
     * @return Promise that resolves with an object containing a message, statusCode, and values array
     */
    digitalReadAdvanced(pinNumbers: number[]): Promise<Return.DigitalReadAdvanced>;
    /**
     * Digital write square wave on the specified channel, frequency, and duration.
     * @param channel the desired channel
     * @param frequency the desired frequency
     * @param duration the desired duration
     * @return Promise that resolves with an object containing a message and a statusCode
     */
    digitalWriteSquareWave(channel: number, frequency: number, duration?: number): Promise<Return.Default>;
    /**************************************************************************
    *   Analog
    **************************************************************************/
    /**
     * Analog read the pinNumber.
     * @param pinNumber the pinNumber you want to read
     * @return Promise that resolves with an object containing a message, statusCode, and value
     */
    analogRead(pinNumber: number): Promise<Return.AnalogRead>;
    /**
     * Analog read the pinNumbers.
     * @param pinNumbers the pinNumbers you want to read
     * @return Promise that resolves with an object containing a message, statusCode, and values array
     */
    analogReadAdvanced(pinNumbers: number[]): Promise<Return.AnalogReadAdvanced>;
    /**
     * Analog write the pinNumber to the desired value.
     * @param pinNumber the pinNumber you want to write
     * @param value the value for this pinNumber
     * @return Promise that resolves with an object containing a message and a statusCode
     */
    analogWrite(pinNumber: number, value: number): Promise<Return.Default>;
    /**
     * Analog write the pinNumbers to the desired values.
     * @param numPins the number of pins you want to write
     * @param pinNumbers the pinNumbers you want to write
     * @param values the values for the corresponding pinNumbers
     * @return Promise that resolves with an object containing a message and a statusCode
     */
    analogWriteAdvanced(numPins: number, pinNumbers: number[], values: number[]): Promise<Return.Default>;
    /**************************************************************************
    *   Servo
    **************************************************************************/
    /**
     * Get the valid servo channels.
     * @return Promise that resolves with an object containing a message, statusCode, and channels array
     */
    servoGetChannels(): Promise<Return.ServoGetChannels>;
    /**
     * Open the desired servo channels.
     * @param channels the channels you want to open
     * @return Promise that resolves with an object containing a message and a statusCode
     */
    servoOpen(channels: number[]): Promise<Return.Default>;
    /**
     * Set the desired pulse width on the specified servo channel.
     * @param channel the channel you want to configure
     * @param value the desired pulse width
     * @return Promise that resolves with an object containing a message and a statusCode
     */
    servoSetPulseWidth(channel: number, value: number): Promise<Return.Default>;
    /**
     * Set the desired pulse widths on the specified servo channels.
     * @param numChans the number of channels you want to configure
     * @param channels the channels you want to configure
     * @param values the values for the corresponding channels
     * @return Promise that resolves with an object containing a message and a statusCode
     */
    servoSetPulseWidthAdvanced(numChans: number, channels: number[], values: number[]): Promise<Return.Default>;
    /**
     * Close the specified servo channels.
     * @param channels the channels you want to close
     * @return Promise that resolves with an object containing a message and a statusCode
     */
    servoClose(channels: number[]): Promise<Return.Default>;
    /**************************************************************************
    *   SPI
    **************************************************************************/
    /**
     * Open the specified spi channel.
     * @param channel the channel you want to open
     * @return Promise that resolves with an object containing a message and a statusCode
     */
    spiOpen(channel: number): Promise<Return.Default>;
    /**
     * Set the desired bitorder on the specified spi channel.
     * @param channel the channel you want to configure
     * @param bitOrder the desired bitOrder ('lsbFirst' | 'msbFirst')
     * @return Promise that resolves with an object containing a message and a statusCode
     */
    spiSetBitOrder(channel: number, bitOrder: 'lsbFirst' | 'msbFirst'): Promise<Return.Default>;
    /**
     * Set the desired clock frequency on the specified spi channel.
     * @param channel the channel you want to configure
     * @param targetFrequency the target frequency
     * @return Promise that resolves with an object containing a message, statusCode, and actualFrequency
     */
    spiSetClockFrequency(channel: number, targetFrequency: number): Promise<Return.SpiSetClockFrequency>;
    /**
     * Set the desired mode on the specified spi channel.
     * @param channel the channel you want to configure
     * @param mode the desired mode
     * @return Promise that resolves with an object containing a message and a statusCode
     */
    spiSetMode(channel: number, mode: number): Promise<Return.Default>;
    /**
     * Read on the specified spi channel.
     * @param channel the channel you want to read/write
     * @param csPin the chip select pin number
     * @param csLogicLevel the logic level ('activeHigh' | 'activeLow')
     * @param data the data you want to write
     * @return Promise that resolves with an object containing a message, statusCode, and returnData
     */
    spiWriteRead(channel: number, csPin: number, csLogicLevel: 'activeHigh' | 'activeLow', data: number[]): Promise<Return.SpiWriteRead>;
    /**
     * Read on the specified spi channel.
     * @param channel the channel you want to read/write
     * @param frameSize the frame size of the transfer
     * @param csPin the chip select pin number
     * @param csLogicLevel the logic level ('activeHigh' | 'activeLow')
     * @param data the data array you want to write
     * @return Promise that resolves with an object containing a message, statusCode, and returnData
     */
    spiWriteReadAdvanced(channel: number, frameSize: number, csPin: number, csLogicLevel: 'activeHigh' | 'activeLow', data: number[]): Promise<Return.SpiWriteRead>;
    /**************************************************************************
    *   I2C
    **************************************************************************/
    /**
     * Read on the specified spi channel.
     * @param channel the channel you want to open
     * @return Promise that resolves with an object containing a message and statusCode
     */
    i2cOpen(channel: number): Promise<Return.Default>;
    /**
     * Set the desired i2c speed on the specified channel.
     * @param channel the channel you want to configure
     * @param frequency the desired frequency
     * @return Promise that resolves with an object containing a message, statusCode, and actualFrequency
     */
    i2cSetSpeed(channel: number, frequency: number): Promise<Return.I2cSetSpeed>;
    /**
     * Read on the specified i2c channel.
     * @param channel the channel you want to read
     * @param slaveAddress slave address of target
     * @param numBytesToRead the number of bytes to read
     * @param timeout milliseconds to wait until timeout
     * @param eofConfig end of file configuration ('default' | 'restart' | 'restartNoStop' | 'noStop')
     * @return Promise that resolves with an object containing a message, statusCode, and returnData
     */
    i2cRead(channel: number, slaveAddress: number, numBytesToRead: number, timeout: number, eofConfig: 'default' | 'restart' | 'restartNoStop' | 'noStop'): Promise<Return.I2cRead>;
    /**
     * Read on the specified i2c channel.
     * @param channel the channel you want to write
     * @param slaveAddress slave address of target
     * @param eofConfig end of file configuration ('default' | 'restart' | 'restartNoStop' | 'noStop')
     * @param data the data to write
     * @return Promise that resolves with an object containing a message and statusCode
     */
    i2cWrite(channel: number, slaveAddress: number, eofConfig: number, data: number[]): Promise<Return.Default>;
    /**
     * Read on the specified i2c channel.
     * @param channel the channel you want to close
     * @return Promise that resolves with an object containing a message and statusCode
     */
    i2cClose(channel: number): Promise<Return.Default>;
    /**************************************************************************
    *   PWM
    **************************************************************************/
    /**
     * Set the desired duty cycle on the specified pinNumber.
     * @param pinNumber the pinNumber you want to configure
     * @return Promise that resolves with an object containing a message and statusCode
     */
    pwmSetDutyCycle(pinNumber: number, dutyCycle: number): Promise<Return.Default>;
    /**
     * Set the desired duty cycles on the specified pinNumbers.
     * @param numPins the number of pins to configure
     * @param pinNumbers the pinNumbers to configure
     * @param dutyCycles the desired duty cycles corresponding with the specified pinNumbers
     * @return Promise that resolves with an object containing a message and statusCode
     */
    pwmSetDutyCycleAdvanced(numPins: number, pinNumbers: number[], dutyCycles: number[]): Promise<Return.Default>;
    /**
     * Set the desired frequencies on the specified pinNumbers.
     * @param numPins the number of pins to configure
     * @param pinNumbers the pinNumbers to configure
     * @param frequencies the desired frequencies corresponding with the specified pinNumbers
     * @return Promise that resolves with an object containing a message and statusCode
     */
    pwmSetFrequencyAdvanced(numPins: number, pinNumbers: number[], frequencies: number[]): Promise<Return.Default>;
    /**************************************************************************
    *   UART
    **************************************************************************/
    uartOpen(channel: number, baud: number): Promise<Return.UartOpen>;
    uartSetBaudRate(channel: number, baud: number): Promise<Return.UartSetBaudRate>;
    uartGetBytesAvailable(channel: number): Promise<Return.UartGetBytesAvailable>;
    uartRead(channel: number, numBytes: number): Promise<Return.UartRead>;
    uartWrite(channel: number, data: number[]): Promise<Return.Default>;
    uartClose(channel: number): Promise<Return.Default>;
    /**************************************************************************
    *   Utilities
    **************************************************************************/
    private sendPacketAndParseResponse(packet);
    private getPacketSize(commandParams?);
    private generatePacket(packetSize, commandNumber, commandParams?);
    private numberAsByteArray(number, numBytes);
    private generateChecksum(commandArray);
    private genericReturnHandler(packet);
}
export declare namespace Return {
    interface UartRead extends Return.Default {
        data: number[];
    }
    interface UartGetBytesAvailable extends Return.Default {
        numBytes: number;
    }
    interface UartSetBaudRate extends Return.Default {
        actualBaud: number;
    }
    interface UartOpen extends Return.Default {
        actualBaud: number;
    }
    interface I2cRead extends Return.Default {
        data: number[];
    }
    interface I2cSetSpeed extends Return.Default {
        actualFrequency: number;
    }
    interface SpiWriteRead extends Return.Default {
        data: number[];
    }
    interface SpiSetClockFrequency extends Return.Default {
        actualFrequency: number;
    }
    interface ServoGetChannels extends Return.Default {
        channels: number[];
    }
    interface AnalogReadAdvanced extends Return.Default {
        values: number[];
    }
    interface AnalogRead extends Return.Default {
        value: number;
    }
    interface DigitalReadAdvanced extends Return.Default {
        values: number[];
    }
    interface DigitalRead extends Return.Default {
        value: number;
    }
    interface DigitalGetChans extends Return.Default {
        chans: number[];
    }
    interface GetDeviceName extends Return.Default {
        deviceName: string;
    }
    interface GetDeviceUserId extends Return.Default {
        userId: number;
    }
    interface SetBaudRate extends Return.Default {
        actualBaud: number;
    }
    interface GetMaxBaudRate extends Return.Default {
        baudRate: number;
    }
    interface ApiVersion extends Return.Default {
        major: number;
        minor: number;
        subminor: number;
        build: number;
    }
    interface DeviceId extends Return.Default {
        deviceFamily: number;
        deviceId: number;
    }
    interface Default {
        statusCode: number;
        message: string;
    }
}
