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

const databaseUrl ="localhost";

function Statistics(props: any) {

    const [appsList, setApps] = useState(Array<AppProps>());
    const [categoriesList, setCategoriesList] = useState(Array());

    useEffect(() => {
        getApps();
        getCategories();
    }, []);

    function getApps() {
        fetch(`http://${databaseUrl}:3001`)
            .then(response => {
                return response.json();
            })
            .then(data => {
                setApps(data);
            });
    }

    function getCategories() {
        fetch(`http://${databaseUrl}:3001/categories`)
            .then(response => {
                return response.json();
            })
            .then(data => {
                setCategoriesList(data);
            });
    }


    return (
        <div className="container">
            <h1>Statistics</h1>
            <table>
                <thead>
                    <tr>
                        <th scope="col">Category</th>
                        <th scope="col">Number of apps</th>
                    </tr>
                </thead>
                <tbody>
                    {categoriesList.map((cat: any) => {
                        return (
                            <tr>
                                <th>{cat.CATEGORY}</th>
                                <th>{cat.count}</th>
                            </tr>
                        );
                    })}
                    <tr className="total">
                        <th>Total number of apps</th>
                        <th>{appsList.length}</th>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}

export default Statistics;