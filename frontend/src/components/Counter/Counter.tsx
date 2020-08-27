import React, { useState, useEffect } from 'react';
import './Counter.scss'

function Counter(){

    const [count, setCount] = useState(0);

    return (
        <div className="counterContainer">
            <div>Max</div>
            <div className="appsNumber">
                <div className="counterButton" onClick={() => (count > 0) && setCount(count - 1 >= 0 ? count - 1 : 0)}><span>-</span></div>
                {/* <input placeholder="All" name="max" id="count" className="counter" value={count}/> */}
                <input placeholder="All" name="max" id="count" className="counter" value={count} onChange={() => {}}/>
                <div className="counterButton" onClick={() => setCount(count + 1)}><span>+</span></div>
            </div>
        </div>
    )


}

export default Counter;
