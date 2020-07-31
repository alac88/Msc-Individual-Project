import React, { useState } from 'react';
import './CategoryList.scss'

interface Props {

}

function CategoryList(props: Props){

    const [categoryList, setCategoryList] = useState([
        "Art & Design",
        "Augmented Reality",
        "Auto & Vehicles",
        "Beauty",
        "Books & Reference",
        "Business",
        "Comics",
        "Communication",
        "Dating",
        "Daydream",
        "Education",
        "Entertainment",
        "Events",
        "Finance",
        "Food & Drink",
        "Health & Fitness",
        "House & Home",
        "Libraries & Demo",
        "Lifestyle",
        "Maps & Navigation",
        "Medical",
        "Music & Audio",
        "News & Magazines",
        "Parenting",
        "Personalization",
        "Photography",
        "Productivity",
        "Shopping",
        "Social",
        "Sports",
        "Tools",
        "Travel & Local",
        "Video Players & Editors",
        "Wear OS by Google",
        "Weather",
        "Games",
        "Action",
        "Adventure",
        "Arcade",
        "Board",
        "Card",
        "Casino",
        "Casual",
        "Educational",
        "Music",
        "Puzzle",
        "Racing",
        "Role Playing",
        "Simulation",
        "Strategy",
        "Trivia",
        "Word",
        "Family",
        "Ages 5 & Under",
        "Ages 6-8",
        "Ages 9 & Up",
        "Action & Adventure",
        "Brain Games",
        "Creativity",
        "Music & Video",
        "Pretend Play"]);

    
    return (
        <div className="categoryListContainer">
            <h5>Category</h5>
            <input placeholder="Choose a category" list="categories" name="category" id="category"/>
                <datalist id="categories">
                    {categoryList.map((category) => {
                        return <option key={category} value={category}/>
                    })}
                </datalist> 
        </div>
    )

}

export default CategoryList;