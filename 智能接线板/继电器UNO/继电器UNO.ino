 
#define PIN            A0         //彩灯引脚
#define NUMPIXELS      6        //级联彩灯数量


#include <ESP8266.h>
int LedPin=0;
#ifdef ESP32
#error "This code is not recommended t························· o run on the ESP32 platform! Please check your Tools->Board setting."
#endif

/**
**CoreUSB UART Port: [Serial1] [D0,D1]
**Core+ UART Port: [Serial1] [D2,D3]
**/
#if defined(__AVR_ATmega32U4__) || defined(__AVR_ATmega1284P__) || defined (__AVR_ATmega644P__) || defined(__AVR_ATmega128RFA1__)
#define EspSerial Serial1
#define UARTSPEED  115200
#endif

/**
**Core UART Port: [SoftSerial] [D2,D3]
**/
#if defined (__AVR_ATmega168__) || defined (__AVR_ATmega328__) || defined (__AVR_ATmega328P__)
#include <SoftwareSerial.h>
SoftwareSerial mySerial1(2,3); /* RX:D2, TX:D3 */
int state; 
#define EspSerial mySerial1
#define UARTSPEED  9600
#endif

#define SSID        F("iPhone")//WiFi热点名称
#define PASSWORD    F("cjz0909123")//热点密码
#define HOST_NAME   F("api.heclouds.com")
#define HOST_PORT   (80)//端口
#define DEVICEID    "562758194" //OneNet上的设备ID
String apiKey = "mCfv=tI1p9KAr1g6tFfWXRYf=Kk=";
String jsonToSend;
String postString;




char shijian1[23] = {'0'}, shijian2[23] = {'0'};



static const byte  GETDATA[]  PROGMEM = {
  "GET https://api.heclouds.com/devices/562758194/datapoints?datastream_id=jidianqi&limit=1 HTTP/1.1\r\nHost:api.heclouds.com\r\napi-key:mCfv=tI1p9KAr1g6tFfWXRYf=Kk=\r\nConnection: close\r\n\r\n"
};//数字的地方改成设备id   api的地方换成自己的api

ESP8266 wifi(&EspSerial);

#define servoPin  8

#if defined (ESP32)
#define servoPin  D8   //使用ESP32时，数字引脚号前要加D
#endif


void setup(void)

{
    Serial.begin(115200);
   pinMode(12,OUTPUT);  //设置输出口
    pinMode(13,OUTPUT);
    pinMode(A0,INPUT);  //设置输出口
    pinMode(A1,INPUT);
int state; 


  while (!Serial); // wait for Leonardo enumeration, others continue immediately//WiFi连接部分,勿动
  
  Serial.print(F("setup begin\r\n"));
  delay(100);




  WifiInit(EspSerial, UARTSPEED);

  Serial.print(F("FW Version:"));
  Serial.println(wifi.getVersion().c_str());

  if (wifi.setOprToStationSoftAP()) {
    Serial.print(F("to station + softap ok\r\n"));
  } else {
    Serial.print(F("to station + softap err\r\n"));
  }

  if (wifi.joinAP(SSID, PASSWORD)) {
    Serial.print(F("Join AP success\r\n"));

    Serial.print(F("IP:"));
    Serial.println( wifi.getLocalIP().c_str());
  } else {
    Serial.print(F("Join AP failure\r\n"));
  }

  if (wifi.disableMUX()) {
    Serial.print(F("single ok\r\n"));
  } else {
    Serial.print(F("single err\r\n"));
  }

  Serial.print(F("setup end\r\n"));
}

void loop(void)
{
  

 //从onenet读取服务器数值
  if (wifi.createTCP(HOST_NAME, HOST_PORT)) {
    Serial.print(F("create tcp ok\r\n"));
  } else {
    Serial.print(F("create tcp err\r\n"));
  }

  //char *hello = "GET /testwifi/index.html HTTP/1.0\r\nHost: www.adafruit.com\r\nConnection: close\r\n\r\n";
  //wifi.send((const uint8_t*)hello, strlen(hello));  //直接发送

  wifi.sendFromFlash(GETDATA, sizeof(GETDATA)); //从Flash读取发送内容，节约内存
  char a = '0';

  uint8_t buffer[512] = {0};
  uint32_t len = wifi.recv(buffer, sizeof(buffer), 20000);
  if (len > 0) {
    Serial.print(F("Received:["));
    for (uint32_t i = 0; i < len; i++) {
      Serial.print((char)buffer[i]);
    }
    Serial.print(F("]\r\n"));

    for (uint32_t i = 0; i < len - 12; i++) {
      if ((char)buffer[i] == 'v' && (char)buffer[i + 1] == 'a' && (char)buffer[i + 2] == 'l' && (char)buffer[i + 3] == 'u' && (char)buffer[i + 4] == 'e')
      {

        a= buffer[i + 8];
      }
    }

    for (uint32_t i = 0; i < len ; i++) {
      if ((char)buffer[i - 1] == '"' && (char)buffer[i] == 'a' && (char)buffer[i + 1] == 't' && (char)buffer[i + 2] == '"' && (char)buffer[i + 3] == ':')
      {
        for (int j = 0; j < 23; j++)
        { shijian1[j] = buffer[i + 5 + j];
          Serial.print((char)shijian1[j]);
        }
      }
    }
    int sum = 0;
    for (int j = 0; j < 22; j++)
    {
      if (shijian1[j] != shijian2[j])
        sum++;
    }
    if (sum == 0)
      a = '0';


    Serial.print(F("]\r\n"));
  }

  if (wifi.releaseTCP()) {
    Serial.print(F("release tcp ok\r\n"));
  } 
  else {
    Serial.print(F("release tcp err\r\n"));
  }
  Serial.println(a);
  
  if(a=='1')
   {
    digitalWrite(12,LOW);
    digitalWrite(13,LOW);
   }
 else if(a=='3')
   {
    digitalWrite(12,LOW);
    digitalWrite(13,HIGH);
   }
 else if(a=='4')
   {
    digitalWrite(12,HIGH);
    digitalWrite(13,LOW);
   }
 else if(a=='2')
   {
    digitalWrite(12,HIGH);
    digitalWrite(13,HIGH);
   }
    
}
