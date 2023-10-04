import React from "react";
import './ImageLinkForm.css'




const ImageLinkForm = ({onInputChange, onButtonSubmit}) => {
    return (
        <div className='ma3 mt0'>
            <p className='f3'>
                {'This Magic Brain will detect faces in your pictures. Add Image URL below :)'}
            </p>
            <div className='center'>
                <div className='center pa4 br4 shadow-3 form'>
                <input  className='f4 pa2 w-70 br3 center' type='text' onChange={onInputChange}/>
                <button 
                className='w-30 grow f5 br3 link ph3 pv2 dib white bg-light-blue' 
                onClick={onButtonSubmit}
                >Detect</button>
                </div>
            </div>
        </div>
    )
}

export default ImageLinkForm;