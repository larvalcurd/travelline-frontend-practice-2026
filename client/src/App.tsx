import { CurrencyConverterCard } from './components/CurrencyConverterCard/CurrencyConverterCard';

const App = () => {
  return (
    <CurrencyConverterCard
      rate="0.99"
      date="Fri, 05 Apr 2026 10:35 UTC"
      fromCurrency="PLN"
      toCurrency="JPY"
    />
  );
};

export default App;
