//Add Jasmine Tests Here
var LinxDevice = require('../dist/linx-device/linx-device.js').LinxDevice;

describe('LinxDevice', function () {

    let linxDevice = new LinxDevice('http://192.168.1.131');

    it('should be defined', () => {
        console.log('hey');
        expect(linxDevice).toBeDefined();
    });

    linxDevice.digitalRead(10)
        .then((data) => {
            console.log(data);
        })
        .catch((e) => {
            console.log(e);
        });

});