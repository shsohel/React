import React from 'react';
import axios from 'axios';
import SearchBar from "./SearchBar";

class App extends React.Component {
 async  onSubmitSearch(term) {

  const response= await axios.get('https://api.unsplash.com/search/photos', {
            params: { query: term },
            headers: {
                Authorization: 'Client-ID ognODPHmVE002lKJtqasefTKVliUHTcSRO_AA3brxGw'
            }
        });
        console.log(response.data.results)
    }
    render() {
        return (
            <div className="ui container" style={{ marginTop: '10px' }}>
                <SearchBar onSubmit={this.onSubmitSearch} />
            </div>
        );
    }


}


export default App;
