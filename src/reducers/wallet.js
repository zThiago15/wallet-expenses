// Esse reducer será responsável por tratar o todas as informações relacionadas as despesas

const initialState = {
  currencies: [],
  expenses: [],
  total: 0,
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
      expenses: [...state.expenses, action.expenses],
      total: Number(action.total) };
  case 'USER_DELETING_EXPENSE':
    return {
      ...state,
      expenses: [...action.expenses],
      total: Number(action.total),
    };
  default:
    return state;
  }
};

export default walletReducer;
