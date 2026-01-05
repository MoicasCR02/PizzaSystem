import * as React from "react";
import { createContext, useReducer } from "react";
import {
  cartReducer,
  cartInitialState,
  getTotal,
  getSubTotal,
  getImpuestos,
  getCountItems,
  CART_ACTION,
} from "../reducers/cart";
import PropTypes from "prop-types";
import toast from "react-hot-toast";

export const CartContext = createContext();

CartProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, cartInitialState);

  // Función para agregar un ítem al carrito
  const addItem = (product) => {
    dispatch({
      type: CART_ACTION.ADD_ITEM,
      payload: {
        ...product, // Mantén las propiedades existentes del producto
        tipo: "producto", // Agrega el campo extra "tipo"
      },
    });
    toast.success(`${product.nombre_producto} fue añadido al carrito`);
  };

  const addItemCombo = (combo) => {
    dispatch({
      type: CART_ACTION.ADD_ITEM,
      payload: {
        ...combo, // Mantén las propiedades existentes del producto
        tipo: "combo", // Agrega el campo extra "tipo"
      },
    });
    toast.success(`${combo.descripcion} fue añadido al carrito`);
  };

  const removeItem = (item) => {
    const { id, tipo } = item;

    if (tipo === "producto") {
      dispatch({
        type: CART_ACTION.REMOVE_ITEM,
        payload: { id_producto: id, tipo }, // Usamos id_producto para removerlo
      });
    } else if (tipo === "combo") {
      dispatch({
        type: CART_ACTION.REMOVE_ITEM,
        payload: { id_combo: id, tipo}, // Usamos id_combo para removerlo
      });
    }
  };

  const cleanCart = () =>
    dispatch({
      type: CART_ACTION.CLEAN_CART,
    });

  return (
    <CartContext.Provider
      value={{
        cart: state,
        addItem,
        addItemCombo,
        removeItem,
        cleanCart,
        getTotal,
        getSubTotal,
        getImpuestos,
        getCountItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
