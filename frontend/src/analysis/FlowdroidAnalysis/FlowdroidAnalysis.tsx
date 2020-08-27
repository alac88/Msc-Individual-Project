import React, {
    useEffect
} from 'react';
import './FlowdroidAnalysis.scss';

function FlowdroidAnalysis(props: any){

    useEffect(() => {
        getSecurityScore();
    }, [props.analysis]);

    function getSecurityScore(){
        if (props.analysis.length){
            let scoreList = Array();
            let i = 0;
            while (props.analysis[i]){
                let score = 1;

                let nbSourcesSinks = 0;
                props.analysis[i].content.map((row: any) => {
                    Object.keys(row).map((key , index, array) => {
                        if (Number.isInteger(parseInt(row[key]))){
                            nbSourcesSinks += parseInt(row[key]);
                        }
                    })
                })
                score = Math.exp(-nbSourcesSinks / 50);


                scoreList.push({"name": props.analysis[i].name, "score": Math.round(score*10)/10});
                i++;
            }
            props.callback(scoreList);
        }
    }

    return (
        props.analysis.length ? <div id="flowdroidAnalysisContainer">
            <h4>Static Analysis (FlowDroid)</h4>
            {props.analysis.map((app: any) => {
                return (
                    <>
                        <h5>{app.name}</h5>
                        <table>
                            <thead>
                                <tr>
                                    {(app.content !== null) && (app.content !== undefined) && Object.keys(app.content[0]).map((key, id) => {
                                        return <th key={id}>{key}</th>
                                    })
                                    }                                    
                                </tr>
                            </thead>
                            <tbody>
                                {(app.content !== null) && (app.content !== undefined) && app.content.map((row: any) => {
                                    return (
                                        <tr>
                                            {Object.keys(row).map((key, id) => {
                                                return <th key={id} className={row[key] > 0 ? "danger" : ""}>{row[key]}</th>;
                                            })}
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </>
                );
            })}
        </div> : null

    );
}

export default FlowdroidAnalysis;