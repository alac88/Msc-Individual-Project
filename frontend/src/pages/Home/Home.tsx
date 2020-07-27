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
    TEST1: number,
    TEST2: number,
    TEST3: number,
    SECURITY_SCORE: number
}

function Home(props: any) {

    const [appsList, setApps] = useState(Array<AppProps>());
    const [modalShow, setModalShow] = useState(false);
    const [appsChecked, setAppsChecked] = useState(Array<AppProps>());

    const [appSelected, setAppSelected] = useState<AppProps>();

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

    function checkApp(app: AppProps){

        const index = appsChecked.indexOf(app);

        if (index > -1 ){
            appsChecked.splice(index, 1);
            console.log(appsChecked);
            return;
        }

        setAppsChecked([...appsChecked, app ]);
        
        console.log(appsChecked);
    }

    function checkAll(){
        if (appsChecked.length == appsList.length){
            setAppsChecked([]);
        } else {
            setAppsChecked([]);
            appsList.map((app) => {
                console.log(app.PACKAGE_NAME);
                setAppsChecked([...appsChecked, app]);
            })
        }

    }

    function isChecked(name: string){
        appsChecked.map((app) => {
            if (name == app.NAME_APP){
                return true;
            }
        })
        return false;
    }

    function openModal(name: string){
        getAppInfo(name);
        document.getElementById("overlay")?.classList.add('active');
        setModalShow(true);

    }

    function closeModal(){
        setModalShow(false);
        document.getElementById("overlay")?.classList.remove('active');
        setAppSelected(undefined);
    }

    function renderApps(){
        return (
            <div className="bottomBar">
                <div className="row">
                        <input id="all" type="checkbox" onClick={() => checkAll()}/>
                </div>
                {appsList.map((app) => (
                    <div className="row">
                        <input id={app.NAME_APP} type="checkbox" onClick={() => checkApp(app)} defaultChecked={isChecked(app.PACKAGE_NAME)}/>
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
                {/* {appsChecked && modalShow && <ComparisonModal
                    appsChecked={appsChecked}
                    show={modalShow}
                    onHide={() => closeModal()}
                    />} */}
                <div className="appContainer">
                    <div className="topBar">
                        <div className="appNumber">{appsList.length} apps found</div>
                        <div className="button">
                            <input type="submit" name="compare" defaultValue="Compare" className="danger" disabled={ appsChecked.length > 0 ? false : true }/>
                        </div>
                    </div>
                    {renderApps()}
                </div>
            </div>
        );
}

export default Home;