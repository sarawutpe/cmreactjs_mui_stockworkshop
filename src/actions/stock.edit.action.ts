import {
  server,
  STOCK_EDIT_FAILED,
  STOCK_EDIT_FETCHING,
  STOCK_EDIT_SUCCESS,
} from "../Constants";
import { httpClient } from "../utils/httpClient";
import { history } from "..";
import { Product } from "../types/product.type";

export const setStockEditFetchingToState = () => ({
  type: STOCK_EDIT_FETCHING,
});

export const setStockEditSuccessToState = (payload: Product) => ({
  type: STOCK_EDIT_SUCCESS,
  payload,
});

export const setStockEditFailedToState = () => ({
  type: STOCK_EDIT_FAILED,
});

export const updateProduct = (formData: FormData) => {
  return async (dispatch: any) => {
    await httpClient.put(server.PRODUCT_URL, formData);
    history.back();
  };
};

export const getProductById = (id: any) => {
  return async (dispatch: any) => {
    try {
      dispatch(setStockEditFetchingToState());
      let result = await httpClient.get<Product>(`${server.PRODUCT_URL}/${id}`);
      dispatch(setStockEditSuccessToState(result.data));
    } catch (error) {
      alert(JSON.stringify(error));
      dispatch(setStockEditFailedToState());
    }
  };
};
