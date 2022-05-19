// Coloque aqui suas actions
export const actionEmail = (email) => ({
  type: 'USER_EMAIL',
  email,
});

export const actionCurrencies = (currencies) => ({
  type: 'USER_WALLET',
  currencies,
});

export const failedRequestAPI = (error) => ({
  type: 'FAILED_REQUEST',
  payload: error,
});

export function fetchCurrencies() {
  return async (dispatch) => {
    try {
      const response = await fetch('https://economia.awesomeapi.com.br/json/all');
      const currencies = Object.keys(await response.json());

      // Removing USTD currency
      const newCurrencies = currencies.filter((currency) => currency !== 'USDT');
      return dispatch(actionCurrencies(newCurrencies));
    } catch (error) {
      return dispatch(failedRequestAPI(error));
    }
  };
}

export const actionExpense = (expenses) => ({
  type: 'USER_EXPENSE',
  expenses,
});
