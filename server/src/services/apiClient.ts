import axios, { AxiosInstance, Axios } from 'axios';
import { config } from '../config/environment.js';
import { Config } from '../config/types/config.js';
import { ProductResponse } from '../controllers/types/product.types.js';
import { CategoryResponse } from '../controllers/types/category.types.js';
import {
  WooCommerceOrderRequest,
  WooCommerceOrderResponse,
} from '../controllers/types/order.types.js';
import NodeCache from 'node-cache';

/**
 * ApiClient
 * ---------
 * En klass som hanterar anrop (requests) till WooCommerce-API:t.
 * Den använder Axios för HTTP-förfrågningar och erbjuder metoder för att hämta produkter och kategorier.
 */
export class ApiClient {
  /**
   * Förvarar konfigurationsobjektet (Config) som innehåller
   * nödvändig information för att anropa WooCommerce, såsom:
   * - apiUrl (grund-URL till WooCommerce-API)
   * - consumerKey
   * - consumerSecret
   */
  private readonly config: Config;
  public cache: NodeCache = new NodeCache({ stdTTL: 300 });

  /**
   * Konstruktorn tar emot ett Config-objekt, vilket sedan lagras
   * som en privat egenskap. Används för att generera autentiserings-
   * uppgifter samt bas-URL till API-anropen.
   */
  constructor(customConfig?: Config) {
    this.config = customConfig || {
      apiUrl: config.woocommerceApiUrl,
      woocommerceConsumerKey: config.woocommerceConsumerKey,
      woocommerceConsumerSecret: config.woocommerceConsumerSecret,
    };
  }

  public setCache(key: string, value: any) {
    this.cache.set(key, value);
  }

  /**
   * getAuthConfig
   * -------------
   * Privat metod som returnerar ett auth-objekt för Basic Authentication.
   * Axios använder detta för att skicka med användarnamn (consumerKey)
   * och lösenord (consumerSecret) för WooCommerce-API.
   */
  private getAuthConfig() {
    return {
      auth: {
        // Använder credentials från config för Basic Auth
        username: this.config.woocommerceConsumerKey,
        password: this.config.woocommerceConsumerSecret,
      },
      timeout: 30000,
    };
  }

  /**
   * getProducts
   * -----------
   * Hämtar alla produkter från WooCommerce.
   * Returnerar ett AxiosResponse-liknande objekt innehållande:
   * { data: ProductResponse[] }
   * @throws {Error} vid nätverks- eller API-fel
   */
  async getProducts(
    page: number = 1,
    perPage: number = 12
  ): Promise<{ data: ProductResponse[]; headers: any }> {
    const start = Date.now();

    const response = axios.get(`${this.config.apiUrl}products`, {
      ...this.getAuthConfig(),
      params: {
        page,
        per_page: perPage,
        _fields:
          'id,name,price,description,short_description,images,categories,variations,attributes, tags',
      },
    });

    const duration = Date.now() - start;
    console.log(`WooCommerce API call (page ${page}) took ${duration}ms`);

    return response;
  }

  /**
   * getProductById
   * --------------
   * Hämtar en specifik produkt baserat på dess unika ID (sträng).
   * Returnerar { data: ProductResponse }, där data motsvarar
   * en rå produktdata från WooCommerce-API:t.
   */
  async getProductById(id: number): Promise<{ data: ProductResponse }> {
    return axios.get(
      `${this.config.apiUrl}products/${id}`,
      this.getAuthConfig()
    );
  }

  /**
   * getProductCategories
   * --------------------
   * Hämtar en lista av produktkategorier från WooCommerce.
   * Returnerar { data: CategoryResponse[] }.
   */
  async getProductCategories(): Promise<{ data: CategoryResponse[] }> {
    return axios.get(
      `${this.config.apiUrl}products/categories`,
      this.getAuthConfig()
    );
  }

  /**
   * createOrder
   * --------------------
   * Tar emot en 'OrderRequest från frontend och skickar den till WooCommerce.
   * Returnerar WooCommerce's 'OrderRespons', som innehåller order-ID och checkout-URL.
   */
  async createOrder(
    orderData: WooCommerceOrderRequest
  ): Promise<{ data: WooCommerceOrderResponse }> {
    return axios.post(
      `${this.config.apiUrl}orders`,
      orderData,
      this.getAuthConfig()
    );
  }
}
