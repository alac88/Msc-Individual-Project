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
                        <th scope="col">Mobile Squatting</th>
                        <th scope="col">Permission Requests</th>
                        <th scope="col">Test 3</th>
                        <th scope="col">Security Score</th>
                    </tr>
                    </thead>
                    <tbody>
                        {props.appsChecked.map((app: any) => {
                            console.log(app);
                            return (
                                <tr>
                                    <th>{app.NAME_APP}</th>
                                    <th>{app.TEST1}</th>
                                    <th>{app.TEST2}</th>
                                    <th>{app.TEST3}</th>
                                    <th>{app.SECURITY_SCORE}</th>
                                </tr>
                            );
                        })}
                </tbody>
                </table>
            </Modal.Body>
            <Modal.Footer>
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
