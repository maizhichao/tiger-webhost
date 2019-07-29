const {
  AMMO_HOST = "http://172.26.68.20",
  ANION_HOST = "http://172.26.68.21",
  BAND_HOST = "http://172.26.67.58",
  CLASSIC2_HOST = "http://172.26.67.28",
  DRUM_GQL_URI = "https://ds-api-test.energymost.com",
  ELECTRONIC_APP_HOST = "http://172.26.67.35/test/electronic/apphost",
  ELECTRONIC_UI_DOCKER_API_BASE_PATH = "https://web-api-test.itm.energymost.com",
  FLUTE_HOST = "http://172.26.67.52",
  FORT_HOST = "http://172.26.67.48",
  FUNK_APP_HOST = "http://172.26.67.36/test/funk/apphost",
  FUNK_UI_DOCKER_API_BASE_PATH = "https://web-api-test.da.energymost.com",
  GUITAR_HOST = "http://172.26.67.60",
  HARDCORE_HOST = "http://172.26.68.24",
  HIPHOP_APP_HOST = "http://172.26.67.34/test/hiphop/apphost",
  HIPHOP_UI_DOCKER_API_BASE_PATH = "https://web-api-test.mm.energymost.com",
  JAZZ_APP_HOST = "http://172.26.67.32/test/jazz/apphost",
  JAZZ_OPENWEBAPI_HOST = "http://172.26.65.32/test/jazz/openwebapi",
  JAZZ_WEBAPI_HOST = "https://web-api-test.energymost.com",
  POKEMON_HOST = "http://172.26.67.50",
  POLKA_APP_HOST = "http://test-de-app.hz.ds.se.com/test/polka/apphost",
  POLKA_UI_API_BASE_PATH = "https://web-api-de-test.energymost.com",
  POP_APP_HOST = "http://172.26.67.33/test/pop/apphost",
  POP_APP_WEBSOCKET_ADDRESS = "https://wss-test.fm.energymost.com",
  POP_UI_DOCKER_API_BASE_PATH = "https://web-api-test.fm.energymost.com",
  PUNK_URI = "https://punk-test.energymost.com",
  SELEARN_HOST = "http://172.26.68.160",
  SEYAN_HOST_URL = "https://seyan-api-test.energymost.com",
  VIOLIN_HOST = "http://172.26.67.55",
  YUMMY_DA_HOST = "http://172.26.67.27",
  YUMMY_FM_HOST = "http://172.26.67.24",
  YUMMY_ITM_HOST = "http://172.26.67.26",
  YUMMY_MM_HOST = "http://172.26.67.25"
} = process.env;

export const SourceMap: { [key: string]: string } = {
  AMMO: AMMO_HOST,
  ANION: ANION_HOST,
  BAND: BAND_HOST,
  CLASSIC: CLASSIC2_HOST,
  DRUM_GQL: DRUM_GQL_URI,
  ELECTRONIC_APP: ELECTRONIC_APP_HOST,
  ELECTRONIC_WEB: ELECTRONIC_UI_DOCKER_API_BASE_PATH,
  FLUTE: FLUTE_HOST,
  FORT: FORT_HOST,
  FUNK_APP: FUNK_APP_HOST,
  FUNK_WEB: FUNK_UI_DOCKER_API_BASE_PATH,
  GUITAR: GUITAR_HOST,
  HARDCORE: HARDCORE_HOST,
  HIPHOP_APP: HIPHOP_APP_HOST,
  HIPHOP_WEB: HIPHOP_UI_DOCKER_API_BASE_PATH,
  JAZZ_APP: JAZZ_APP_HOST,
  JAZZ_WEB: JAZZ_WEBAPI_HOST,
  JAZZ_WEB_OPEN: JAZZ_OPENWEBAPI_HOST,
  POKEMON: POKEMON_HOST,
  POLKA_APP: POLKA_APP_HOST,
  POLKA_WEB: POLKA_UI_API_BASE_PATH,
  POP_APP: POP_APP_HOST,
  POP_APP_WS: POP_APP_WEBSOCKET_ADDRESS,
  POP_WEB: POP_UI_DOCKER_API_BASE_PATH,
  PUNK: PUNK_URI,
  SELEARN: SELEARN_HOST,
  SEYAN: SEYAN_HOST_URL,
  VIOLIN: VIOLIN_HOST,
  YUMMY_DA: YUMMY_DA_HOST,
  YUMMY_FM: YUMMY_FM_HOST,
  YUMMY_ITM: YUMMY_ITM_HOST,
  YUMMY_MM: YUMMY_MM_HOST
};
