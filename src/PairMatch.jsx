import { Button } from "primereact/button";
import { useEffect, useState } from 'react';

function PairMatch(props) {
    const pairs = [
        {id: 0, x: 'a', y: 'aa', state: ''},
        {id: 1, x: 'b', y: 'bb', state: ''},
        {id: 2, x: 'c', y: 'cc', state: ''},
        {id: 3, x: 'd', y: 'dd', state: ''},
        {id: 4, x: 'e', y: 'ee', state: ''},
    ]
    const [xSuffledPairs, setXSuffledPairs] = useState(JSON.parse(JSON.stringify(pairs)).sort(() => Math.random() - 0.5))
    const [ySuffledPairs, setYSuffledPairs] = useState(JSON.parse(JSON.stringify(pairs)).sort(() => Math.random() - 0.5))

    const handleXClick = (id) => {
        checker(id, null)
    }
    const handleYClick = (id) => {
        checker(null, id)
    }

    const checker = (xIdClicked, yIdClicked) => {
        let xFlag = false
        let yFlag = false
        let xId = null
        let yId = null
        let newXSuffledPairs = JSON.parse(JSON.stringify(xSuffledPairs))
        let newYSuffledPairs = JSON.parse(JSON.stringify(ySuffledPairs))
        //iterate to mark info status
        if(xIdClicked !== null) {
            for (let n in newXSuffledPairs) {
                let pair = newXSuffledPairs[n]
                if(pair.state != 'success') {
                    if (pair.id === xIdClicked) {
                        pair.state = 'info'
                    } else {
                        pair.state = ''
                    }
                }
            }
        }
        if(yIdClicked != null) {
            for (let n in newYSuffledPairs) {
                let pair = newYSuffledPairs[n]
                if(pair.state != 'success') {
                    if (pair.id === yIdClicked) {
                        pair.state = 'info'
                    } else {
                        pair.state = ''
                    }
                }
            }
        }
        
        //check if x and y are marked
        for (let n in newXSuffledPairs) {
            let pair = newXSuffledPairs[n]
            if (pair.state === 'info') {
                xFlag = true
                xId = pair.id
                break
            }
        }
        for (let n in newYSuffledPairs) {
            let pair = newYSuffledPairs[n]
            if (pair.state === 'info') {
                yFlag = true
                yId = pair.id
                break
            }
        }
        //checkk is x and y is marked
        if(xFlag && yFlag) {
            //decide is it correct match
            if(xId === yId) {
                for (let n in newXSuffledPairs) {
                    let pair = newXSuffledPairs[n]
                    if (pair.id === xId) {
                        pair.state = 'success'
                        break
                    }
                }
                for (let n in newYSuffledPairs) {
                    let pair = newYSuffledPairs[n]
                    if (pair.id === yId) {
                        pair.state = 'success'
                        break
                    }
                }
            }
            //reset state of not matched
            for (let n in newXSuffledPairs) {
                let pair = newXSuffledPairs[n]
                if (pair.state !== 'success') {
                    pair.state = ''
                }
            }
            for (let n in newYSuffledPairs) {
                let pair = newYSuffledPairs[n]
                if (pair.state !== 'success') {
                    pair.state = ''
                }
            }
        }
        setXSuffledPairs(newXSuffledPairs)
        setYSuffledPairs(newYSuffledPairs)
    }

  return (
    <div className="flex align-content-center justify-content-center flex-wrap text-center" style={{minHeight: 300}} >
      <div className="flex">
        <div className="flex flex-column w-6">
            {xSuffledPairs.map((pair) => 
                <Button 
                    key={pair.id}
                    label={pair.x} 
                    onClick={() => handleXClick(pair.id)}
                    severity={pair.state}
                    className="mx-1 my-1"
                />
            )}
        </div>
        <div className="flex flex-column w-6 w-min">
            {ySuffledPairs.map((pair) => 
                <Button 
                    key={pair.id}
                    label={pair.y} 
                    onClick={() => handleYClick(pair.id)}
                    severity={pair.state}
                    className="mx-1 my-1"
                />
            )}
        </div>
      </div>
    </div>

  );
}

export default PairMatch;
