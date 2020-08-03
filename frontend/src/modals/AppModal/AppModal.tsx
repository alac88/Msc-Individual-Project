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
  
  function getSecurityScore(){
    var securityScore = 0;
    var count = 0;
    Object.keys(props.app[0].VIRUS_TOTAL.stats).map((cat) => {
      count += props.app[0].VIRUS_TOTAL.stats[cat];
      if ((cat == "malicious") || (cat == "suspicious") ){
        securityScore += props.app[0].VIRUS_TOTAL.stats[cat];
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

          { props.app[0].VIRUS_TOTAL && 
            <div className="analysis">
              <h2>Analysis</h2>
              <table>
                  <thead>
                    <tr>
                        <th scope="col">App Name</th>
                        <th scope="col">Security Score</th>
                        {Object.keys(props.app[0].VIRUS_TOTAL.results).map((key) => {
                          return <th>{key}</th>;
                        })}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                        <th className="name">{props.app[0].NAME_APP}</th>
                        <th className="securityScore">{getSecurityScore()}</th>
                        {Object.keys(props.app[0].VIRUS_TOTAL.results).map((key) => {
                          return <th>{props.app[0].VIRUS_TOTAL.results[key].category}</th>;
                        })}
                    </tr>
                  </tbody>
                  </table>
            </div>
          } 

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