import React, {
    useState,
    useEffect
} from 'react';
import Card from '../../components/Card';
import SearchBar from '../../components/SearchBar';
import Block from '../../components/Block';
import ComparisonModal from '../../modals/ComparisonModal';
import LoaderModal from '../../modals/LoaderModal';
import './Home.scss';

const databaseUrl = "localhost";

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
    
    const [appSelected, setAppSelected] = useState<AppProps>();
    
    const [checkedApps, setCheckedApps] = useState(Array<AppProps>());

    const [showComparisonModal, setShowComparisonModal] = useState(false);

    const [showLoader, setShowLoader] = useState(false);

    const [VTanalysis, setVTanalysis] = useState();

    const [flowDroidnalysis, setFlowdroidAnalysis] = useState();

    const query = new URLSearchParams(props.location.search);
    
    useEffect(() => {
        getApps();
    }, []);

    function getApps() {
        fetch(`http://${databaseUrl}:3001?name=${query.get('name') || ''}&category=${encodeURIComponent(query.get('category') || '')}&Max=${query.get('Max') || '0'}`)
            .then(response => {
                return response.json();
            })
            .then(data => {
                setApps(data);
            });
        }
        
    function compareApps(apps: Array<AppProps>){
        fetch(`http://${databaseUrl}:3001/compareApps?apps=${apps.map((app) => {return app.PACKAGE_NAME})}`)
            .then(response => {
                return response.text();
            })
            .then(data => {
                console.log('compareApps data: ', data);
                setShowLoader(false);
                console.log("Loader false");
                // getAppsVirusTotalAnalysis(checkedApps);
                // getAppsFlowdroidAnalysis(checkedApps);
                setShowComparisonModal(true);
                // setApps(data);
            });
        }

        function getAppsVirusTotalAnalysis(apps: Array<AppProps>){
            fetch(`http://${databaseUrl}:3001/VTanalysis?apps=${apps.map((app) => {return app.PACKAGE_NAME})}`)
                .then(response => {
                    return response.text();
                })
                .then(data => {
                        console.log('VTanalysis data: ', data);
                        // setVTanalysis(data);
                    });
        }

        function getAppsFlowdroidAnalysis(apps: Array<AppProps>){
            fetch(`http://${databaseUrl}:3001/flowdroidAnalysis?apps=${apps.map((app) => {return app.PACKAGE_NAME})}`)
                .then(response => {
                    return response.text();
                })
                .then(data => {
                        console.log('flowdroidAnalysis data: ', data);
                        // setFlowdroidAnalysis(data);
                    });
        }

    function openComparisonModal(){
        console.log("Loader true: ", checkedApps);
        document.getElementById("overlay")?.classList.add('active');
        setShowLoader(true);
        compareApps(checkedApps);
    }

    function closeModal(isComparisonModal=false){
        if (isComparisonModal){
            setShowComparisonModal(false);
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
                        <Card id={app.ID} name={app.NAME_APP} packageName={app.PACKAGE_NAME} version={app.VERSION_APP} category={app.CATEGORY} price={app.PRICE} ratings={app.RATINGS} ></Card>
                        {/* <Card select={() => openAppModal(app.PACKAGE_NAME)} key={app.ID} id={app.ID} name={app.NAME_APP} packageName={app.PACKAGE_NAME} version={app.VERSION_APP} category={app.CATEGORY} price={app.PRICE} ratings={app.RATINGS} ></Card> */}
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
                {showLoader && <LoaderModal 
                    show={showLoader} 
                    onCancel={() => closeModal()}
                    />}
                {showComparisonModal && <ComparisonModal
                    appsChecked={checkedApps}
                    show={showComparisonModal}
                    onHide={() => closeModal(true)}
                    />}
                <div className="appContainer">
                    <div className="topBar">
                        <div className="appNumber">{appsList.length} apps found</div>
                        <div>
                            <div className="button">
                                {/* <input type="submit" name="compare" value="Compare" className="danger" disabled={ getCheckedApps().length >= 2 ? false : true }/> */}
                                <input type="submit" name="compare" value={checkedApps.length == 1 ? "Analyse" : (checkedApps.length > 1 ? "Compare" : "Select apps")} className="danger" onClick={() => openComparisonModal() } disabled={ checkedApps.length >= 1 ? false : true }/>
                            </div>
                            <div className="estimation">Estimated time: {checkedApps.length * 5} min (~5min/app)</div>
                        </div>
                    </div>
                    {renderApps()}
                </div>
            </div>
        );
}

export default Home;