import React, {
    useState
} from 'react';
import Modal from "react-bootstrap/Modal";
import "./ComparisonModal.scss";
import Loader from "react-loader-spinner";
import VirusTotalAnalysis from "../../analysis/VirusTotalAnalysis";
import FlowdroidAnalysis from "../../analysis/FlowdroidAnalysis";
import PermissionsAnalysis from "../../analysis/PermissionsAnalysis";

interface Props{
    show: any,
    loader: boolean,
    // checkedApps: Array<JSON>,
    // VTanalysis: Array<JSON>,
    // flowdroidAnalysis: Array<JSON>
    onHide: any
}

function ComparisonModal(props: any) {

    const [permissionsSecurityScoreList, setPermissionsSecurityScoreList] = useState(Array<any>());
    const [VTSecurityScoreList, setVTSecurityScoreList] = useState(Array<any>());
    const [flowdroidSecurityScoreList, setFlowdroidSecurityScoreList] = useState(Array<any>());
    
    const setOverlay = () => {
        document.getElementById("modal")?.classList.add("active");
    };

    const onExit = () => {
        document.getElementById("modal")?.classList.remove("modal");
    };

    // const getPermissionsSecurityScoreList = (scoreList: any) => {
    //     console.log("Permissions security scoreList: ", scoreList);
    //     setPermissionsSecurityScoreList(scoreList);
    // }

    // const getVTSecurityScoreList = (scoreList: any) => {
    //     console.log("VirusTotal security scoreList: ", scoreList);
    //     setVTSecurityScoreList(scoreList);
    // }
    
    // const getFlowdroidSecurityScoreList = (scoreList: any) => {
    //     console.log("FlowDroid security scoreList: ", scoreList);
    //     setFlowdroidSecurityScoreList(scoreList);
    // }

    function getSecurityScoreClass(score: number){
        if ((0 <= score) && (score < 0.25)){
            return "critical";
        } else if ((0.25 <= score) && (score < 0.5)){
            return "danger";
        } else if ((0.5 <= score) && (score < 0.75)){
            return "medium"
        } else if ((0.75 <= score) && (score <= 1)){
            return "success";
        } else {
            return "unknown";
        }
    }

    function getSecurityScoreTotal(permissionsSecurityScore: number, VTSecurityScore: number, flowdroidSecurityScore: number){
       
        return Math.round((1 - Math.sqrt((Math.pow(permissionsSecurityScore - 1, 2) + Math.pow(VTSecurityScore - 1, 2) + Math.pow(flowdroidSecurityScore - 1, 2)) / 3)) * 100) / 100;
    }

    function getSecurityScoreTable(){
        // console.log("permissionsSecurityScoreList: ", permissionsSecurityScoreList);
        // console.log("VTSecurityScoreList: ", VTSecurityScoreList);
        // console.log("flowdroidSecurityScoreList: ", flowdroidSecurityScoreList);
        if ((permissionsSecurityScoreList.length == VTSecurityScoreList.length) && (VTSecurityScoreList.length == flowdroidSecurityScoreList.length)){
                return (
                    <>
                        {permissionsSecurityScoreList.map((app, index) => {
                            return (
                                <tr>
                                    <th>{app.name}</th>
                                    <th className={getSecurityScoreClass(app.score)}>{app.score}</th>
                                    <th className={getSecurityScoreClass(VTSecurityScoreList[index].score)}>{VTSecurityScoreList[index].score}</th>
                                    <th className={getSecurityScoreClass(flowdroidSecurityScoreList[index].score)}>{flowdroidSecurityScoreList[index].score}</th>
                                    <th className={"total " + getSecurityScoreClass(getSecurityScoreTotal(app.score, VTSecurityScoreList[index].score, flowdroidSecurityScoreList[index].score))}>{getSecurityScoreTotal(permissionsSecurityScoreList[index].score, VTSecurityScoreList[index].score, flowdroidSecurityScoreList[index].score)}</th>
                                </tr>
                            )
                            
                        })}

                    </>
                )
                    
        }
    }


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
                {props.loader && <Loader type="TailSpin" color="#E31C5F" height={40} width={40}/>}
            </Modal.Header>

            <Modal.Body>

                {(props.checkedApps.length == 1) &&
                    <>
                    <h2>Information</h2>
                    <div className="row"><b>ID: </b>{props.checkedApps[0].ID}</div>
                    <div className="row"><b>App Name: </b>{props.checkedApps[0].NAME_APP}</div>
                    <div className="row"><b>Package Name: </b>{props.checkedApps[0].PACKAGE_NAME}</div>
                    <div className="row"><b>Size: </b>{props.checkedApps[0].SIZE_APP}</div>
                    <div className="row"><b>Last Update: </b>{props.checkedApps[0].UPDATED}</div>
                    <div className="row"><b>App Version: </b>{props.checkedApps[0].VERSION_APP}</div>
                    <div className="row"><b>Android Minimum Version: </b>{props.checkedApps[0].ANDROID_MIN_VERSION}</div>
                    <div className="row"><b>Installs: </b>{props.checkedApps[0].INSTALLS}</div>
                    <div className="row"><b>Category: </b>{props.checkedApps[0].CATEGORY}</div>
                    <div className="row"><b>Price: </b>{props.checkedApps[0].PRICE}</div>
                    <div className="row"><b>Ratings: </b>{props.checkedApps[0].RATINGS}</div>
                    <div className="row"><b>Offered By: </b>{props.checkedApps[0].OFFERED_BY}</div>
                </>

                }
                {props.loader ? 
                    <div className="securityScore analysis">
                        <h2>Security Score Summary</h2>
                        <table>
                            <thead>
                            <tr>
                                <th>App/Scores</th>
                                <th>Permissions</th>
                                <th>Pre-static</th>
                                <th>Static</th>
                                <th>Total</th>
                            </tr>
                            </thead>
                            <tbody>
                                {getSecurityScoreTable()}
                            </tbody>
                        </table>
                    </div>
                    : null}

                <div className="analysis">
                    <h2>Detailed Analysis</h2>
                    {props.permissions && <PermissionsAnalysis analysis={props.permissions} callback={(scoreList: any) => setPermissionsSecurityScoreList(scoreList)}/>}
                    {props.VTanalysis && <VirusTotalAnalysis analysis={props.VTanalysis} callback={(scoreList: any) => setVTSecurityScoreList(scoreList)}/>}
                    {props.flowdroidAnalysis && <FlowdroidAnalysis analysis={props.flowdroidAnalysis} callback={(scoreList: any) => setFlowdroidSecurityScoreList(scoreList)}/>}
                </div>
            </Modal.Body>

            <Modal.Footer>
                <div className="button">
                    <input
                    type="submit"
                    name="clear"
                    value="Clear"
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
