
const songsReducer=()=>{
    return[
        {title:'Tumi amar ke',duration:'4.50'},
        {title:'I love you ',duration:'4.50'},
        {title:'O priya tumi',duration:'5.50'},
        {title:'Amma Jan Amma Jan',duration:'1.50'},
        {title:'Sei jon prem ',duration:'7.50'},
    ]
}

const seletedSongReducer=(seletedSong=null,action)=>{
    if(action.type==='SONG_SELECTED'){
        return action.payload;
    }
    return seletedSong;
};