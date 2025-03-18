import React from "react";
import './ImageLinkForm.css'

const ImageLinkForm = ({onInputChange, onButtonSubmit}) => {
    return (
        <div className='ma3 mt0'>
            <p className='f4 dark-gray mb2'>
                {'Enter an image URL below to receive a detailed AI analysis.'}
            </p>
            <div className='guidelines pa3 br3 mb3 w-80 center bg-lightest-blue shadow-4'>
                <p className='f5 dark-gray mb2 fw5'>
                    <span className="b">Tips for best results:</span>
                </p>
                <ul className='f6 dark-gray tl mb2 pl4'>
                    <li className='mb1'>Use direct image URLs ending with .jpg, .jpeg, .png, or .gif</li>
                    <li className='mb1'>Right-click on images and select "Copy image address"</li>
                    <li className='mb1'>Avoid Google thumbnail URLs containing "encrypted-tbn"</li>
                </ul>
            </div>
            <div className='center'>
                <div className='center pa4 br4 shadow-3 form'>
                <input 
                    className='f4 pa2 w-70 br3 center'
                    type='text' 
                    placeholder='https://example.com/image.jpg'
                    onChange={onInputChange}
                />
                <button 
                className='w-30 grow f5 br3 link ph3 pv2 dib white bg-light-blue pointer' 
                onClick={onButtonSubmit}
                >Analyze</button>
                </div>
            </div>
            <div className='mt3 w-80 center'>
                <p className='f6 mid-gray i'>
                    Try with: <a href="#" className="light-blue no-underline" onClick={(e) => {e.preventDefault(); onInputChange({target:{value:"https://images.unsplash.com/photo-1575936123452-b67c3203c357"}}); }}>Unsplash sample image</a> or <a href="#" className="light-blue no-underline" onClick={(e) => {e.preventDefault(); onInputChange({target:{value:"https://www.goodfreephotos.com/albums/other-landscapes/lake-and-mountains-landscape.jpg"}}); }}>Landscape photo</a>
                </p>
            </div>
        </div>
    )
}

export default ImageLinkForm;