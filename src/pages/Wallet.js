import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { actionExpense, fetchCurrencies, updateExpenses } from '../actions';
import FormExpense from './FormExpense';

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
            exchangeRates: expense.exchangeRates,
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

  showDataOnForm = ({ value, description, currency, method, tag, id }) => {
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
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0-beta1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-0evHe/X+R7YkIZDRvuzKMRqM+OrBnVFBL6DOitfPri4tjfHxaWutUpFmBp4vmVor" crossOrigin="anonymous" />
        <FormExpense
          valueState={ valueState }
          descState={ descState }
          currencyState={ currencyState }
          method={ methodState }
          tagState={ tagState }
          editExpense={ editExpense }
          email={ email }
          currencies={ currencies }
          total={ newTotal }
          handleChange={ this.handleChange }
          saveExpense={ this.saveExpense }
        />
        <table className="table table-dark table-striped">
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
                    onClick={ () => this.showDataOnForm({ value,
                      description,
                      currency,
                      method,
                      tag,
                      id }) }
                    className="btn btn-warning"
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    data-testid="delete-btn"
                    onClick={ this.deleteExpense }
                    className="btn btn-danger"
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
