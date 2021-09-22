// Este es el Service Worker de Producción...

// importaciones
var auxLocation = '/twittor/js/sw-utils.js';

importScripts(auxLocation);

const STATIC_CACHE    = 'static-v1';
const DYNAMIC_CACHE   = 'dynamic-v1';
const INMUTABLE_CACHE = 'inmutable-v1';

const APP_SHELL = [
    '/twittor/',
    '/twittor/index.html',
    '/twittor/css/style.css',
    '/twittor/img/favicon.ico',
    '/twittor/img/avatars/spiderman.jpg',
    '/twittor/img/avatars/ironman.jpg',
    '/twittor/img/avatars/wolverine.jpg',
    '/twittor/img/avatars/thor.jpg',
    '/twittor/img/avatars/hulk.jpg',
    '/twittor/js/app.js',
    '/twittor/js/sw-utils.js',
    '/twittor/manifest.json'
];

const APP_SHELL_INMUTABLE = [
    'https://fonts.googleapis.com/css?family=Quicksand:300,400',
    'https://fonts.googleapis.com/css?family=Lato:400,300',
    'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
    '/twittor/css/animate.css',
    '/twittor/js/libs/jquery.js'
];

self.addEventListener( 'install', e => {

    const cacheStatic = caches.open(STATIC_CACHE).then( cache => {
        cache.addAll(APP_SHELL);
    });

    const cacheInmutable = caches.open(INMUTABLE_CACHE).then( cache => {
        cache.addAll(APP_SHELL_INMUTABLE);
    });

    e.waitUntil( Promise.all([ cacheStatic, cacheInmutable ]) );

});

self.addEventListener( 'activate', e => {

    const prepara = caches.keys().then( keys => {
        keys.forEach( key => {
            if( key !== STATIC_CACHE && key.includes('static')  ) {
                return caches.delete(key );
            }
            if (  key !== DYNAMIC_CACHE && key.includes('dynamic') ) {
                return caches.delete(key);
            }
        });
    });

    e.waitUntil(prepara);

});

self.addEventListener( 'fetch', e => {

    const respuesta = caches.match(e.request).then( res => {
        if( res ) {
            return res;
        } else {
            //console.log(e.request.url);
            return fetch(e.request).then( newRes => {
                return actualizaCacheDinamico(DYNAMIC_CACHE, e.request, newRes );
            });
        }
    });

    e.respondWith(respuesta);

});




