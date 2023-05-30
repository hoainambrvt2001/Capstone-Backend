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

    this.mqttClient.on('connect', () => {
      console.log('Connected to AdafruitMQTT.');
    });

    this.mqttClient.on('message', (topic, message) => {
      console.log(
        `Received message: ${message} on Topic: ${topic}.`,
      );
    });

    this.mqttClient.on('reconnect', () => {
      console.log('Reconnecting to AdafruitMQTT.');
    });

    this.mqttClient.on('error', () => {
      console.log('Error in connecting to AdafruitMQTT.');
      this.mqttClient.end();
    });
  }

  async publish(
    topic: string,
    payload: string,
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        this.mqttClient.publish(topic, payload);
        resolve(
          `Publishing to topic: ${topic} with payload: ${payload}`,
        );
      } catch (e) {
        reject(e);
      }
    });
  }

  async subscribe(topic: string): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.mqttClient || !this.mqttClient.connected) {
        reject('Error in connecting to AdafruitMQTT');
      }
      this.mqttClient.subscribe(topic, (error) => {
        console.log(
          `Start listening to ${topic} topic of AdafruitMQTT.`,
        );
        resolve(
          `Start listening to ${topic} topic of AdafruitMQTT.`,
        );
        if (error)
          reject(`Subscribe to topics error: ${error}`);
      });
    });
  }
}
