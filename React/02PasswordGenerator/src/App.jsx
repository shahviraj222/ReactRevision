import { useState, useCallback, useEffect, useRef } from 'react'

function App() {

  const passwordRef  =useRef(null)
  const [charAllowed, setCharAllowed] = useState(true)
  const [numberAllowed, setNumberAllowed] = useState(true)
  const [length, setLength] = useState(8)
  const [pass, setPassword] = useState('')


  // usecallback is help to store the fun in the cahe usecallback for optimization purpose

  const passwordGenarator = useCallback(() => {
    let pass = ""
    let str = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
    if (numberAllowed) str += "0123456789"
    if (charAllowed) str += "!@#$^&*-_+=[l{}~'"
    for (let i = 1; i <= length; i++) {
      let index = Math.floor(Math.random() * str.length + 1)
      // pass += str[index]
      pass += str.charAt(index)
    }
    
    setPassword(pass)
  }, [charAllowed, numberAllowed, length,setPassword])

  useEffect(()=>{
    passwordGenarator()
  },[charAllowed, numberAllowed, length,passwordGenarator])

  function copyPasswordToClipboard(){
    console.log(passwordRef.current.value)
    window.navigator.clipboard.writeText(passwordRef.current.value)
    passwordRef.current?.select();                    // for giving highlight
    passwordRef.current.setSelectionRange(0, 9);     //only 9 char are highlighted
  }
  
  return (
    <>
    <div className="w-full max-w-md mx-auto shadow-md rounded-lg px-4 py-3 my-8 bg-gray-800 text-orange-500">
      <h1 className='text-white text-center my-3'>Password generator</h1>
    <div className="flex shadow rounded-lg overflow-hidden mb-4">
        <input
            type="text"
            value={pass}
            className="outline-none w-full py-1 px-3"
            placeholder="Password"
            readOnly
            ref={passwordRef}
        />
        <button
        onClick={copyPasswordToClipboard}
        className='outline-none bg-blue-700 text-white px-3 py-0.5 shrink-0'
        >copy</button>
        
    </div>
    <div className='flex text-sm gap-x-2'>
      <div className='flex items-center gap-x-1'>
        <input 
        type="range"
        min={6}
        max={100}
        value={length}
         className='cursor-pointer'
         onChange={(e) => {setLength(e.target.value)}}
          />
          <label>Length: {length}</label>
      </div>
      <div className="flex items-center gap-x-1">
      <input
          type="checkbox"
          defaultChecked={numberAllowed}
          id="numberInput"
          onChange={() => {
            setNumberAllowed((prev) => !prev);
            // console.log(numberAllowed)  this print wrong value because the useState hook run asynchronously
            // if you want to write the code run once it update all then write inside the call back function
        }}
    />
    <label htmlFor="numberInput">Numbers</label>
    </div>
    <div className="flex items-center gap-x-1">
        <input
            type="checkbox"
            defaultChecked={charAllowed}
            id="characterInput"
            onChange={() => {
                setCharAllowed((prev) => !prev )
            }}
        />
        <label htmlFor="characterInput">Characters</label>
    </div>
  </div>
</div>
    </>
  )
}

export default App
