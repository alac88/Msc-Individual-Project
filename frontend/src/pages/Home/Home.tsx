import React, {
    useState,
    useEffect
} from 'react';
import Card from '../../components/Card';
import SearchBar from '../../components/SearchBar';
import Block from '../../components/Block';
// import AppList from '../../components/AppList';
import AppModal from '../../modals/AppModal';
import ComparisonModal from '../../modals/ComparisonModal';
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
    const [modalShow, setModalShow] = useState(false);
    
    const [appSelected, setAppSelected] = useState<AppProps>();
    
    const [checkedApps, setCheckedApps] = useState(Array<AppProps>());

    // const [state, setState] = useState(false);
    const [showComparisonModal, setShowComparisonModal] = useState(false);

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


    function getAppInfo(name: string) {
        // fetch(`http://localhost:3001/app?packageName=${props.packageName}`)
        fetch(`http://${databaseUrl}:3001/app?packageName=${name}`)
        .then(response => {
            return response.json();
        })
        .then(data => {
            setAppSelected(data);
        });
    }

    function openModal(name: string){
        getAppInfo(name);
        document.getElementById("overlay")?.classList.add('active');
        setModalShow(true);
    }

    function openComparisonModal(){
        document.getElementById("overlay")?.classList.add('active');
        setShowComparisonModal(true);
    }

    function closeModal(isComparisonModal=false){
        if (!isComparisonModal){
            setModalShow(false);
            setAppSelected(undefined);
        } else {
            setShowComparisonModal(false);
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
                var newCheckedApps = checkedApps.filter((el) => el.PACKAGE_NAME == checkbox?.id)
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
                    <div className="row">
                        <input key={"checkbox"+app.ID} id={app.PACKAGE_NAME} onChange={() => checkApp(app.PACKAGE_NAME)} name="checkbox" type="checkbox" checked={isChecked(app)}/>
                        <Card select={() => openModal(app.PACKAGE_NAME)} key={app.ID} id={app.ID} name={app.NAME_APP} packageName={app.PACKAGE_NAME} version={app.VERSION_APP} category={app.CATEGORY} price={app.PRICE} ratings={app.RATINGS} ></Card>
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
                {appSelected && <AppModal
                    app={appSelected}
                    show={modalShow}
                    onHide={() => closeModal()}
                    />}
                {showComparisonModal && <ComparisonModal
                    appsChecked={checkedApps}
                    show={showComparisonModal}
                    onHide={() => closeModal(true)}
                    />}
                <div className="appContainer">
                    <div className="topBar">
                        <div className="appNumber">{appsList.length} apps found</div>
                        <div className="button">
                            {/* <input type="submit" name="compare" value="Compare" className="danger" disabled={ getCheckedApps().length >= 2 ? false : true }/> */}
                            <input type="submit" name="compare" value="Compare" className="danger" onClick={() => openComparisonModal() } disabled={ checkedApps.length >= 2 ? false : true }/>
                        </div>
                    </div>
                    {renderApps()}
                </div>
            </div>
        );
}

export default Home;