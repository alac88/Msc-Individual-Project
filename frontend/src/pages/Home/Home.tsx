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
        
    const [checkedApps, setCheckedApps] = useState(Array<AppProps>());

    const [showComparisonModal, setShowComparisonModal] = useState(false);

    const [showLoader, setShowLoader] = useState(false);

    const [VTanalysis, setVTanalysis] = useState(Array<any>());

    const [flowdroidAnalysis, setFlowdroidAnalysis] = useState(Array<any>());

    const query = new URLSearchParams(props.location.search);
    
    useEffect(() => {
        getApps();
    }, []);

    function getApps() {
        fetch(`http://${databaseUrl}:3001?name=${query.get('name') || ''}&category=${encodeURIComponent(query.get('category') || '')}&rating=${query.get('rating') || '0'}&Max=${query.get('Max') || '0'}`)
        .then(response => {
            return response.json();
        })
        .then(data => {
            setApps(data);
        });
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
    
    function compareApps(apps: Array<AppProps>){
        startPolling();
        fetchApps(apps);
    }
    
    
    function fetchApps(apps: Array<AppProps>, runScript = true){
        fetch(`http://${databaseUrl}:3001/compareApps?runScript=${runScript}&apps=${apps.map((app) => {return app.PACKAGE_NAME})}`)
        .then(response => {
            return response.text();
        })
        .then((data) => {
            if (data == "true"){
                console.log("still here");
                getVirusTotalAnalysis();
                getFlowdroidAnalysis();
                setTimeout(() => fetchApps(apps, false), 5000);
            } else {
                console.log("bye");
                setShowLoader(false);
            }
        })
        .catch((err) => {
            closeModal();
            console.log(err);
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
            console.log(response);
            return response.json();
        })
        .then(data => {
            console.log("Flowdroid data: ", data);
            setFlowdroidAnalysis(data);
        });
    }

    function openComparisonModal(){
        document.body.style.overflow = 'hidden';
        document.getElementById("overlay")?.classList.add('active');
        setShowLoader(true);
        setShowComparisonModal(true);
        compareApps(checkedApps);
    }

    function closeModal(isComparisonModal=false){
        stopPolling();
        if (isComparisonModal){
            setShowComparisonModal(false);
            cleanAnalysis();
        } else {
            setShowLoader(false);
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

    function renderApps(){
        return (
            <div className="bottomBar">
                <div className="row">
                        <input id="all" type="checkbox" onChange={() => checkAll()}/>
                        <div className="headings">
                            <span className="id">ID</span>
                            <span>App Name</span>
                            <span>Package Name</span>
                            <span>Version</span>
                            <span>Category</span>
                            <span>Price</span>
                            <span>Ratings</span>
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
                    <Block type="info"  url=""></Block>
                    <Block type="statistics"  url="/statistics"></Block>
                    <Block type="git"  url="https://github.com/alac88/Msc-Individual-Project"></Block>
                </div>
                {showComparisonModal && <ComparisonModal
                    appsChecked={checkedApps}
                    loader={showLoader}
                    show={showComparisonModal}
                    VTanalysis={VTanalysis}
                    flowdroidAnalysis={flowdroidAnalysis}
                    onHide={() => closeModal(true)}
                    />}
                <div className="appContainer">
                    <div className="topBar">
                        <div className="appNumber">{appsList.length} apps found</div>
                        <div>
                            <AnalysisList listLength={checkedApps.length} select={() => openComparisonModal()}/>
                            <div className="estimation">Estimated time: {checkedApps.length * 5} min (~5min/app)</div>
                        </div>
                    </div>
                    {appsList ? renderApps() : <Loader type="TailSpin" color="#E31C5F" height={100} width={100}/>}
                </div>
            </div>
        );
}

export default Home;