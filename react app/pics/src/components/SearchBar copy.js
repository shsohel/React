import React from 'react';

class SearchBar extends React.Component{
    render() {
        return(
            <div className="ui segment">
                <form className="ui form">
                    <label> Image Search</label>
                    <div className="field">
                    <input type="text"/>
                    </div>
                </form>
            </div>
        );
    };
};

export default SearchBar;