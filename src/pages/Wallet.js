import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { actionWallet } from '../actions';

class Wallet extends React.Component {
  componentDidMount() {
    this.getCurrentCurrencies();
  }

  getCurrentCurrencies = async () => {
    const { saveCurrencies } = this.props;

    const response = await fetch('https://economia.awesomeapi.com.br/json/all');
    const objCurrencies = Object.keys(await response.json());

    // Removing USTD currency
    const newObjCurrencies = objCurrencies.filter((currency) => currency !== 'USDT');

    saveCurrencies(newObjCurrencies);
  }

  render() {
    const { email } = this.props;

    return (
      <header>
        <h1 data-testid="email-field">{ email }</h1>
        <p data-testid="total-field">0</p>
        <p data-testid="header-currency-field">BRL</p>
      </header>
    );
  }
}

Wallet.propTypes = {
  email: PropTypes.string.isRequired,
  saveCurrencies: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  email: state.user.email,
});

const mapDispatchToProps = (dispatch) => ({
  saveCurrencies: (currencies) => dispatch(actionWallet(currencies)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Wallet);
