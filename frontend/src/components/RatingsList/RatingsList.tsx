import React, { useState } from 'react';
import './RatingsList.scss'

function RatingsList(){

    const [min, setMin] = useState(0);
    
    return (
        <div className="ratingsListContainer">
            <h5>Ratings (&gt; {min})</h5>
            <input type="range"  name="rating" id="rating" min="0" max="5" step="0.1" defaultValue="0" onChange={() => setMin(parseFloat((document.getElementById("rating")as HTMLTextAreaElement).value))}/>
        </div>
    )

}

export default RatingsList;