import axios from 'axios';

export default axios.create({
baseURL:"https://api.unsplash.com",
headers: {
    Authorization: 'Client-ID ognODPHmVE002lKJtqasefTKVliUHTcSRO_AA3brxGw'
}
});