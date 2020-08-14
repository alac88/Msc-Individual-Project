
import React, { useState } from 'react';
import './AnalysisList.scss'

function AnalysisList(props: any){

    const [analysisList, setAnalysisList] = useState([
        "Pre-static",
        "Static",
        "Both"]);

    
    return (
        <div className="analysisListContainer">
            {/* <form className="comparisonForm"> */}
                {/* <input placeholder="Type of Analysis" list="analysisList" name="analysis" id="analysis"/>
                    <datalist id="analysisList">
                        {analysisList.map((analysis) => {
                            return <option key={analysis} value={analysis}/>
                        })}
                    </datalist>  */}

                <div className="button">
                    <input type="submit" name="compare" value={props.listLength == 1 ? "Analyse" : (props.listLength > 1 ? "Compare" : "Select apps")} className="danger" onClick={props.select} disabled={ props.listLength >= 1 ? false : true }/>
                </div>


            {/* </form> */}
        </div>
    )

}

export default AnalysisList;