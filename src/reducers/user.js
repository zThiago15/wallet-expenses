// Esse reducer será responsável por tratar as informações da pessoa usuária

const initialState = {
  email: '',
};

const user = (state = initialState, action) => {
  switch (action.type) {
  case 'USER_EMAIL':
    return { ...state, email: action.email };
  default:
    return state;
  }
};

export default user;
