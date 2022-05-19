// Esse reducer será responsável por tratar o todas as informações relacionadas as despesas

const initialState = {
  currencies: [],
  expenses: [],
};

const walletReducer = (state = initialState, action) => {
  switch (action.type) {
  case 'USER_WALLET':
    return { ...state, currencies: action.currencies };
  case 'FAILED_REQUEST':
    return { ...state, error: action.payload };
  default:
    return state;
  }
};

export default walletReducer;
