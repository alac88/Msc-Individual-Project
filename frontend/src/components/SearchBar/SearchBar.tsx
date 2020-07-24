import React from 'react';
// import { FormattedMessage } from 'react-intl';
import './SearchBar.scss'
import Counter from '../Counter';
import CategoryList from '../CategoryList';
import AnalysisList from '../AnalysisList';

function SearchBar(){
    
    return (
        <form>
            <div className="searchContainer">
                <div className="nameContainer">
                    <h5>Name</h5>
                    <input name="name" placeholder="App name, Package name, ..." />
                </div>
                <div className="categoryContainer">
                    <CategoryList />
                </div>
                <div className="analysisContainer">
                    <AnalysisList />
                </div>
                <div className="numberContainer">
                    <div className="max">
                        <Counter name="Max"/>
                    </div>
                </div>
                <div className="button danger">
                    {/* <button><FormattedMessage id="home.search" /></button> */}
                        <input type="submit" name="validate" value="Search" className="danger"/>
                </div>
            </div>

        </form>
    )

}

export default SearchBar;