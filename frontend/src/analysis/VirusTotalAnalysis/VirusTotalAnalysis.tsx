import React from 'react';
import './VirusTotalAnalysis.scss';

function VirusTotalAnalysis(props: any){

    // function getVirusTotalSecurityScore(app: any){
    //     return 1 - (app.positives / app.total);
    // }

    return (
        <div>
            <h4>Pre-static Analysis</h4>
            <table>
                <thead>
                    <tr>
                        <th scope="col">App Name</th>
                        {/* <th scope="col">Security Score</th> */}
                        {props.analysis && Object.keys(props.analysis[0].content.scans).map((key) => {
                            return <th key={key}>{key}</th>;
                        })}
                    </tr>
                    </thead>
                    <tbody>
                        {props.analysis && props.analysis.map((app: any) => {
                            return (
                                <tr key={app.content.sha1}>
                                    <>
                                        <th>{app.name.replace(".json", "")}</th>
                                        {Object.keys(app.content.scans).map((key) => {
                                            return <th key={key+"-result"}>{app.content.scans[key].detected ? "X" : ""}</th>;
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

export default VirusTotalAnalysis;