import React, { useState, useEffect } from 'react';
import { SketchPicker, MaterialPicker, BlockPicker, TwitterPicker } from 'react-color'
import { makeStyles, recomposeColor } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';

const useStyles = makeStyles({
  root: 
  {
    position: "absolute",
    //width: 300,
    top: 10,
    //left: 10,
    right:'50%',
    transform: 'translate(-420px, 0)',
    padding: 10,
    border: '2px rgb(200, 200, 200) solid',
    borderRadius: 10,
    zIndex:999
  },
});

function Options(props) 
{
    const classes = useStyles();

    const [colour, setColour] = useState(props.colours.filled);
    const [whichCol, setWhichCol] = useState('filled');
    const [gridSize, setGridSize] = useState(props.defaultGridSize);
    
    const onSliderChange = (e, val) =>
    {
        setGridSize(val);
    }
    
    const onChangeCommitted = (e, val) =>
    {
        props.newGridSize(val);
    }
    
    // Colour changed from selector
    const handleChangeComplete = (newColour) => 
    {
        setColour(newColour);

        props.colourChange(whichCol, newColour);
    };

    const handleRadioChange = (event) => 
    {
        setWhichCol(event.target.value);

        setColour(props.colours[event.target.value])
    }

    const stl = {backgroundColor:colour};
    
    return (
        <div className={classes.root}>

            <Typography variant='h4' id="discrete-slider" gutterBottom>Grid Fill Demo</Typography>
            <Typography variant='h6' id="discrete-slider" gutterBottom>
                    Grid Size: {gridSize} x {gridSize}
                </Typography>
            <Slider
                defaultValue={props.defaultGridSize}
                valueLabelDisplay="auto"
                step={1}
                marks
                min={2}
                max={20}
                onChange={onSliderChange}
                onChangeCommitted={onChangeCommitted}
            />
      
            <RadioGroup aria-label="quiz" name="quiz" value={whichCol} onChange={handleRadioChange}>
                <div> 
                    <div className={'radioCol'} style={{backgroundColor:props.colours.filled.hex}} >{props.colours.filled.hex} </div>
                    <FormControlLabel value="filled" control={<Radio />} label="Filled." /> 
                </div> 
                <div>  
                    <div className={'radioCol'} style={{backgroundColor:props.colours.hover.hex}}>{props.colours.hover.hex} </div>
                    <FormControlLabel value="hover" control={<Radio />} label="Hovered." />
                </div>
            </RadioGroup>

            <SketchPicker 
                className='picker' 
                onChangeComplete={ (e) => handleChangeComplete(e) }
                color={colour}/> 
                
                
        </div>
        );
}

export
{
    Options,
}