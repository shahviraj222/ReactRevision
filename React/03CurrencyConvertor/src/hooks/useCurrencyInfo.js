import { useEffect,useState } from "react";

function useCurrencyInfo(currency) {
    const [data,setData] = useState({})
    useEffect(()=>{
        fetch(`https://latest.currency-api.pages.dev/v1/currencies/${currency}.json`)
        .then((response)=>response.json())
        .then((r)=> setData(r[currency]));     // never use the r.currency some issue is there
        
    },[currency])
    return data
}

export default useCurrencyInfo;