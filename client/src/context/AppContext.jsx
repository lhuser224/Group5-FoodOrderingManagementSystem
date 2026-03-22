import React, { createContext, useReducer } from 'react';

// Create the context
export const AppContext = createContext();

// Initial state
const initialState = {
  cart: [],
  orders: [],
  products: [
    { id: 1, name: "Burger King Special", price: 10.00, address: "123 Street" },
    { id: 2, name: "Pizza Hut Deluxe", price: 15.00, address: "456 Avenue" },
    { id: 3, name: "Fried Chicken Combo", price: 8.50, address: "789 Road" },
    { id: 4, name: "Milk Tea Full Topping", price: 4.00, address: "321 Lane" },
    { id: 5, name: "Beef Noodle", price: 6.00, address: "654 Way" },
    { id: 6, name: "Spaghetti Bolognese", price: 12.00, address: "987 Blvd" }
  ]
};

// Reducer function
function appReducer(state, action) {
  switch (action.type) {
    case 'ADD_TO_CART':
      return {
        ...state,
        cart: [...state.cart, action.payload]
      };

    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cart: state.cart.filter((_, index) => index !== action.payload)
      };

    case 'CLEAR_CART':
      return {
        ...state,
        cart: []
      };

    case 'ADD_ORDER':
      return {
        ...state,
        orders: [action.payload, ...state.orders]
      };

    case 'UPDATE_ORDER_STATUS':
      return {
        ...state,
        orders: state.orders.map(order =>
          order.id === action.payload.orderId
            ? { ...order, status: action.payload.status }
            : order
        )
      };

    case 'CANCEL_ORDER':
      return {
        ...state,
        orders: state.orders.map(order =>
          order.id === action.payload.orderId
            ? { ...order, status: 'Cancelled', cancelReason: action.payload.reason }
            : order
        )
      };

    default:
      return state;
  }
}

export function AppProvider({ children }) {
  console.log('✅ AppProvider initializing...');
  const [state, dispatch] = useReducer(appReducer, initialState);
  console.log('✅ AppProvider state:', state);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}
