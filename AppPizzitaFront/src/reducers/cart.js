//localStorage.clear();
// Estado inicial del carrito
export const cartInitialState = JSON.parse(localStorage.getItem("cart")) || [];

// Acción de agregar, eliminar y limpiar carrito
export const CART_ACTION = {
  ADD_ITEM: "ADD_ITEM",
  REMOVE_ITEM: "REMOVE_ITEM",
  CLEAN_CART: "CLEAN_CART",
};

// Función para actualizar el localStorage
export const updateLocalStorage = (state) => {
  localStorage.setItem("cart", JSON.stringify(state));
};

// Función para calcular el subtotal de cada ítem
const calculateSubtotalP = (item) => item.precio * item.cantidad; // Se usa 'precio' y 'cantidad'

// Función para calcular el impuesto de cada ítem (considerando la cantidad) con redondeo
const calcularImpuestoP = (item) => {
  return Math.round( item.precio * item.cantidad * 0.13 * 100) / 100; // Redondea a dos decimales
};

// Función para calcular el total con impuestos de cada ítem (considerando la cantidad) con redondeo
const calcularTotalConImpuestoP = (item) => {
  return Math.round((calculateSubtotalP(item) + calcularImpuestoP(item)) * 100) / 100; // Redondea a dos decimales
};

// Función para calcular el total del carrito con impuestos, con redondeo
const calcularTotal = (cart) => {
  const total = cart.reduce((acc, item) => acc + item.subtotal + item.impuesto, 0);
  return Math.round(total * 100) / 100; // Redondea a dos decimales
};

// Función para calcular el subtotal del carrito con redondeo
const calcularSubtotal = (cart) => {
  const subtotal = cart.reduce((acc, item) => acc + item.subtotal, 0);
  return Math.round(subtotal * 100) / 100; // Redondea a dos decimales
};

// Función para calcular el total de los impuestos del carrito con redondeo
const calcularImpuestos = (cart) => {
  const impuestos = cart.reduce((acc, item) => acc + item.impuesto, 0);
  return Math.round(impuestos * 100) / 100; // Redondea a dos decimales
};

// Reducer del carrito
export const cartReducer = (state, action) => {
  const { type: actionType, payload: actionPayload } = action;

  switch (actionType) {
    // Agregar un ítem al carrito
    case CART_ACTION.ADD_ITEM: {
      const { tipo, id_producto, id_combo } = actionPayload;

      // Verificar si el ítem es un producto o combo
      let itemInCart;
      if (tipo === "producto") {
        itemInCart = state.findIndex((item) => item.id_producto === id_producto);
      } else if (tipo === "combo") {
        itemInCart = state.findIndex((item) => item.id_combo === id_combo);
      }

      if (itemInCart >= 0) {
        // Si el ítem ya existe, aumentamos la cantidad
        const newState = structuredClone(state);
        newState[itemInCart].cantidad += 1; // Incrementa la cantidad

        // Recalcula el subtotal, impuesto y total con impuesto del ítem
        newState[itemInCart].subtotal = calculateSubtotalP(newState[itemInCart]);
        newState[itemInCart].impuesto = calcularImpuestoP(newState[itemInCart]);
        newState[itemInCart].totalconImpuestoP = calcularTotalConImpuestoP(newState[itemInCart]);

        updateLocalStorage(newState);
        return newState;
      }

      // Si el ítem es nuevo, lo agregamos con cantidad 1
      const newState = [
        ...state,
        {
          ...actionPayload,
          cantidad: 1,  // Asumimos que la cantidad inicial es 1 al agregar un ítem nuevo
          // Calcular el subtotal con solo 'precio' y 'cantidad'
          subtotal: calculateSubtotalP({
            precio: actionPayload.precio,  // Solo pasamos las propiedades necesarias
            cantidad: 1,  // Aseguramos que la cantidad inicial sea 1
          }),
          // Calcular el impuesto con solo 'precio' y 'cantidad'
          impuesto: calcularImpuestoP({
            precio: actionPayload.precio,  // Solo pasamos las propiedades necesarias
            cantidad: 1,
          }),
          // Calcular el total con impuesto con solo 'precio' y 'cantidad'
          totalconImpuestoP: calcularTotalConImpuestoP({
            precio: actionPayload.precio,  // Solo pasamos las propiedades necesarias
            cantidad: 1,
          }),
        },
      ];
      updateLocalStorage(newState);
      return newState;
    }

    // Eliminar un ítem del carrito
    case CART_ACTION.REMOVE_ITEM: {
      const { tipo, id_producto, id_combo } = actionPayload;

      let newState;
      if (tipo === "producto") {
        // Eliminar por id_producto
        newState = state.filter((item) => item.id_producto !== id_producto);
      } else if (tipo === "combo") {
        // Eliminar por id_combo
        newState = state.filter((item) => item.id_combo !== id_combo);
      }

      updateLocalStorage(newState);
      return newState;
    }

    // Limpiar el carrito
    case CART_ACTION.CLEAN_CART: {
      updateLocalStorage([]);
      return [];
    }

    default:
      return state;
  }
};

// Obtener el total del carrito (con impuestos)
export const getTotal = (state) => {
  return calcularTotal(state);
};

//Obtener el total del carrito sin impuestos
export const getSubTotal = (state) => {
  return calcularSubtotal(state);
};

// Obtener el total del carrito solo impuestos
export const getImpuestos = (state) => {
  return calcularImpuestos(state);
};


// Obtener el número total de ítems en el carrito
export const getCountItems = (state) => {
  return state.reduce((acc, item) => acc + item.cantidad, 0); // Suma las cantidades
};
