import React from 'react';
import { connect } from 'react-redux';
import { actionEmail } from '../actions';
import PropTypes from 'prop-types';

class Login extends React.Component {
  state = {
    email: '',
    password: '',
  }

  handleChange = ({ target: { name, value } }) => {
    this.setState({
      [name]: value,
    });
  }

  validation = () => {
    const { email, password } = this.state;
    const regex = /\S+@\S+\.\S+/;

    const minLengthInput = 6;
    if (password.length < minLengthInput || !regex.test(email)) {
      return true;
    }

    return false;
  }

  render() {
    const { email } = this.state;
    const { emailDispatch, history } = this.props;

    return (
      <div>
        <label htmlFor="email">
          E-mail
          <input
            data-testid="email-input"
            type="email"
            id="email"
            name="email"
            onChange={ this.handleChange }
          />
        </label>

        <label htmlFor="password">
          Senha
          <input
            data-testid="password-input"
            type="password"
            id="password"
            name="password"
            onChange={ this.handleChange }
          />
        </label>

        <button
          type="button"
          disabled={ this.validation() }
          onClick={ () => { emailDispatch(email); return history.push('/carteira'); }}
        >
          Entrar
        </button>
      </div>
    );
  }
}

Login.propTypes = {
  emailDispatch: PropTypes.func,
  history: PropTypes.func,
}.isRequired;

const mapDispatchToProps = (dispatch) => ({
  emailDispatch: (email) => dispatch(actionEmail(email)),
});

export default connect(null, mapDispatchToProps)(Login);
