import React, { useState, useEffect } from 'react';

const BLANK = 0;
const FILLED = 1;
const SELECTED = 2;

function Cell(props)
{
    const [className, setClass] = useState('cell');

    let posStl = 
    {
        left:   props.data.x * (props.data.width + 0) + 'px',
        top:    props.data.y * (props.data.height + 0) + 'px',
        width:  props.data.width + 'px',
        height: props.data.height + 'px',
        backgroundColor: props.data.colour.hex,
        borderRadius: props.data.width / 2 +'px'
    }

    const onMouseEnter = (e) =>
    {
        props.data.fillFunc(props.data.x, props.data.y);
        setClass('cell-hover');
    }

    const onMouseLeave = (e) =>
    {
        props.data.clearFunc(props.data.x, props.data.y);
        setClass('cell');
    }

    const onMouseDown = (e) =>
    {
        if (props.data.cellValue === BLANK)
            return;

        props.data.clickFunc(props.data.x, props.data.y);
    }

    return (
        <div className={className} 
            style={posStl}
            onMouseEnter={ (e) => onMouseEnter(e) } 
            onMouseLeave={ (e) => onMouseLeave(e) }
            onMouseDown= { (e) => onMouseDown(e)  }
            > 
                <div className='cell-text'>{props.data.text}</div>
        </div>
    );
}

let count = 0;
function Grid(props) 
{
    const [gridState, setNewGridData] = useState(props.gridData);
    const [selected, selectCell] = useState({x:-1, y:-1});
    const [storedCount, setCount] = useState('');
    const [divWidth, setWidth] = useState(0);
    const [divHeight, setHeight] = useState(0);
    const GRID_DIM = props.gridData[0].length;

    useEffect(() => 
    {
        console.log("New grid data recieved")
        setNewGridData([...props.gridData]);
        selectCell({x:-1, y:-1});

        var elem = document.getElementById("grid");
        if(elem) 
        {
            var rect = elem.getBoundingClientRect();
            console.log("Grid size: ", rect);  
            
            //setWidth(rect.width);
            setWidth(elem.clientWidth);
            setHeight(elem.clientHeight);
        }

        return function cleanup()
        {
            console.log("Grid cleanup")
        }
      }, [props.gridData]);

    function clearFill() 
    {
        for (let y= 0; y < GRID_DIM; y++)
        {
            const curRow = gridState[y];
            for (let x= 0; x < GRID_DIM; x++)
            {
                if (curRow[x] === SELECTED)
                    curRow[x] = FILLED;
            }
        }

        setNewGridData([...gridState]);
    }

    function floodFill(col, row) // x=col, y=row
    {
        let queue = [];
        let grid = props.gridData;
        const cellValue = grid[row][col];
        
        // ignore blanks and already coloured
        if (cellValue === BLANK || cellValue === SELECTED)
        {
            console.log("nothing to do");
            return;
        }
        
        console.log("Reset count");
        count = 0;
        if (cellValue === FILLED)
        {
            grid[row][col] = SELECTED;
            queue.push({x:col, y:row});
            count++;
        }
        
        // Using a queue approach for the fill rather than a recursive stack solution.
        while (queue.length > 0)
        {
            // using an array like a queue with push and shift.
            // Shift will remove the oldest element instead of pop which will remove the most recent
            let currentCell = queue.shift();
            let x = currentCell.x;
            let y = currentCell.y;
            // Now check neighbours.  
            // When indexing the array we dont need to make sure we have a valid index,
            // JavaScript will return 'undefined' for elements outside the array which
            // will subsequently fail the comparison to 'FILLED' and be ignored.
            
            // West
            let checkX = currentCell.x - 1;
            let checkY = currentCell.y;
            if (checkY < GRID_DIM && checkY >= 0)
            {
                if (grid[checkY][checkX] == FILLED)
                {
                    grid[checkY][checkX] = SELECTED;
                    queue.push({x:checkX, y:checkY});
                    count++;
                }
            }
            
            // East
            checkX = currentCell.x + 1;
            checkY = currentCell.y;
            if (checkY < GRID_DIM && checkY >= 0)
            {
                if (grid[checkY][checkX] == FILLED)
                {
                    grid[checkY][checkX] = SELECTED;
                    queue.push({x:checkX, y:checkY});
                    count++;
                }
            }
            
            // North
            checkX = currentCell.x;
            checkY = currentCell.y-1;
            if (checkY < GRID_DIM && checkY >= 0)
            {
                if (grid[checkY][checkX] == FILLED)
                {
                    grid[checkY][checkX] = SELECTED;
                    queue.push({x:checkX, y:checkY});
                    count++;
                }
            }
            
            // South
            checkX = currentCell.x;
            checkY = currentCell.y+1;
            if (checkY < GRID_DIM && checkY >= 0)
            {
                if (grid[checkY][checkX] == FILLED)
                {
                    grid[checkY][checkX] = SELECTED;
                    queue.push({x:checkX, y:checkY});
                    count++;
                }
            }
        }

        const newData = [...grid];
        setNewGridData(newData);

        console.log(count);
    }

    function cellClicked(col, row) // x=col, y=row
    {
        console.log(col, row);
        selectCell({x:col, y:row});
        setCount(count);
    }
    
    let cells = new Array;
    let cellWidth = divWidth / GRID_DIM;
    let cellHeight = divHeight / GRID_DIM;
    
    // for each row...
    for (let y= 0; y < gridState.length; y++)
    {
        const curRow = gridState[y];
        
        // generate a cell for each element
        for (let x= 0; x < gridState.length; x++)
        {
            
            let cellProps = 
            {
                x: x,
                y: y,
                width:  cellWidth,                        
                height: cellHeight,
                cellValue: curRow[x],
                colour: props.colours.empty,
                fillFunc: floodFill,
                clearFunc: clearFill,
                clickFunc: cellClicked
            };
            
            if (x === selected.x && y === selected.y)
            {
                cellProps.text = storedCount;
            }

            if (curRow[x] === FILLED)
                cellProps.colour = props.colours.filled;
            else if (curRow[x] === SELECTED)
                cellProps.colour = props.colours.hover;

            cells.push(cellProps);
        }
    }
    
    //console.log("Grid Render");
    return (
        <div 
            id='grid' 
            className='grid'>
            {cells.map ( (c) => <Cell key={`${c.x}_${c.y}`} data={c}/>) }
        </div>
        );
}

export
{
    Grid,
}