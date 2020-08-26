import React, {
    useState,
    useEffect
} from 'react';
import Graphs from '../../components/Graphs';
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

// const databaseUrl ="localhost";
const databaseUrl ="146.169.42.43";

function Statistics() {

    const [appsList, setApps] = useState(Array<AppProps>());
    const [categoriesList, setCategoriesList] = useState(Array());
    const [ratingsList, setRatingsList] = useState(Array<number>());

    useEffect(() => {
        getApps();
        getCategories();
    }, []);

    useEffect(() => {
        getRatingsList();
    }, [appsList]);

    function getApps() {
        fetch(`http://${databaseUrl}:3001?rating=0`)
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
                setCategoriesList(convertCategories(data));
            });
    }

    function convertCategories(categories: any){
        let tmp = Array();
        let i = 0;
        while (categories[i]){
            tmp.push({"name": categories[i].name, "value": parseInt(categories[i].value)})
            i++;
        }
        return tmp;

    }

    function getRatingsList(){
        let tmp = Array();
        for (let i = 0; i < 5; i += 0.1){
            tmp.push({"name": Math.round(i*10)/10, "value": getAppsNumberRating(Math.round(i*10)/10)});
        }
        setRatingsList(tmp);
    }

    function getAppsNumberRating(rating: number){
        let number = 0;
        let i = 0;
        while (appsList[i]){
            if (appsList[i].RATINGS == rating) {
                number++;
            }
            i++;
        }

        return number;
    }


    return (
        <div className="container">
            <h1>Dataset statistics</h1>
            
            <div className="categories">
                <h3>Categories</h3>

                {categoriesList ? <Graphs data={categoriesList}/>: null}
                
                <table>
                    <thead>
                        <tr>
                            <th scope="col">Category</th>
                            <th scope="col">Number of apps</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categoriesList.map((cat) => {
                            return (
                                <tr>
                                    <th>{cat.name}</th>
                                    <th>{cat.value}</th>
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
            
            <div className="ratings">
                <h3>Ratings</h3>

                {ratingsList ? <Graphs data={ratingsList}/>: null}

                <table>
                    <thead>
                        <tr>
                            <th scope="col">Ratings</th>
                            <th scope="col">Number of apps</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ratingsList.map((rating: any) => {
                            return (
                                <tr>
                                    <th>{rating.name}</th>
                                    <th>{rating.value}</th>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Statistics;