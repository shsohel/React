import React from 'react';

class SearchBar extends React.Component {
    state = { term: '' };

    onChangeInput = (event) => {
        this.setState({ term: event.target.value })
    }
    onFormSubmit = (event) => {
        event.preventDefault();
       // console.log('Hi! there!!');

       this.props.onFormSubmit(this.state.term);
    }

    render() {
        return (
            <div onSubmit={this.onFormSubmit} className="search-bar ui segment">
                <form className="ui form">
                    <div className="field">
                        <label> Video Search</label>
                        <input type="text" onChange={this.onChangeInput} value={this.state.term} />

                    </div>

                </form>

            </div>
        );
    }
}
export default SearchBar;