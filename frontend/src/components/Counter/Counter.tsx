import React, { useState, useEffect } from 'react';
import './Counter.scss'

interface Props {
    name: string
}

function Counter(props: Props){

    const [count, setCount] = useState(0);

    return (
        <div className="counterContainer">
            <div>{props.name}</div>
            <div className="appsNumber">
                <div className="counterButton" onClick={() => (count > 0) && setCount(count - 1)}><span>-</span></div>
                <input placeholder="All" name={props.name} id="count" className="counter" value={count}/>
                <div className="counterButton" onClick={() => setCount(count + 1)}><span>+</span></div>
            </div>
        </div>
    )


}

export default Counter;
