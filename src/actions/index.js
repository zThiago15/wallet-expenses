// Coloque aqui suas actions
export const actionEmail = (email) => ({
  type: 'USER_EMAIL',
  email,
});

export const actionWallet = (currencies) => ({
  type: 'USER_WALLET',
  currencies,
});
