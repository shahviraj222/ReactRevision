import { useEffect, useState } from 'react'
import useCurrencyInfo from './hooks/useCurrencyInfo'
import InputBox from './components/InputBox'

function App() {
  

  const [fromamount,onfromamountchaged] = useState(0)            // here the fromamount automatically assign as interger
  const [fromcurrency,onFromCurrencyChaged] = useState('usd')
  
  const [toamount,ontoamountchaged] = useState(0)               //here the fromamount automatically assign as interger
  const [tocurrency,ontoCurrencyChaged] = useState('inr')
 

  let a = useCurrencyInfo(fromcurrency)
  const currencyName=Object.keys(a)

  function convert(){
    const temp=Number(a[tocurrency])

    console.log(temp)
    ontoamountchaged(temp*fromamount)
  }

  useEffect(()=>{
    convert()
  },[fromamount,useCurrencyInfo])
  



  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-6">Currency Converter</h1>
        
        <InputBox 
          label='From' 
          currency={currencyName} 
          amount={fromamount} 
          onamountchaged={(e) => onfromamountchaged(e.target.value)}
          selectCurrency={fromcurrency}
          onCurrencyChange={(e) => onFromCurrencyChaged(e.target.value)}
          className="m-5"
        />

        <InputBox 
          label='To' 
          currency={currencyName} 
          amount={toamount} 
          onamountchaged={(e) => ontoamountchaged(e.target.value)}
          selectCurrency={tocurrency}
          onCurrencyChange={(e) => ontoCurrencyChaged(e.target.value)}
          className="m-5"
          disable={true}
        />

        <button 
          type='submit' 
          onClick={convert}
          className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors mr-5"
        >
          Convert
        </button>

        <p className="mt-4 text-center text-lg font-medium text-gray-700">
          Converted Amount: <span className="text-green-500">{toamount}</span>
        </p>
      </div>
    </div>
  )
}

export default App
