import React from 'react';
import axios from 'axios';
import SearchBar from "./SearchBar";

class App extends React.Component {
    onSubmitSearch(term){
        axios.get('https://api.unsplash.com/search/photos',{
            params:{query:term} ,
            headers:{
                Authorization: 'Client-ID ognODPHmVE002lKJtqasefTKVliUHTcSRO_AA3brxGw'
            }
        });
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
