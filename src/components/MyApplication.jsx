import React from 'react';
import {Grid} from './Grid.jsx'
import {Options} from './Options.jsx'

const DEFAULT_GRID_SIZE = 10;

export default class MyApplication extends React.Component 
{

    constructor(props) 
    {
        super(props);

        this.state = {
            winWidth:  window.innerWidth,
            winHeight: window.innerHeight,
            gridData:  this.generateGridData(DEFAULT_GRID_SIZE),
            colours:
                {
                    empty: {hex:'#eeeeee'},
                    filled:{hex:'#adBEEF'},
                    hover:{hex:'#4557D7'}
                }
        };

        window.addEventListener("resize", this.onResize);

    }

    generateGridData = (n) =>
    {
        let tempGridData = Array(n).fill(0).map(x => Array(n).fill(0));

        for (let row = 0; row < n; row++)
        {
            for (let col = 0; col < n; col++)
            {
                let num = Math.floor((Math.random() * 2));
                tempGridData[row][col] = num;
            }
        }

        return tempGridData;
        //this.setState({ gridData: [...tempGridData] });
    }

    onResize = (e) =>
    {
        console.log("Height: ", e.target.innerHeight);
        console.log("Width: ", e.target.innerWidth);
        this.setState({ 
            winWidth: e.target.innerWidth,
            winHeight: e.target.innerHeight 
        });
    };

    onNewGridSize = (n) =>
    {
        this.setState({ gridData: [...this.generateGridData(n)] });
    };

    onColourChange = (type, colour) =>
    {
        let newColours = this.state.colours;
        if (type === 'filled')
            newColours.filled = colour;
        else
            newColours.hover = colour;

        this.setState({ colours: newColours });
    };

    render() 
    {
        return (
            <div>
                <Options 
                    defaultGridSize={DEFAULT_GRID_SIZE}
                    newGridSize={this.onNewGridSize}
                    colourChange={this.onColourChange}
                    colours={this.state.colours} />

                <Grid 
                    gridData={this.state.gridData} 
                    width={this.state.winWidth}
                    height={this.state.winHeight}
                    colours={this.state.colours} />

            </div>
        );
    }

}