/**
 * @fileoverview CORS configuration options.
 */

const corsOptions = {
  /** 
   * @type {string[]}
   * @description
   * List of trusted origins allowed to access the API.
   */
  origin: [
    'http://localhost:3000',
  ],

  /** 
   * @type {string[]}
   * @description
   * HTTP methods permitted for CORS requests.
   */
  methods: [
    'GET',
    'POST',
    'PUT',
    'DELETE',
  ],

  /** 
   * @type {string[]}
   * @description
   * HTTP headers allowed in CORS requests.
   */
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'Accept',
    'Access-Control-Allow-Credentials',
    'X-Requested-With',
    'Referrer-Policy',
    'X-Frame-Options',
    'X-Debug-Info',
  ],

  /** 
   * @type {boolean}
   * @description
   * Whether to expose cookies and authentication headers to the client.
   */
  credentials: true,
};

module.exports = corsOptions;

