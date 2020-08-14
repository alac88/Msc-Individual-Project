import React from 'react';
import './VirusTotalAnalysis.scss';

function VirusTotalAnalysis(props: any){

    // function getVirusTotalSecurityScore(app: any){
    //     return 1 - (app.positives / app.total);
    // }

    function getKeysList(){
        let list = Array();
        let i = 0;
        while (props.analysis[i]){
            Object.keys(props.analysis[i].content.scans).map((key) => {
                list.push(key);
            })
            i++;
        }

        return Array.from(new Set(list));
    }

    return (
        <div>
            <h4>Pre-static Analysis (VirusTotal)</h4>
            <table>
                <thead>
                    <tr>
                        <th scope="col">App Name</th>
                        {/* <th scope="col">Security Score</th> */}
                        {props.analysis && getKeysList().map((key) => {
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
                                    {getKeysList().map((key) => {
                                        if (app.content.scans[key]){
                                            return <th key={key+"-result"}>{app.content.scans[key].detected ? "X" : ""}</th>;

                                        } else {
                                            return <th key={key+"-result"}>NaN</th>
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

export default VirusTotalAnalysis;