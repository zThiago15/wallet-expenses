import React, { Component } from 'react';
import PropTypes from 'prop-types';
import '../css/Wallet.css';

export default class FormExpense extends Component {
  render() {
    const { valueState, descState, currencyState, methodState,
      tagState, editExpense, email, currencies, total,
      handleChange, saveExpense } = this.props;
    return (
      <div>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0-beta1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-0evHe/X+R7YkIZDRvuzKMRqM+OrBnVFBL6DOitfPri4tjfHxaWutUpFmBp4vmVor" crossOrigin="anonymous" />
        <header>
          <div>
            <h2>E-mail</h2>
            <p className="header-info" data-testid="email-field">{ email }</p>
          </div>
          <div>
            <h2 id="expense-title">Despesa total</h2>
            <p
              className="header-info"
              data-testid="total-field"
            >
              { total.toFixed(2)}
            </p>
          </div>
          <div>
            <h2>Moeda</h2>
            <p className="header-info" data-testid="header-currency-field">BRL</p>
          </div>
        </header>
        <form className="containerForm">
          <label htmlFor="valueState" className="form-label">
            Valor:
            <input
              type="number"
              value={ valueState }
              name="valueState"
              id="valueState"
              onChange={ handleChange }
              data-testid="value-input"
              className="form-control"
            />
          </label>

          <label htmlFor="descState">
            Descrição:
            <input
              id="descState"
              value={ descState }
              name="descState"
              onChange={ handleChange }
              data-testid="description-input"
              className="form-control"
            />
          </label>

          <label htmlFor="currencyState">
            Moeda:
            <select
              name="currencyState"
              value={ currencyState }
              onChange={ handleChange }
              id="currencyState"
              data-testid="currency-input"
              className="form-select"
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
              onChange={ handleChange }
              id="methodState"
              data-testid="method-input"
              className="form-select"
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
              onChange={ handleChange }
              id="tagState"
              data-testid="tag-input"
              className="form-select"
            >
              <option>Alimentação</option>
              <option>Lazer</option>
              <option>Trabalho</option>
              <option>Transporte</option>
              <option>Saúde</option>
            </select>
          </label>

          <button
            type="submit"
            onClick={ saveExpense }
            className="btn btn-primary"
          >
            { !editExpense ? 'Adicionar despesa' : 'Editar despesa' }
          </button>
        </form>
      </div>
    );
  }
}

FormExpense.propTypes = {
  valueState: PropTypes.number,
  descState: PropTypes.string,
  currencyState: PropTypes.string,
  methodState: PropTypes.string,
  tagState: PropTypes.string,
  editExpense: PropTypes.bool,
}.isRequired;
