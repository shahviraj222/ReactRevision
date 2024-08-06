import React from 'react';
import { useState } from 'react';

// function Button({id,name}){
//     function changebackground(event){
//         // One Way   
//         document.body.style.backgroundColor = event.target.innerText;

//     }
//     console.log(name,id)
//     return(
//         <button style={{backgroundColor:name,padding:'10px',display:'inline-block',margin:'10px'}} onClick={changebackground}>
//             {name}
//         </button>
//     )
// }

// Wrong Way of doing 

function Menu(props) {
    const[color,setColor]=useState('white')

    function Button({id,name}){

        function changebackground(event){
            
            setColor(event.target.innerText)
            console.log("Runn")
            document.body.style.backgroundColor = color;
        }
        console.log(name,id)
        return(
            <button style={{backgroundColor:name,padding:'10px',display:'inline-block',margin:'10px'}} onClick={changebackground}>
                {name}
            </button>
        )
    }

    return (
        <div className='menu' id='color-menu' style={{backgroundColor:'brown',padding:'10px',display:'inline-block'}}>
            {
                props.color.map((x)=>{
                    return (<Button key={x} name={x} id={`button-${x}`}></Button>)
                })
                
            }
        </div>
    );
}

export default Menu;