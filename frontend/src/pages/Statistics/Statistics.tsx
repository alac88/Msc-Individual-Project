import React, {
    useState,
    useEffect
} from 'react';
import './Statistics.scss';

interface AppProps{
    ID: number, 
    NAME_APP: string, 
    PACKAGE_NAME: string, 
    VERSION_APP: string, 
    CATEGORY: string, 
    PRICE: number, 
    RATINGS: number
}

function Statistics(props: any) {

    const [appsList, setApps] = useState(Array<AppProps>());

    useEffect(() => {
        getApps();
    }, []);

    function getApps() {
        fetch('http://localhost:3001')
            .then(response => {
                return response.json();
            })
            .then(data => {
                setApps(data);
            });
    }


        return (
            <div className="container">
                <h1>Statistics</h1>
                <p><b>Total number of apps: </b>{appsList.length}</p>
                <p>Number of categories:</p>
                <p>Number in each category:</p>
                <table>
                    <tr></tr>
                </table>
                <p>Crawler running time:</p>
            </div>
        );
}

export default Statistics;