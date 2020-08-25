
import React, { useState } from 'react';
import './AnalysisList.scss'

interface Props{
    listLength: number,
    select(): any
}

function AnalysisList(props: any){

    const [analysisList, setAnalysisList] = useState([
        "Pre-static",
        "Static",
        "Both"]);

    const [type, setType] = useState<string>("Both");
    
    return (
        <div className="analysisListContainer">

                <select id="analysis" name="analysis" onChange={(e) => setType(e.target.value)}>
                    {analysisList.map((analysis) => {
                        if (analysis == "Both"){
                            return <option key={analysis} value={analysis} selected>{analysis}</option>
                        }
                        return <option key={analysis} value={analysis}>{analysis}</option>
                    })}
                </select>

            <div className="button">
                <input type="submit" name="compare" value={props.listLength == 1 ? "Analyse" : (props.listLength > 1 ? "Compare" : "Select apps")} className="danger" onClick={() => props.select(type)} disabled={props.listLength >= 1 ? false : true} />
            </div>

        </div>
    )

}

export default AnalysisList;