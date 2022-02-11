import React, { useEffect, useState } from 'react';
import './App.css';
import CurrencyRow from './CurrencyRow'

const BASE_URL = 'http://api.exchangeratesapi.io/v1/latest?access_key=b5a3385ea2855c54807aa02466bcef52&symbols=AED,AFN,AUD,BBD,BDT,BGN,BRL,CAD,CZK,EGP,JPY,RUB,USD'
const username = 'oKrolik'

function App() {
  const [currencyOptions, setCurrencyOptions] = useState([])
  const [fromCurrency, setFromCurrency] = useState()
  const [toCurrency, setToCurrency] = useState()
  const [exchangeRate, setExchangeRate] = useState()
  const [amount, setAmount] = useState(1)
  const [amountInFromCurrency, setAmountInFromCurrency] = useState(true)

  let toAmount, fromAmount
  if (amountInFromCurrency) {
    fromAmount = amount
    toAmount = amount * exchangeRate
  } else {
    toAmount = amount
    fromAmount = amount / exchangeRate
  }

  useEffect(() => {
    fetch(BASE_URL)
      .then(res => res.json())
      .then(data => {
        const firstCurrency = Object.keys(data.rates)[0]
        setCurrencyOptions([data.base, ...Object.keys(data.rates)])
        setFromCurrency(data.base)
        setToCurrency(firstCurrency)
        setExchangeRate(data.rates[firstCurrency])
      })
  }, [])

  useEffect(() => {
    if (fromCurrency != null && toCurrency != null) {
      fetch(`${BASE_URL}?base=${fromCurrency}&symbols=${toCurrency}`)
        .then(res => res.json())
        .then(data => setExchangeRate(data.rates[toCurrency]))
    }
  }, [fromCurrency, toCurrency])

  function handleFromAmountChange(e) {
    setAmount(e.target.value)
    setAmountInFromCurrency(true)
  }

  function handleToAmountChange(e) {
    setAmount(e.target.value)
    setAmountInFromCurrency(false)
  }

  return (
    <div class="box">
      <h1>Exchanger</h1>
      <h2>Your Currency</h2>
      <h3>Converter</h3>
      <CurrencyRow
        currencyOptions={currencyOptions}
        selectedCurrency={fromCurrency}
        onChangeCurrency={e => setFromCurrency(e.target.value)}
        onChangeAmount={handleFromAmountChange}
        amount={fromAmount}
      />
      <div className="equals">=</div>
      <CurrencyRow
        currencyOptions={currencyOptions}
        selectedCurrency={toCurrency}
        onChangeCurrency={e => setToCurrency(e.target.value)}
        onChangeAmount={handleToAmountChange}
        amount={toAmount}
      />
      <div class="flag">
        <div class="left"><img src={fromCurrency != null ? require(`./img/${fromCurrency}.png`) : require(`./img/EUR.png`)} width={30} height={20} align="left"/></div>
        <div class="right"><img src={toCurrency != null ? require(`./img/${toCurrency}.png`) : require(`./img/AED.png`)} width={30} height={20} align="right"/></div>
        {/* <div class="left"><img src={fromCurrency == null ? require(`./img/EUR.png`) : require(`./img/${fromCurrency}.png`)} width={30} height={20} align="left" /></div> */}
        {/* <div class="right"><img src={toCurrency == null ? require(`./img/BRL.jpg`) : require(`./img/${toCurrency}.jpg`)} width={30} height={20} align="right" /></div> */}
      </div>
      <div class="findMe"><a href={`https://github.com/${username}`} target="_blank" rel="noreferrer">oKrolik</a></div>
    </div>
  );
}

export default App;