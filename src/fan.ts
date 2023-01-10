import { SerialPort } from "serialport";

export class Meacofan1056PicoController {
  serialPort: SerialPort;
  
  constructor(serialPort: SerialPort) {
    this.serialPort = serialPort
  }

  static async connect() {
    const path = await this.findDevicePath();
    const serialPort = new SerialPort({ path, baudRate: 115200 });
    return new Meacofan1056PicoController(serialPort);
  }

  static async findDevicePath() {
    // Look for the serial port with the Pico's vendor and product ID
    const devices = await SerialPort.list();
    return devices.find(dev => dev.vendorId == "2e8a" && dev.productId == "000a")!.path;
  }

  togglePower()                 { this.sendCommand(0x92); }
  toggleVerticalOscillation()   { this.sendCommand(0x8A); }
  toggleHorizontalOscillation() { this.sendCommand(0x87); }
  toggleEcoMode()               { this.sendCommand(0x81); }
  configurePreOn()              { this.sendCommand(0x82); }
  configurePreOff()             { this.sendCommand(0x83); }
  toggleDisplay()               { this.sendCommand(0x9E); }
  speedUp()                     { this.sendCommand(0x89); }
  speedDown()                   { this.sendCommand(0x9F); }
  
  sendCommand(command: number) {
    // All commands use address 0x80, and 3 retries is a sensible number
    this.sendRawCommand(0x80, command, 3);
  }

  sendRawCommand(address: number, command: number, retries: number) {
    this.serialPort.write(Buffer.from([address, command, retries]));
  }
}
