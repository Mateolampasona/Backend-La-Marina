import MercadoPagoConfig from 'mercadopago';
import { config as dotenvConfig } from 'dotenv';

dotenvConfig({ path: '.env' });

export const cleint = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
});
