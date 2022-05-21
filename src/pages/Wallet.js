import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { actionExpense, fetchCurrencies, saveExpenses } from '../actions';

const FOOD = 'Alimentação';
class Wallet extends React.Component {
  constructor() {
    super();

    this.state = {
      valueState: 0,
      descState: '',
      currencyState: 'USD',
      methodState: 'Dinheiro',
      tagState: FOOD,
    };
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
    const { valueState, currencyState } = this.state;
    const { total } = this.props;

    const rates = Object.entries(exchangeRates);

    // check if currency name is the same as the currency of state, get 'ask' and multiplies with the value of state
    let newTotal = 0;
    rates.forEach(([currencyObj, info]) => {
      if (currencyObj === currencyState) {
        newTotal = ((info.ask * valueState) + total);
      }
    });

    return newTotal;
  }

  saveExpense = async (event) => {
    event.preventDefault();

    const { valueState, descState, currencyState, methodState, tagState } = this.state;
    const { sendExpense, expenses } = this.props;

    const id = expenses.length === 0 ? 0 : expenses.length;

    const { currencies, total } = await this.getRates();
    sendExpense({
      id,
      value: valueState,
      description: descState,
      currency: currencyState,
      method: methodState,
      tag: tagState,
      exchangeRates: currencies,
    }, total);

    this.cleanState();
  }

  cleanState = () => {
    this.setState({
      valueState: '',
      descState: '',
      currencyState: 'USD',
      methodState: 'Dinheiro',
      tagState: FOOD,
    });
  }

  deleteExpense = ({ target }) => {
    const { expenses, deletingExpense } = this.props;
    const { parentElement: { parentElement: { id } } } = target;

    // catch id from the expense
    // get the expenses on the store from mapStateToProp
    // HOF filter, get all expenses where ID isn't the same
    const removingExpense = expenses.filter((expense) => expense.id !== Number(id));

    // recalculate new total, as we delete an expense
    let newTotal = 0;
    removingExpense.forEach(({ value, currency, exchangeRates }) => {
      newTotal += value * exchangeRates[currency].ask;
    });

    deletingExpense(removingExpense, newTotal);
  }

  render() {
    const { email, currencies, total, expenses } = this.props;
    const { valueState, descState, currencyState, methodState, tagState } = this.state;

    // calculating total
    let newTotal = 0;
    expenses.forEach(({ value, currency, exchangeRates }) => {
      newTotal += value * exchangeRates[currency].ask;
    });

    return (
      <>
        <header>
          <h1 data-testid="email-field">{ email }</h1>
          <span>Despesa total</span>
          <p
            data-testid="total-field"
          >
            { newTotal.toFixed(2)}
          </p>
          <p data-testid="header-currency-field">BRL</p>
        </header>
        <form>
          <label htmlFor="valueState">
            Valor:
            <input
              type="number"
              value={ valueState }
              name="valueState"
              id="valueState"
              onChange={ this.handleChange }
              data-testid="value-input"
            />
          </label>

          <label htmlFor="descState">
            Descrição:
            <input
              id="descState"
              value={ descState }
              name="descState"
              onChange={ this.handleChange }
              data-testid="description-input"
            />
          </label>

          <label htmlFor="currencyState">
            Moeda:
            <select
              name="currencyState"
              value={ currencyState }
              onChange={ this.handleChange }
              id="currencyState"
            >
              { currencies.length > 0 && currencies.map((curr) => (
                <option key={ curr } value={ curr }>{curr}</option>
              )) }
            </select>

          </label>

          <label htmlFor="methodState">
            Método de pagamento:
            <select
              name="methodState"
              value={ methodState }
              onChange={ this.handleChange }
              id="methodState"
              data-testid="method-input"
            >
              <option>Dinheiro</option>
              <option>Cartão de crédito</option>
              <option>Cartão de débito</option>
            </select>
          </label>

          <label htmlFor="tagState">
            Categoria:
            <select
              name="tagState"
              value={ tagState }
              onChange={ this.handleChange }
              id="tagState"
              data-testid="tag-input"
            >
              <option>{ FOOD }</option>
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
          <tbody>
            { expenses.length !== 0 && expenses.map(({
              id, description, tag, method, value, currency, exchangeRates,
            }) => (
              <tr key={ id } id={ id }>
                <td>{ description }</td>
                <td>{ tag }</td>
                <td>{ method }</td>
                <td>{ Number(value).toFixed(2) }</td>
                <td>{ exchangeRates[currency].name }</td>
                <td>{ (Number(exchangeRates[currency].ask)).toFixed(2) }</td>
                <td>{ (value * exchangeRates[currency].ask).toFixed(2) }</td>
                <td>Real</td>
                <td>
                  <button type="button" data-testid="edit-btn">Editar</button>
                  <button
                    type="button"
                    data-testid="delete-btn"
                    onClick={ this.deleteExpense }
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
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
  deletingExpense: (expense, total) => dispatch(saveExpenses(expense, total)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Wallet);
