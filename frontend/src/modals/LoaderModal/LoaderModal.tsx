import React from "react";
import Modal from "react-bootstrap/Modal";
import Loader from "react-loader-spinner";
import "./LoaderModal.scss";

function LoaderModal(props: any) {

    
    const setOverlay = () => {
        document.getElementById("modal")?.classList.add("active");
    };

    const onExit = () => {
        document.getElementById("modal")?.classList.remove("modal");
    };

    return (
        <div id="loader">
        <Modal
            show={props.show}
            onEnter={setOverlay}
            onExit={onExit}
            dialogClassName={"loaderModal"}
        >
            <Modal.Header>
            <Modal.Title>In Progress</Modal.Title>
            </Modal.Header>

            <Modal.Body>

                <p>Loading ...</p><br/>
                <Loader type="TailSpin" color="#E31C5F" height={100} width={100}/>

            </Modal.Body>

            <Modal.Footer>
                <div className="button">
                    <input
                    type="submit"
                    name="cancel"
                    value="Cancel"
                    className="danger"
                    onClick={props.onCancel}
                    />
                </div>
            </Modal.Footer>
        </Modal>
        </div>
    );
}

export default LoaderModal;
