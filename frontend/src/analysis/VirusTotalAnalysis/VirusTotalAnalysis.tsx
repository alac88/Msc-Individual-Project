import React, {
    useEffect
} from 'react';
import './VirusTotalAnalysis.scss';

function VirusTotalAnalysis(props: any){

    useEffect(() => {
        getSecurityScore();
    }, [props.analysis]);

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

    function getSecurityScore(){
        if (props.analysis.length){
            let scoreList = Array();
            let i = 0;
            while (props.analysis[i]){
                let score = Math.pow(props.analysis[i].content.positives / props.analysis[i].content.total - 1, 2);
                scoreList.push({"name": props.analysis[i].name.replace(".json", ""), "score": Math.round(score*10)/10});
                i++;
            }
            props.callback(scoreList);
        }
    }

    return (
        props.analysis.length ? <div id="VTAnalysisContainer">
            <h4>Pre-static Analysis (VirusTotal)</h4>
            <table>
                <thead>
                    <tr>
                        <th scope="col">App Name</th>
                        {getKeysList().map((key) => {
                            return <th key={key}>{key}</th>;
                        })}
                    </tr>
                </thead>
                <tbody>
                    {props.analysis.map((app: any) => {
                        return (
                            <tr key={app.content.sha1}>
                                <>
                                    <th>{app.name.replace(".json", "")}</th>
                                    {getKeysList().map((key) => {
                                        if (app.content.scans[key]){
                                            return <th key={key+"-result"}>{app.content.scans[key].detected ? app.content.scans[key].result : ""}</th>;

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
        </div> : null
    );
}

export default VirusTotalAnalysis;