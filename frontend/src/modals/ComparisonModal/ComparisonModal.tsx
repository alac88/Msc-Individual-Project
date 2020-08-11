import React from "react";
import Modal from "react-bootstrap/Modal";
import "./ComparisonModal.scss";
import VirusTotalAnalysis from "../../analysis/VirusTotalAnalysis";
import FlowdroidAnalysis from "../../analysis/FlowdroidAnalysis";

// interface AppProps{
//     ID: number, 
//     NAME_APP: string, 
//     PACKAGE_NAME: string, 
//     VERSION_APP: string, 
//     CATEGORY: string, 
//     PRICE: number, 
//     RATINGS: number,
//     OFFERED_BY: string,
//     ANDROID_MIN_VERSION: string, 
//     INSTALLS: number,
//     UPDATED: Date,
//     SIZE_APP: string,
//     TEST1: number,
//     TEST2: number,
//     TEST3: number,
//     SECURITY_SCORE: number
// }

function ComparisonModal(props: any) {
    const setOverlay = () => {
        document.getElementById("modal")?.classList.add("active");
    };

    const onExit = () => {
        document.getElementById("modal")?.classList.remove("modal");
    };

    // function getSecurityScore(app: any){
    //     var securityScore = 0;
    //     var count = 0;
    //     Object.keys(app.VIRUS_TOTAL.stats).map((cat) => {
    //         count += app.VIRUS_TOTAL.stats[cat];
    //         if ((cat == "malicious") || (cat == "suspicious") ){
    //             securityScore += app.VIRUS_TOTAL.stats[cat];
    //         }
    //     })
    //     return securityScore / count;
    // }

    return (
        <div id="modal">
        <Modal
            show={props.show}
            onEnter={setOverlay}
            onExit={onExit}
            dialogClassName={"comparisonModal"}
        >
            <Modal.Header>
            <Modal.Title>Comparison Analysis</Modal.Title>
            </Modal.Header>

            <Modal.Body>

                {(props.appsChecked.length == 1) &&
                    <>
                    <h2>Information</h2>
                    <div className="row"><b>ID: </b>{props.appsChecked[0].ID}</div>
                    <div className="row"><b>App Name: </b>{props.appsChecked[0].NAME_APP}</div>
                    <div className="row"><b>Package Name: </b>{props.appsChecked[0].PACKAGE_NAME}</div>
                    <div className="row"><b>Size: </b>{props.appsChecked[0].SIZE_APP}</div>
                    <div className="row"><b>Last Update: </b>{props.appsChecked[0].UPDATED}</div>
                    <div className="row"><b>App Version: </b>{props.appsChecked[0].VERSION_APP}</div>
                    <div className="row"><b>Android Minimum Version: </b>{props.appsChecked[0].ANDROID_MIN_VERSION}</div>
                    <div className="row"><b>Installs: </b>{props.appsChecked[0].INSTALLS}</div>
                    <div className="row"><b>Category: </b>{props.appsChecked[0].CATEGORY}</div>
                    <div className="row"><b>Price: </b>{props.appsChecked[0].PRICE}</div>
                    <div className="row"><b>Ratings: </b>{props.appsChecked[0].RATINGS}</div>
                    <div className="row"><b>Offered By: </b>{props.appsChecked[0].OFFERED_BY}</div>
                </>

                }

                <div className="analysis">
                    <h2>Analysis</h2>
                    <VirusTotalAnalysis appsChecked={props.appsChecked} />
                    <FlowdroidAnalysis appsChecked={props.appsChecked} />
                </div>
            </Modal.Body>

            <Modal.Footer>
                {(props.appsChecked.length > 1) &&
                <div className="button">
                    <input type="submit" name="download" value="Download (.xlsx)" className="success" />
                </div>
                }
                <div className="button">
                    <input
                    type="submit"
                    name="close"
                    value="Close"
                    className="danger"
                    onClick={props.onHide}
                    />
                </div>
            </Modal.Footer>
        </Modal>
        </div>
    );
}

export default ComparisonModal;
