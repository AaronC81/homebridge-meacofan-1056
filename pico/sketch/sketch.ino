#include <Arduino.h>

#include "PinDefinitionsAndMore.h" // Define macros for input and output pin etc.
#include <IRremote.hpp>

void setup() {
    pinMode(LED_BUILTIN, OUTPUT);

    Serial.begin(115200);
    Serial.println(F("Started!"));

    IrSender.begin();
}

void loop() {
  // Wait for three bytes of serial
  if (Serial.available() >= 3) {
    unsigned char address = Serial.read();
    unsigned char command = Serial.read();
    unsigned char repeats = Serial.read();
    
    Serial.println();
    Serial.print(F("Send now: address=0x"));
    Serial.print(address, HEX);
    Serial.print(F(" command=0x"));
    Serial.print(command, HEX);
    Serial.print(F(" repeats="));
    Serial.print(repeats);
    Serial.println();
    Serial.flush();
  
    IrSender.sendNEC(address, command, repeats);
    delay(250);
  }
}
