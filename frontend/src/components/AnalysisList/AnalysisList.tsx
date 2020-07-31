import React, { useState } from 'react';
import './AnalysisList.scss'

interface Props {

}

function AnalysisList(props: Props){

    const [analysisList, setAnalysisList] = useState([
        "Mobile Squatting",
        "Permission requests"
        ]);

    
    return (
        <div className="analysisListContainer">
            <h5>Type of Analysis</h5>
            <input placeholder="What kind of analysis?" list="analysis" name="analysisList" id="analysisList"/>
                <datalist id="analysis">
                    {analysisList.map((analysis) => {
                        return <option key={analysis} value={analysis}/>
                    })}
                </datalist> 
        </div>
    )

}

export default AnalysisList;