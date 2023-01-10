import { Service, PlatformAccessory, CharacteristicValue } from 'homebridge';

import { Meacofan1056Platform } from './platform';
import { Meacofan1056PicoController } from './fan';

/**
 * Platform Accessory
 * An instance of this class is created for each accessory your platform registers
 * Each accessory may expose multiple services of different service types.
 */
export class Meacofan1056PlatformAccessory {
  private service: Service;

  private state: { 
    fanController: Meacofan1056PicoController | null,
    powerOn: boolean,
  } = {
    fanController: null,
    powerOn: false,
  };

  constructor(
    private readonly platform: Meacofan1056Platform,
    private readonly accessory: PlatformAccessory,
  ) {
    this.accessory.getService(this.platform.Service.AccessoryInformation)!
      .setCharacteristic(this.platform.Characteristic.Manufacturer, 'Meacofan')
      .setCharacteristic(this.platform.Characteristic.Model, '1056')
      .setCharacteristic(this.platform.Characteristic.SerialNumber, 'N/A');

    this.service = this.accessory.getService(this.platform.Service.Fan) || this.accessory.addService(this.platform.Service.Fan);
    this.service.setCharacteristic(this.platform.Characteristic.Name, "Fan");

    // register handlers for the On/Off Characteristic
    this.service.getCharacteristic(this.platform.Characteristic.On)
      .onSet(this.setOn.bind(this))                // SET - bind to the `setOn` method below
      .onGet(this.getOn.bind(this));               // GET - bind to the `getOn` method below

    (async () => {
      this.state.fanController = await Meacofan1056PicoController.connect();
      console.log("Fan connected!");
    })();
  }

  /**
   * Handle "SET" requests from HomeKit
   * These are sent when the user changes the state of an accessory, for example, turning on a Light bulb.
   */
  async setOn(value: CharacteristicValue) {
    const newValue = value as boolean;

    if (newValue != this.state.powerOn && this.state.fanController) {
      this.state.fanController!.togglePower();
      this.state.powerOn = newValue;
    }
  }

  /**
   * Handle the "GET" requests from HomeKit
   * These are sent when HomeKit wants to know the current state of the accessory, for example, checking if a Light bulb is on.
   *
   * GET requests should return as fast as possbile. A long delay here will result in
   * HomeKit being unresponsive and a bad user experience in general.
   *
   * If your device takes time to respond you should update the status of your device
   * asynchronously instead using the `updateCharacteristic` method instead.

   * @example
   * this.service.updateCharacteristic(this.platform.Characteristic.On, true)
   */
  async getOn(): Promise<CharacteristicValue> {
    return this.state.powerOn;
  }
}
