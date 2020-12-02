import React from 'react';
import { connect } from 'react-redux';

class SongList extends React.Component {
    render() {
        return <div> SongList </div>;
    }
}
const mapStateToProps = state => {
    console.log(state)
    return state;
}

export default connect(mapStateToProps)(SongList);