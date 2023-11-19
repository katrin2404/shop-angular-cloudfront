export interface CartResponse {
  data: {
    cart: unknown[];
    // eslint-disable-next-line @typescript-eslint/naming-convention
    cart_items: unknown[];
  };
}
