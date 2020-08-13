import React from 'react';
import './FlowdroidAnalysis.scss';

function FlowdroidAnalysis(props: any){

    // function getFlowdroidSecurityScore(app: any){
    //     return 1 - (app.positives / app.total);
    // }

    return (
        <div>
            <h4>Static Analysis</h4>
            <table>
                <thead>
                    <tr>
                        <th scope="col">App Name</th>
                        {/* <th scope="col">Security Score</th> */}
                        {props.analysis && Object.keys(props.analysis[0]).map((key) => {
                            if (key !== "apk"){
                                return <th key={key}>{key}</th>;
                            }
                        })}
                    </tr>
                    </thead>
                    <tbody>
                        {props.analysis && props.analysis.map((row: any) => {
                            return (
                                <tr>
                                    <>
                                        <th>{row.apk.replace(".json", "").replace("/apks/FlowDroid_outputs/", "")}</th>
                                        {Object.keys(row).map((key, id) => {
                                            if (key !== "apk"){
                                                return <th key={id}>{row[key]}</th>;
                                            }
                                        })}
                                    </>
                                </tr>
                            );
                        })}
                </tbody>
            </table>
        </div>
    );
}

export default FlowdroidAnalysis;