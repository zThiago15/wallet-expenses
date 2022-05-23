import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { actionExpense, fetchCurrencies, updateExpenses } from '../actions';

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
      editExpense: false,
      editId: '',
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

    return { currencies };
  }

  saveExpense = async (event) => {
    event.preventDefault();

    const { valueState, descState, currencyState, methodState,
      tagState, editExpense, editId } = this.state;

    const { sendExpense, expenses, updateExpense } = this.props;

    const id = expenses.length === 0 ? 0 : expenses.length;

    const { currencies } = await this.getRates();

    // when I save, search for the same ID, edit and send it
    if (editExpense) {
      expenses.forEach((expense, index) => {
        if (expense.id === editId) {
          expenses[index] = {
            id: editId,
            value: valueState,
            description: descState,
            currency: currencyState,
            method: methodState,
            tag: tagState,
            exchangeRates: currencies,
          };
        }
      });

      updateExpense(expenses);

      // estado inicial
      this.setState({
        editExpense: false,
        editId: '',
      });
    } else {
      sendExpense({
        id,
        value: valueState,
        description: descState,
        currency: currencyState,
        method: methodState,
        tag: tagState,
        exchangeRates: currencies,
      });
    }

    this.cleanState();
  }

  cleanState = () => {
    this.setState({
      valueState: 0,
      descState: '',
      currencyState: 'USD',
      methodState: 'Dinheiro',
      tagState: FOOD,
    });
  }

  deleteExpense = ({ target }) => {
    const { expenses, updateExpense } = this.props;
    const { parentElement: { parentElement: { id } } } = target;

    // catch id from the expense
    // get the expenses on the store from mapStateToProp
    // HOF filter, get all expenses where ID isn't the same
    const removingExpense = expenses.filter((expense) => expense.id !== Number(id));

    updateExpense(removingExpense);
  }

  showDataOnForm = (value, description, currency, method, tag, id) => {
    this.setState({
      valueState: value,
      descState: description,
      currencyState: currency,
      methodState: method,
      tagState: tag,
      editExpense: true,
      editId: id,
    });
  }

  render() {
    const { email, currencies, expenses } = this.props;
    const { valueState, descState, currencyState, methodState,
      tagState, editExpense } = this.state;

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
              data-testid="currency-input"
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

          <button
            type="submit"
            onClick={ this.saveExpense }
          >
            { !editExpense ? 'Adicionar despesa' : 'Editar despesa' }
          </button>
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
                <td>{ (exchangeRates[currency].name).split('/Real Brasileiro') }</td>
                <td>{ Number(exchangeRates[currency].ask).toFixed(2) }</td>
                <td>{ (value * exchangeRates[currency].ask).toFixed(2) }</td>
                <td>Real</td>
                <td>
                  <button
                    type="button"
                    data-testid="edit-btn"
                    onClick={ () => this.showDataOnForm(value, description,
                      currency, method, tag, id) }
                  >
                    Editar
                  </button>
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
});

const mapDispatchToProps = (dispatch) => ({
  requestAPI: () => dispatch(fetchCurrencies()),
  sendExpense: (expense) => dispatch(actionExpense(expense)),
  updateExpense: (expense) => dispatch(updateExpenses(expense)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Wallet);
