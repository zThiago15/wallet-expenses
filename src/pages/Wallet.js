import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { actionExpense, fetchCurrencies } from '../actions';

class Wallet extends React.Component {
  state = {
    value: '',
    description: '',
    currency: 'USD',
    method: 'Dinheiro',
    tag: 'Alimentação',
  }

  componentDidMount() {
    const { requestAPI } = this.props;
    requestAPI();
  }

  handleChange = ({ target: { name, value } }) => {
    this.setState({
      [name]: value,
    });
  }

  getRates = async () => {
    // pegar o valor da API, menos USTD
    const response = await fetch('https://economia.awesomeapi.com.br/json/all');
    const currencies = Object.entries(await response.json());

    const newCurrencies = currencies.filter(([currency, info]) => currency !== 'USDT');
    
    console.log(newCurrencies);
    // const rates = newCurrencies.map(([]))
  }

  saveExpense = (event) => {
    event.preventDefault();

    const { value, description, currency, method, tag } = this.state;
    const { sendExpense, expenses } = this.props;

    // Verificar o tamanho do expense atual, e adicionar +1, que será o id a ser adicionado
    const id = expenses.length === 0 ? 0 : expenses.length;

    const exchangeRates = this.getRates();
    sendExpense({
      id,
      value,
      description,
      currency,
      method,
      tag,
    });
  }

  render() {
    const { email, currencies } = this.props;

    return (
      <>
        <header>
          <h1 data-testid="email-field">{ email }</h1>
          <span>Despesa total</span>
          <p data-testid="total-field">0</p>
          <p data-testid="header-currency-field">BRL</p>
        </header>
        <form>
          <label htmlFor="value">
            Valor:
            <input type="number" name="value" id="value" onChange={ this.handleChange } data-testid="value-input" />
          </label>

          <label htmlFor="description">
            Descrição:
            <input id="description" name="description" onChange={ this.handleChange } data-testid="description-input" />
          </label>

          <label htmlFor="currency">
            Moeda:
            <select name="currency" onChange={ this.handleChange } id="currency">
              { currencies.length > 0 && currencies.map((currency) => (
                <option key={ currency } value={ currency }>{currency}</option>
              )) }
            </select>

          </label>

          <label htmlFor="method">
            Método de pagamento:
            <select name="method" onChange={ this.handleChange } id="method" data-testid="method-input">
              <option>Dinheiro</option>
              <option>Cartão de crédito</option>
              <option>Cartão de débito</option>
            </select>
          </label>

          <label htmlFor="tag">
            Categoria:
            <select name="tag" onChange={ this.handleChange } id="tag" data-testid="tag-input">
              <option>Alimentação</option>
              <option>Lazer</option>
              <option>Trabalho</option>
              <option>Transporte</option>
              <option>Saúde</option>
            </select>
          </label>

          <button type="submit" onClick={ this.saveExpense }>Adicionar despesa</button>
        </form>
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
  expenses: state.wallet.expenses,
});

const mapDispatchToProps = (dispatch) => ({
  requestAPI: () => dispatch(fetchCurrencies()),
  sendExpense: (expense) => dispatch(actionExpense(expense)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Wallet);
