import React from 'react';
import './ImageLinkForm.css'




const ImageLinkForm = () => {
    return (
        <div className='ma3 mt0'>
            <p className='f3'>
                {'This Magic Brain will detect faces in your pcitures. Try it out :)'}
            </p>
            <div className='center'>
                <div className='center pa4 br4 shadow-3 form'>
                <input  className='f4 pa2 w-90 br3 center' type='text'/>
                <button className='w-30 grow f4 br3 link ph3 pv2 dib white bg-light-blue'>Detect</button>
                </div>
            </div>
        </div>
    )
}

export default ImageLinkForm;