import React, { useState } from 'react';

// chnange in c doesn't propogate to the card
let c = [{ id: "1", name: "Viraj" }, { id: "2", name: "Siddhi" }, { id: "3", name: "Vimal" }, { id: "4", name: "Bunty" }];

function Card(props) {
    return (
        <div className='p-5'>
            <h2>{props.id} Name Of User:{props.name}</h2>
        </div>
    );
}

function Cardlist() {

    // Hooks
    let [card, setcard] = useState(c)

    function removecard() {
        card = card.filter((x) => {
            if (!(x.id % 2 == 0)) {
                return x
            }
        })
        // const updatedCards = cards.filter(x => x.id % 2 !== 0);
        // setcard(updatedCards)
        setcard(card)
        console.log(card)

    }

    return (
        <div>

            {card.map((x) => {
                // in arrow fucntion you have to do return explicit 
    
                return (<Card key={x.id} id={x.id} name={x.name} ></Card>)    // id is created here only
            })}
            <button className='bg-orange-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-orange-600 transition duration-300' onClick={removecard} key={"even_remove_button"}>RemoveEvenFilter</button>
        </div>
    );
}


export default Cardlist;