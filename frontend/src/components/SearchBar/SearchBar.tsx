import React from 'react';
// import { FormattedMessage } from 'react-intl';
import './SearchBar.scss'
import Counter from '../Counter';
import CategoryList from '../CategoryList';
import RatingsList from '../RatingsList';

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
                <div className="ratingsContainer">
                    <RatingsList />
                </div>
                <div className="numberContainer">
                    <div className="max">
                        <Counter />
                    </div>
                </div>
                <div className="button danger">
                        <input type="submit" name="validate" defaultValue="Search" className="danger"/>
                </div>
            </div>

        </form>
    )

}

export default SearchBar;