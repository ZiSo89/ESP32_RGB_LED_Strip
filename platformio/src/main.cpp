#include <WiFi.h>
#include <SocketIoClient.h>
#include <stdlib.h>
#define RED_PIN 12
#define GREEN_PIN 14
#define BLUE_PIN 27
/////////////////////////////////////
////// USER DEFINED VARIABLES //////
///////////////////////////////////
/// WIFI Settings ///
const char *ssid = "COSMOTE-43tgsh";
const char *password = "ks7fd34rasv3vhvv";

/// Socket.IO Settings ///
char host[] = "192.168.1.8";                     // Socket.IO Server Address
int port = 8080;                                 // Socket.IO Port Address
char path[] = "/socket.io/?transport=websocket"; // Socket.IO Base Path /socket.io/?transport=websocket
bool useSSL = false;                             // Use SSL Authentication
const char *sslFingerprint = "";                 // SSL Certificate Fingerprint
bool useAuth = false;                            // use Socket.IO Authentication
const char *serverUsername = "socketIOUsername";
const char *serverPassword = "socketIOPassword";

SocketIoClient webSocket;
WiFiClient client;

void socket_message(const char *payload, size_t length)
{
  // Serial.print("got message: ");
  // Serial.println(payload);

  char part1[4];
  char part2[4];
  char part3[4];

  memmove(part1, &payload[0], 3);
  part1[3] = '\0';
  memmove(part2, &payload[3], 3);
  part2[3] = '\0';
  memmove(part3, &payload[6], 3);
  part3[3] = '\0';

  analogWrite(RED_PIN, atoi(part1));
  Serial.print(part1);
  Serial.print(" ");
  analogWrite(GREEN_PIN, atoi(part2));
  Serial.print(part2);
  Serial.print(" ");
  analogWrite(BLUE_PIN, atoi(part3));
  Serial.println(part3);
}

void setup()
{
  pinMode(RED_PIN, OUTPUT);
  pinMode(GREEN_PIN, OUTPUT);
  pinMode(BLUE_PIN, OUTPUT);
  Serial.begin(115200);
  delay(10);

  // We start by connecting to a WiFi network

  Serial.println();
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);

  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED)
  {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());

  // Setup 'on' listen events
  webSocket.on("message", socket_message);

  // Setup Connection
  if (useSSL)
  {
    webSocket.beginSSL(host, port, path, sslFingerprint);
  }
  else
  {
    webSocket.begin(host, port, path);
  }

  // Handle Authentication
  if (useAuth)
  {
    webSocket.setAuthorization(serverUsername, serverPassword);
  }
}

void loop()
{
  webSocket.loop();
}