import Pusher from "pusher-js";

// Configuración del cliente de Pusher
const pusherClient = new Pusher("06dabb1b02b492196f2e", {
  cluster: "us2",
  encrypted: true,
});

// Servicio para manejar suscripciones y eventos
const PusherService = {
  subscribe(channelName) {
    return pusherClient.subscribe(channelName);
  },

  unsubscribe(channelName) {
    pusherClient.unsubscribe(channelName);
  },

  bind(channel, eventName, callback) {
    channel.bind(eventName, callback);
  },

  unbind(channel, eventName) {
    channel.unbind(eventName);
  },
};

export default PusherService;