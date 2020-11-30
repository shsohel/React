import React from 'react';
import SearchBar from "./SearchBar";

class App extends React.Component {
    onSubmitSearch(term){
        console.log(term);
    }
    render() {
        return (
            <div className="ui container" style={{ marginTop: '10px' }}>
                <SearchBar onSubmit={this.onSubmitSearch}/>
            </div>
        );
    }


}


export default App;
