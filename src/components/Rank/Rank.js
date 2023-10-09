import React from 'react';




const Rank = ({name, entries}) => {
    return (
        <div>
            <div className="white f3">
                {`Hi ${name}, You have entered:`}
            </div>
            <div className="f1 blue">
                {entries}
            </div>
            <div className="white f3">
                {'Photo'}
            </div>
        </div>
    )
}

export default Rank;