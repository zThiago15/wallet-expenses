import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class FormExpense extends Component {
  render() {
    const { valueState, descState, currencyState, methodState,
      tagState, editExpense, email, currencies, total,
      handleChange, saveExpense } = this.props;
    return (
      <div>
        <header>
          <h1 data-testid="email-field">{ email }</h1>
          <span>Despesa total</span>
          <p
            data-testid="total-field"
          >
            { total.toFixed(2)}
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
              onChange={ handleChange }
              data-testid="value-input"
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
