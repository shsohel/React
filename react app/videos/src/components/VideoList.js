import React from 'react';
import VideoItem from './VideoItem';

const VideoList = ({ videos, onVideoSelect }) => {
    const rendervidoe = videos.map((video) => {
        return <VideoItem key={video.id.videoId} onVideoSelect={onVideoSelect} video={video} />
    })
    return (
        <div className="ui relaxed divided list">{rendervidoe} </div>
    )
}
export default VideoList;