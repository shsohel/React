import axios from 'axios';

const KEY ="AIzaSyCUOJHHtkX-9Qg228Fz9rNyu1CZkQNsE2o";

export default axios.create({
    baseURL: 'https://www.googleapis.com/youtube/v3',
    params:{
        part:'snippet',
        maxResults:5,
        key:KEY
    }
})

