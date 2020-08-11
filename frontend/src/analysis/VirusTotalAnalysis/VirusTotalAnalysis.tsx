import React from 'react';
import './VirusTotalAnalysis.scss';


function VirusTotalAnalysis(props: any){

    function getVirusTotalSecurityScore(){
        return 1 - (props.appsChecked.positives / props.appsChecked.total);
    }

    return (
        <div>
            <h4>Pre-static Analysis</h4>
            <table>
                <thead>
                    <tr>
                        <th scope="col">App Name</th>
                        <th scope="col">Security Score</th>
                        {/* {Object.keys(props.appsChecked[0].VIRUS_TOTAL.scans).map((key) => {
                            return <th>{key}</th>;
                        })} */}
                    </tr>
                    </thead>
                    <tbody>
                        {props.appsChecked.map((app: any) => {
                            return (
                                <tr key={app+"-tr"}>
                                    <th className="name">{app.NAME_APP}</th>
                                    {app.VIRUS_TOTAL ?
                                        <>
                                        <th className="securityScore">{getVirusTotalSecurityScore()}</th>
                                        {Object.keys(app.VIRUS_TOTAL.scans).map((key) => {
                                            return <th>{app.VIRUS_TOTAL.scans[key].detected}</th>;
                                        })}
                                        </>
                                    : <th>Analysis not available</th>}
                                </tr>
                            );
                        })}
                </tbody>
            </table>
        </div>
    );
}

export default VirusTotalAnalysis;