import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { actionExpense, fetchCurrencies } from '../actions';

class Wallet extends React.Component {
  state = {
    value: 0,
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
    const response = await fetch('https://economia.awesomeapi.com.br/json/all');
    const currencies = await response.json();

    // calculate total
    const total = this.recalculateTotal(currencies);

    return { currencies, total };
  }

  recalculateTotal = (exchangeRates) => {
    const { value, currency } = this.state;
    const { total } = this.props;

    const rates = Object.entries(exchangeRates);

    // check if currency name is the same as the currency of state, get 'ask' and multiplies with the value of state
    let newTotal = 0;
    rates.forEach(([currencyObj, info]) => {
      if (currencyObj === currency) {
        newTotal = ((info.ask * value) + total);
      }
    });

    return newTotal;
  }

  saveExpense = async (event) => {
    event.preventDefault();

    const { value, description, currency, method, tag } = this.state;
    const { sendExpense, expenses } = this.props;

    const id = expenses.length === 0 ? 0 : expenses.length;

    const { currencies, total } = await this.getRates();
    sendExpense({
      id,
      value,
      description,
      currency,
      method,
      tag,
      exchangeRates: currencies,
    }, total);

    this.cleanState();
  }

  cleanState = () => {
    this.setState({
      value: '',
      description: '',
      currency: 'USD',
      method: 'Dinheiro',
      tag: 'Alimentação',
    });
  }

  render() {
    const { email, currencies, total } = this.props;
    const { value, description, currency, method, tag } = this.state;

    return (
      <>
        <header>
          <h1 data-testid="email-field">{ email }</h1>
          <span>Despesa total</span>
          <p data-testid="total-field">{ total && total.toFixed(2) }</p>
          <p data-testid="header-currency-field">BRL</p>
        </header>
        <form>
          <label htmlFor="value">
            Valor:
            <input
              type="number"
              value={ value }
              name="value"
              id="value"
              onChange={ this.handleChange }
              data-testid="value-input"
            />
          </label>

          <label htmlFor="description">
            Descrição:
            <input
              id="description"
              value={ description }
              name="description"
              onChange={ this.handleChange }
              data-testid="description-input"
            />
          </label>

          <label htmlFor="currency">
            Moeda:
            <select
              name="currency"
              value={ currency }
              onChange={ this.handleChange }
              id="currency"
            >
              { currencies.length > 0 && currencies.map((curr) => (
                <option key={ curr } value={ curr }>{curr}</option>
              )) }
            </select>

          </label>

          <label htmlFor="method">
            Método de pagamento:
            <select
              name="method"
              value={ method }
              onChange={ this.handleChange }
              id="method"
              data-testid="method-input"
            >
              <option>Dinheiro</option>
              <option>Cartão de crédito</option>
              <option>Cartão de débito</option>
            </select>
          </label>

          <label htmlFor="tag">
            Categoria:
            <select
              name="tag"
              value={ tag }
              onChange={ this.handleChange }
              id="tag"
              data-testid="tag-input"
            >
              <option>Alimentação</option>
              <option>Lazer</option>
              <option>Trabalho</option>
              <option>Transporte</option>
              <option>Saúde</option>
            </select>
          </label>

          <button type="submit" onClick={ this.saveExpense }>Adicionar despesa</button>
        </form>

        <table>
          <thead>
            <tr>
              <th>Descrição</th>
              <th>Tag</th>
              <th>Método de pagamento</th>
              <th>Valor</th>
              <th>Moeda</th>
              <th>Câmbio utilizado</th>
              <th>Valor convertido</th>
              <th>Moeda de conversão</th>
              <th>Editar/Excluir</th>
            </tr>
          </thead>
        </table>
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
  total: state.wallet.total,
});

const mapDispatchToProps = (dispatch) => ({
  requestAPI: () => dispatch(fetchCurrencies()),
  sendExpense: (expense, total) => dispatch(actionExpense(expense, total)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Wallet);
