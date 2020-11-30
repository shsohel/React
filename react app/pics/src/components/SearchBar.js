import React from 'react';

class SearchBar extends React.Component {
 state={term: ''}

 onSubmitForm =event=>{
     event.preventDefault();
     console.log(this.state.term);
     this.props.onSubmit(this.state.term)
 }

    render() {
        return (
            <div className="ui segment">
                <form onSubmit={this.onSubmitForm} className="ui form">
                    <label> Image Search</label>
                    <div className="field">
                        <input type="text" 
                        value={this.state.term} 
                        onChange={(e)=>this.setState({term: e.target.value})} />
                    </div>
                </form>
            </div>
        );
    }
}

export default SearchBar;