import React from "react";
import Modal from "react-bootstrap/Modal";
import "./ComparisonModal.scss";

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

    function getSecurityScore(app: any){
        var securityScore = 0;
        var count = 0;
        Object.keys(app.VIRUS_TOTAL.stats).map((cat) => {
            count += app.VIRUS_TOTAL.stats[cat];
            if ((cat == "malicious") || (cat == "suspicious") ){
                securityScore += app.VIRUS_TOTAL.stats[cat];
            }
        })
        return securityScore / count;
    }

    return (
        <div id="modal">
        <Modal
            show={props.show}
            onEnter={setOverlay}
            onExit={onExit}
            dialogClassName={"primaryModal"}
        >
            <Modal.Header>
            <Modal.Title>Comparison Analysis</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <table>
                <thead>
                    <tr>
                        <th scope="col">App Name</th>
                        <th scope="col">Security Score</th>
                        {Object.keys(props.appsChecked[0].VIRUS_TOTAL.results).map((key) => {
                            return <th>{key}</th>;
                        })}
                    </tr>
                    </thead>
                    <tbody>
                        {props.appsChecked.map((app: any) => {
                            // console.log(app);
                            return (
                                <tr>
                                    <th>{app.NAME_APP}</th>
                                    {app.VIRUS_TOTAL ?
                                        <>
                                        <th className="securityScore">{getSecurityScore(app)}</th>
                                        {Object.keys(app.VIRUS_TOTAL.results).map((key) => {
                                            return <th>{app.VIRUS_TOTAL.results[key].category}</th>;
                                        })}
                                        </>
                                    : <th>Analysis not available</th>}
                                </tr>
                            );
                        })}
                </tbody>
                </table>
            </Modal.Body>
            <Modal.Footer>
            <div className="button">
                <input type="submit" name="download" value="Download (.xls)" className="success" />
            </div>
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
