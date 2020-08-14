import React from 'react';
import './FlowdroidAnalysis.scss';

function FlowdroidAnalysis(props: any){

    return (
        <div>
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
                                                return <th key={id}>{row[key]}</th>;
                                            })}
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </>
                );
            })}
        </div>

    );
}

export default FlowdroidAnalysis;