import React, {
    useState,
    useEffect
} from 'react';
import AnalysisList from '../../components/AnalysisList';
import Block from '../../components/Block';
import Card from '../../components/Card';
import SearchBar from '../../components/SearchBar';
import ComparisonModal from '../../modals/ComparisonModal';
import Loader from "react-loader-spinner";
import './Home.scss';
import { Link } from 'react-router-dom';

const databaseUrl = "146.169.42.43";

interface AppProps{
    ID: number, 
    NAME_APP: string, 
    PACKAGE_NAME: string, 
    VERSION_APP: string, 
    CATEGORY: string, 
    PRICE: number, 
    RATINGS: number,
    OFFERED_BY: string,
    ANDROID_MIN_VERSION: string, 
    INSTALLS: number,
    UPDATED: Date,
    SIZE_APP: string,
    VIRUS_TOTAL: JSON
}

function Home(props: any) {

    const [appsList, setApps] = useState(Array<AppProps>());

    const [appsCount, setAppsCount] = React.useState<number>();
        
    const [checkedApps, setCheckedApps] = useState(Array<AppProps>());

    const [showComparisonModal, setShowComparisonModal] = useState(false);

    const [showComparisonLoader, setShowComparisonLoader] = useState(false);
    
    const [showLoader, setShowLoader] = useState(true);

    const [VTanalysis, setVTanalysis] = useState(Array<any>());

    const [flowdroidAnalysis, setFlowdroidAnalysis] = useState(Array<any>());
    
    const [permissions, setPermissions] = useState(Array<any>());

    const [analysisType, setAnalysisType] = useState<string>();


    const [pageNumber, setPageNumber] = React.useState<number>(
        props.match.params.page ? parseInt(props.match.params.page, 10) : 0,
      );

    const query = new URLSearchParams(props.location.search);
    
    useEffect(() => {
        getApps();
        getAppsCount();
    }, [pageNumber]);

    function getApps() {
        fetch(`http://${databaseUrl}:3001?page=${pageNumber}&name=${query.get('name') || ''}&category=${encodeURIComponent(query.get('category') || '')}&rating=${query.get('rating') || '0'}&max=${query.get('max') || '0'}`)
        .then(response => {
            return response.json();
        })
        .then(data => {
            setApps(data);
            setShowLoader(false);
        });
    }
    
    function getAppsCount(){
        fetch(`http://${databaseUrl}:3001/appsCount`)
        .then(response => {
            return response.text();
        })
        .then(data => {
            setAppsCount(parseInt(data));
        })
    }

    function cleanAnalysis(){
        fetch(`http://${databaseUrl}:3001/clean`)
        .then(response => {
            return response.text();
        })
    }

    function startPolling(){
        fetch(`http://${databaseUrl}:3001/startPolling`)
        .then(response => {
            return response.text();
        })
    }

    function stopPolling(){
        fetch(`http://${databaseUrl}:3001/stopPolling`)
        .then(response => {
            return response.text();
        })
    }
    
    function compareApps(apps: Array<AppProps>, type: string){
        // cleanAnalysis();
        startPolling();
        fetchApps(apps, type);
    }
    
    
    function fetchApps(apps: Array<AppProps>, type: string, runScript = false){
        fetch(`http://${databaseUrl}:3001/compareApps?type=${type}&runScript=${runScript}&apps=${apps.map((app) => {return app.PACKAGE_NAME})}`)
        .then(response => {
            return response.text();
        })
        .then((data) => {
            if (data == "true"){
                switch(type){
                    case "Pre-static":
                        getPermissions();
                        getVirusTotalAnalysis();
                        break;
                    case "Static":
                        getPermissions();
                        getFlowdroidAnalysis();
                        break;
                    case "Both":
                        getPermissions();
                        getVirusTotalAnalysis();
                        getFlowdroidAnalysis();
                        break;
                    default:
                        break;
                }
                setTimeout(() => fetchApps(apps, type, false), 10000);
            } else {
                console.log("bye");
                setShowComparisonLoader(false);
            }
        })
        .catch((err) => {
            closeModal();
            console.log(err);
        });
    }

    function getPermissions(){
        fetch(`http://${databaseUrl}:3001/permissions`)
        .then(response => {
            return response.json();
        })
        .then(data => {
            setPermissions(data);
        });
    }
   
    
    function getVirusTotalAnalysis() {
        fetch(`http://${databaseUrl}:3001/VTanalysis`)
        .then(response => {
            return response.json();
        })
        .then(data => {
            setVTanalysis(data);
        });
    }
    
    function getFlowdroidAnalysis() {
        fetch(`http://${databaseUrl}:3001/flowdroidAnalysis`)
        .then(response => {
            return response.json();
        })
        .then(data => {
            setFlowdroidAnalysis(data);
        });
    }

    function openComparisonModal(type: string){
        document.body.style.overflow = 'hidden';
        document.getElementById("overlay")?.classList.add('active');
        setAnalysisType(type);
        setShowComparisonLoader(true);
        setShowComparisonModal(true);
        compareApps(checkedApps,type);
    }

    function closeModal(isComparisonModal=false){
        stopPolling();
        if (isComparisonModal){
            setShowComparisonModal(false);
            cleanAnalysis();
        } else {
            setShowComparisonLoader(false);
        }
        document.getElementById("overlay")?.classList.remove('active');
    }


    function checkAll(){
        var checkboxes = document.getElementsByName('checkbox');
        var allAppsChecked = checkedApps.length == appsList.length; // select all
        
        for (var i = 0 ; i < checkboxes.length ; i++){
            if (allAppsChecked){
                checkboxes[i].removeAttribute('checked');
            } else {
                checkboxes[i].setAttribute('checked', 'checked');
            }
        }

        if (allAppsChecked){
            setCheckedApps([]);
        } else {
            setCheckedApps(appsList);
        }
        
    }

    function checkApp(packageName: string){
        var checkbox = document.getElementById(packageName);
        if (checkbox){
            // If already checked
            if (checkbox.hasAttribute("checked") && (checkbox.getAttribute("checked") == "checked") ){
                checkbox.removeAttribute("checked");
                var newCheckedApps = checkedApps.filter((el) => el.PACKAGE_NAME != checkbox?.id);
                setCheckedApps(newCheckedApps);
            } 
            // If not checked yet
            else {
                checkbox.setAttribute("checked", "checked");
                var app = getAppFullData(checkbox.id);
                if (app) {
                    setCheckedApps([...checkedApps, app]);
                }
            }
        
        }
    }

    function getAppFullData(packageName: string){
        var app = appsList.find((el) => el.PACKAGE_NAME == packageName);
        return app ? app : null;
    }

    function isChecked(app: AppProps){
        if (checkedApps.find((el) => el.PACKAGE_NAME == app.PACKAGE_NAME)){
            return true;
        }
        return false;
    }

    function switchPage(newPageNumber: number) {
        setPageNumber(newPageNumber);
        setShowLoader(true);
      }

    function renderApps(){
        return (
            <div className="bottomBar">
                <div className="row">
                        <input id="all" type="checkbox" onChange={() => checkAll()}/>
                        <div className="headings">
                            <span className="id">ID</span>
                            <span className="info large">App Name</span>
                            <span className="info large">Package Name</span>
                            <span className="info">Version</span>
                            <span className="info">Category</span>
                            <span className="info">Price</span>
                            <span className="info">Ratings</span>
                        </div>
                </div>
                {appsList.map((app) => (
                    <div key={app.ID} className="row">
                        <input id={app.PACKAGE_NAME} onChange={() => checkApp(app.PACKAGE_NAME)} name="checkbox" type="checkbox" checked={isChecked(app)}/>
                        {/* <Card id={app.ID} name={app.NAME_APP} packageName={app.PACKAGE_NAME} version={app.VERSION_APP} category={app.CATEGORY} price={app.PRICE} ratings={app.RATINGS} ></Card> */}
                        <Card select={() => checkApp(app.PACKAGE_NAME)} key={app.ID} id={app.ID} name={app.NAME_APP} packageName={app.PACKAGE_NAME} version={app.VERSION_APP} category={app.CATEGORY} price={app.PRICE} ratings={app.RATINGS} ></Card>
                    </div>
                ))}
            </div>
        );
    }

        return (
            <div className="container">
                <SearchBar />
                <div className="infoContainer">
                    <Block type="info"  url="/readme"></Block>
                    <Block type="statistics"  url="/statistics"></Block>
                    <Block type="git"  url="https://github.com/alac88/Msc-Individual-Project"></Block>
                </div>
                {showComparisonModal && <ComparisonModal
                    checkedApps={checkedApps}
                    loader={showComparisonLoader}
                    show={showComparisonModal}
                    VTanalysis={VTanalysis}
                    flowdroidAnalysis={flowdroidAnalysis}
                    permissions={permissions}
                    type={analysisType}
                    onHide={() => closeModal(true)}
                    />}
                <div className="appContainer">
                    <div className="topBar">
                        <div className="appsCount">Crawler has found a total of <span style={{fontWeight:'bold'}}>{appsCount}</span> apps</div>
                        <div>
                            <AnalysisList listLength={checkedApps.length} select={(type: string) => openComparisonModal(type)}/>
                            <div className="estimation">Estimated time: {checkedApps.length * 5} min (~5min/app)</div>
                        </div>
                    </div>
                    { showLoader ? <div className="loaderContainer"><Loader type="TailSpin" color="#E31C5F" height={100} width={100}/></div> : appsList ? renderApps() : null }
                </div>
                <div className="navPageContainer">
                    <Link to={`/?name=${query.get('name')}&category=${query.get('category')}&rating=${query.get('rating')}&max=${query.get('max')}&page=${pageNumber - 1}`} onClick={() => switchPage(pageNumber - 1)} style={{ visibility: pageNumber >= 1 ? 'visible' : 'hidden' }}>Previous</Link>
                    <Link to={`/?name=${query.get('name')}&category=${query.get('category')}&rating=${query.get('rating')}&max=${query.get('max')}&page=${pageNumber + 1}`} onClick={() => switchPage(pageNumber + 1)}>Next</Link>

                </div>
            </div>
        );
}

export default Home;