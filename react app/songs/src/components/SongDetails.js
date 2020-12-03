import React from 'react';
import { connect } from 'react-redux'

const SongDetails = ({song}) => {
if(!song){
    return <div> You need to select a song!</div>;
}
    return (<div>
        <h3>Details for:</h3>
        <p>
            Title: {song.title}
            <br/>
            Duration:{song.duration}
        </p>
    </div>);
}

const mapStateToProps = state => {
    return { song: state.seletedSong }
}
export default connect(mapStateToProps) (SongDetails);