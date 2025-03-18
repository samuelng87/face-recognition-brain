import React, { useState } from 'react';
import './FaceRecognition.css';

const FaceRecognition = ({imageUrl, analysisResult}) => {
    const [imageError, setImageError] = useState(false);

    const handleImageError = () => {
        setImageError(true);
    };

    const handleImageLoad = () => {
        setImageError(false);
    };

    // Helper function to safely render the analysis result
    const renderAnalysisResult = (result) => {
        if (result === 'Analyzing image...') {
            return (
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p className="dark-gray">Analyzing with GPT-4o Vision, please wait...</p>
                </div>
            );
        }
        
        // Check if result is a string before using split
        if (typeof result === 'string') {
            return result.split('\n').map((line, i) => (
                <p key={i}>{line}</p>
            ));
        }
        
        // If not a string, display as is or convert to string
        return <p>{String(result)}</p>;
    };

    return (
        <div className='analysis-container'>
            <div className='image-section'>
                {imageUrl && (
                    <>
                        {imageError ? (
                            <div className='image-error-container'>
                                <p className='image-error-message'>
                                    <span className="red b">Image not found.</span><br/>
                                    Please check if the URL is correct and publicly accessible.
                                </p>
                            </div>
                        ) : (
                            <div className='image-wrapper'>
                                <img 
                                    id='inputimage' 
                                    alt='' 
                                    src={imageUrl} 
                                    width='500px' 
                                    height='auto'
                                    onError={handleImageError}
                                    onLoad={handleImageLoad}
                                />
                            </div>
                        )}
                    </>
                )}
            </div>
            
            {/* Analysis Result Dialog */}
            {analysisResult && (
                <div className='analysis-dialog'>
                    <h3 className="blue mb3">AI Vision Analysis</h3>
                    <div className='analysis-content'>
                        {renderAnalysisResult(analysisResult)}
                    </div>
                </div>
            )}
        </div>
    )
}

export default FaceRecognition;