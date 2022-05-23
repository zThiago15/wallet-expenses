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
  case 'USER_EXPENSE':
    return {
      ...state,
      expenses: [...state.expenses, action.expenses] };
  case 'USER_UPDATE_EXPENSE':
    return {
      ...state,
      expenses: [...action.expenses] };
  default:
    return state;
  }
};

export default walletReducer;
