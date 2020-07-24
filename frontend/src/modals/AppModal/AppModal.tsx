import React, {
  useState,
  useEffect
} from 'react';
import Modal from "react-bootstrap/Modal";
import "./AppModal.scss";

function AppModal(props: any) {

  const setOverlay = () => {
    document.getElementById("modal")?.classList.add('active');

  };

  const onExit = () => {
    document.getElementById("modal")?.classList.remove('modal');
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
          <Modal.Title>{props.app[0].NAME_APP}</Modal.Title>
        </Modal.Header>
        <Modal.Body>

          <>
            <h2>Information</h2>
            <div className="row"><b>ID: </b>{props.app[0].ID}</div>
            <div className="row"><b>App Name: </b>{props.app[0].NAME_APP}</div>
            <div className="row"><b>Package Name: </b>{props.app[0].PACKAGE_NAME}</div>
            <div className="row"><b>Size: </b>{props.app[0].SIZE_APP}</div>
            <div className="row"><b>Last Update: </b>{props.app[0].UPDATED}</div>
            <div className="row"><b>App Version: </b>{props.app[0].VERSION_APP}</div>
            <div className="row"><b>Android Minimum Version: </b>{props.app[0].ANDROID_MIN_VERSION}</div>
            <div className="row"><b>Installs: </b>{props.app[0].INSTALLS}</div>
            <div className="row"><b>Category: </b>{props.app[0].CATEGORY}</div>
            <div className="row"><b>Price: </b>{props.app[0].PRICE}</div>
            <div className="row"><b>Ratings: </b>{props.app[0].RATINGS}</div>
            <div className="row"><b>Offered By: </b>{props.app[0].OFFERED_BY}</div>
          </>

          <div className="analysis">
            <h2>Analysis</h2>
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
                  <tr>
                      <th>{props.app[0].NAME_APP}</th>
                      {/* <th>{props.app[0].TEST1 ? <Green/> : <Red />}</th> */}
                      <th>{props.app[0].TEST1}</th>
                      <th>{props.app[0].TEST2}</th>
                      <th>{props.app[0].TEST3}</th>
                      <th>{props.app[0].SECURITY_SCORE}</th>
                  </tr>
                </tbody>
                </table>
          </div>

        </Modal.Body>
        <Modal.Footer>
          <a href={props.app[0].APK_URL} className="button">
            <input type="submit" name="apk" value="XAPK" className="success" />
          </a>
          <div className="button">
              <input type="submit" name="close" value="Close" className="danger" onClick={props.onHide}/>
          </div>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default AppModal;