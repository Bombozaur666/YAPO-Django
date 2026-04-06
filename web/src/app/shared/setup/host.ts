let prod: boolean = false;
export const host = {
  hostname: prod ? 'www.yapo-plants.eu' : 'localhost',
  protocol: prod ? 'https://' : 'http://',
  port:     prod ? '8443' : "8080",
}
