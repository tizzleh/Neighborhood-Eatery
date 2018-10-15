importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.4.1/workbox-sw.js');

if (workbox) {
  console.log(`Yay! Workbox is loaded 🎉`);
} else {
  console.log(`Boo! Workbox didn't load 😬`);
}
// https://github.com/redixhumayun/react-app-rewired-workbox/blob/master/public/custom-service-worker.js
workbox.routing.registerRoute(
  /\.(?:js|css|html|json)$/,
  workbox.strategies.networkFirst()
)
workbox.routing.registerRoute(
  'https://api.foursquare.com/v2/venues/explore?client_id=YCMGPBOPZCPOG4QYVXZ4ETGY5TLVNO34BGYAZ1NNKA3T44KS&client_secret=EKIC4ZUG3DJJGATRLZA2WO1W3X5L204BHM0XG2RE5IGP0GK5&query=food&near=Albuquerque&v=20180903',
  workbox.strategies.networkFirst(),
  'GET',
)
