import React from 'react';

function InputBox({
    label = "",
    className = "",
    amount,
    onamountchaged,
    selectCurrency = 'usd',
    onCurrencyChange,
    disable,
    currency = [],
}) {
    return (
        <div className={`bg-gray-100 p-4 rounded-lg text-sm flex ${className}`}>
            <div className="w-1/2">
                <label className="text-gray-600 mb-2 inline-block">
                    {label}
                </label>
                <input
                    className="outline-none w-full bg-white py-1.5 px-2 rounded-md border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    type="number"
                    placeholder="Amount"
                    value={amount}
                    onChange={onamountchaged}
                    disabled={disable}
                />
            </div>
            <div className="w-1/2 flex flex-wrap justify-end text-right">
                <p className="text-gray-600 mb-2 w-full">Currency Type</p>
                <select
                    className="rounded-lg px-2 py-1 bg-white border border-gray-300 cursor-pointer focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    value={selectCurrency}
                    onChange={onCurrencyChange}
                >
                    {currency.map((x) => (
                        <option key={label + x} value={x}>
                            {x}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}

export default InputBox;