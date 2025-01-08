import MercadoPagoConfig from 'mercadopago';
import { config as dotenvConfig } from 'dotenv';

dotenvConfig({ path: '.env.development' });

export const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
});
