import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { fetchCurrencies } from '../actions';

class Wallet extends React.Component {
  componentDidMount() {
    const { requestAPI } = this.props;
    requestAPI();
  }

  render() {
    const { email, currencies } = this.props;

    return (
      <>
        <header>
          <h1 data-testid="email-field">{ email }</h1>
          <p data-testid="total-field">0</p>
          <p data-testid="header-currency-field">BRL</p>
        </header>
        <main>
          <label htmlFor="value">
            Valor:
            <input type="number" id="value" data-testid="value-input" />
          </label>

          <label htmlFor="description">
            Descrição:
            <input id="description" data-testid="description-input" />
          </label>

          <label htmlFor="currencies">
            Moeda:
            <select id="currencies">
              { currencies.length > 0 && currencies.map((currency) => (
                <option key={ currency } value={ currency }>{currency}</option>
              )) }
            </select>

          </label>

          <label htmlFor="payment">
            Método de pagamento:
            <select id="payment" data-testid="method-input">
              <option>Dinheiro</option>
              <option>Cartão de crédito</option>
              <option>Cartão de débito</option>
            </select>
          </label>

          <label htmlFor="categories">
            Categoria:
            <select id="categories" data-testid="tag-input">
              <option>Alimentação</option>
              <option>Lazer</option>
              <option>Trabalho</option>
              <option>Transporte</option>
              <option>Saúde</option>
            </select>
          </label>
        </main>
      </>

    );
  }
}

Wallet.propTypes = {
  email: PropTypes.string,
  requestAPI: PropTypes.func,
  currencies: PropTypes.array,
}.isRequired;

const mapStateToProps = (state) => ({
  email: state.user.email,
  currencies: state.wallet.currencies,
});

const mapDispatchToProps = (dispatch) => ({
  requestAPI: () => dispatch(fetchCurrencies()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Wallet);
