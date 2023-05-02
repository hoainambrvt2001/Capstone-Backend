import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { connect } from 'mqtt';
import { MqttClient } from 'mqtt/types/lib/client';

@Injectable()
export class MqttService {
  private mqttClient: MqttClient;
  private configService: ConfigService;

  constructor() {
    this.configService = new ConfigService();
    const host = this.configService.get<string>(
      'ADAFRUIT_MQTT_HOST',
    );
    const port = this.configService.get<string>(
      'ADAFRUIT_MQTT_PORT',
    );

    const clientId = `mqtt_${Math.random()
      .toString(16)
      .slice(3)}`;

    const connectUrl = `mqtt://${host}:${port}`;

    this.mqttClient = connect(connectUrl, {
      clientId,
      clean: true,
      connectTimeout: 4000,
      username: this.configService.get<string>(
        'ADAFRUIT_MQTT_USERNAME',
      ),
      password: this.configService.get<string>(
        'ADAFRUIT_MQTT_PASSWORD',
      ),
      reconnectPeriod: 1000,
    });

    // this.mqttClient.on('connect', () => {
    //   if (this.mqttClient) {
    //     const topic = this.configService.get<string>(
    //       'ADAFRUIT_MQTT_HARDWARE_TOPIC',
    //     );
    //     this.mqttClient.subscribe(topic, (error) => {
    //       console.log('Connected to AdafruitMQTT');
    //       if (error)
    //         console.log('Subscribe to topics error', error);
    //     });
    //   }
    // });

    this.mqttClient.on('message', (topic, message) => {
      console.log(
        `Received message: ${message} on Topic: ${topic}`,
      );
    });

    this.mqttClient.on('reconnect', () => {
      console.log('Reconnecting to AdafruitMQTT');
    });

    this.mqttClient.on('error', () => {
      console.log('Error in connecting to AdafruitMQTT');
      this.mqttClient.end();
    });
  }

  publish(topic: string, payload: string): string {
    console.log(
      `Publishing to topic: ${topic} with payload: ${payload}`,
    );
    this.mqttClient.publish(topic, payload);
    return `Publishing to ${topic}`;
  }
}
