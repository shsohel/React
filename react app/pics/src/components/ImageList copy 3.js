import '../style/ImageList.css'
import React from 'react';



const ImageList = (props) => {
    console.log(props.images)
    const images=props.images.map(({alt_description,id,urls})=>{
        return(
            <img alt={alt_description} key={id} src={urls.regular}/>
        )
    })
    return (
        <div className="imageList">{images}</div>
    )
}

export default ImageList;


// import '../style/ImageList.css'
// import React from 'react';
// import ImageCard from './ImageCard';



// const ImageList = (props) => {
//     console.log(props.images)
//     const images=props.images.map((image)=>{
//         return(
//             <ImageCard key={image.id} image={image} />
//         )
//     })
//     return (
//         <div className="image-list">{images}</div>
//     )
// }

// export default ImageList;