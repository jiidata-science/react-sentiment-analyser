import React, { useState, useEffect } from 'react';
import Highlighter from "react-highlight-words";

import { makeStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControl from '@material-ui/core/FormControl';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';

import { green, red, grey } from '@material-ui/core/colors';
import { withStyles } from '@material-ui/core/styles';

import './styles.css';

/* STYLES FOR MATERIAL UI FORM ELEMENTS */
const useStyles = makeStyles((theme) => ({
  rootItem: {
    width: '100%',
    marginTop: '3px'
  },
  heading: {
    flexBasis: '70%',
    flexShrink: 0,
    fontFamily: 'Avenir',
    fontSize: '16px'
  },
  secondaryHeading: {
    color: '#b3b3b3',
    fontFamily: 'Avenir',
    fontSize: '14px',
    textAlign: 'right'
  },
  dropdown: {
    fontFamily: 'Avenir',
    backgroundColor: '#424242',
    color: '#ffffff',
    display: 'flex',
    flexDirection: 'column',
    fontSize: '16px'
  },
  topPanel: {
    fontFamily: 'Avenir',
    backgroundColor: '#424242',
    color: '#ffffff'
  },
  svgDropdown: {
    color: '#ffffff'
  },
  radio: {
    '&$checked': {
      color: '#4B8DF8'
    }
  },
  checked: {}
}));

const GreenRadio = withStyles({
  root: {
    color: green[ 400 ],
    '&$checked': {
      color: green[ 600 ],
    },
  },
  checked: {},
})((props) => <Radio color="default" {...props} />);

const RedRadio = withStyles({
  root: {
    color: red[ 400 ],
    '&$checked': {
      color: red[ 600 ],
    },
  },
  checked: {},
})((props) => <Radio color="default" {...props} />);

const OtherRadio = withStyles({
  root: {
    color: grey[ 400 ],
    '&$checked': {
      color: grey[ 600 ],
    },
  },
  checked: {},
})((props) => <Radio color="default" {...props} />);

function Item ({ element, handleExpansion, expanded, handleItemDelete }) {

  const [ nouns, setNouns ] = useState(null);
  const [ verbs, setVerbs ] = useState(null);
  const [ adj, setAdjectives ] = useState(null);

  const [ posEntities, setPos ] = useState(null);
  const [ negEntities, setNeg ] = useState(null);

  const [ text, setText ] = useState(null);
  const [ textShort, setTextShort ] = useState(null);

  const [ filterWords, setFilterWords ] = useState('default_none');
  const [ highlighter, sethighlighter ] = useState('');

  const [ filterWordsDefault, setDefault ] = useState([ 'default_none' ]);

  useEffect(() => {
    setNouns(element.partOfSpeech.NOUN);
    setVerbs(element.partOfSpeech.VERB);
    setAdjectives(element.partOfSpeech.ADJ);
    setPos(element.entitySentiment.posEntityList);
    setNeg(element.entitySentiment.negEntityList);
    setText(element.text);
    setTextShort(element.text.split(' ').slice(0, 5).join(' ') + '...');
    setFilterWords(filterWordsDefault);
    sethighlighter('none')
  }, []);

  function handlePOSSelection ({ target }) {
    if (target.value === "NOUNS") {
      setFilterWords(nouns);
      sethighlighter('nouns');
    } else if (target.value === "VERBS") {
      setFilterWords(verbs);
      sethighlighter('verbs')
    } else if (target.value === "ADJ") {
      setFilterWords(adj);
      sethighlighter('adj')
    } else if (target.value === "NONE") {
      setFilterWords(filterWordsDefault);
      sethighlighter('none')
    } else if (target.value === "POSITIVE") {
      setFilterWords(posEntities);
      sethighlighter('pos')
    } else if (target.value === "NEGATIVE") {
      setFilterWords(negEntities);
      sethighlighter('neg')
    }
    return;
  }


  const classes = useStyles();

  return (
    <div className={classes.rootItem}>
      <ExpansionPanel expanded={expanded === element.timeKey} onChange={handleExpansion(element.timeKey)}>
        <ExpansionPanelSummary
          className={classes.topPanel}
          expandIcon={<ExpandMoreIcon className={classes.svgDropdown} />}
          aria-controls="panel1bh-content"
          id="panel1bh-header">
          <Typography className={classes.heading}>{textShort}</Typography>
          <Typography className={classes.secondaryHeading}>Sentiment score: {element.docSentiment.score} | Magnitude: {element.docSentiment.magnitude}</Typography>

        </ExpansionPanelSummary>
        <ExpansionPanelDetails className={classes.dropdown}>
          <Typography>

            {(text !== null) ?
              <Highlighter
                highlightClassName={highlighter}
                searchWords={filterWords}
                autoEscape={true}
                textToHighlight={text}
              />
              : <Highlighter
                highlightClassName={highlighter}
                searchWords={[ 'none' ]}
                autoEscape={true}
                textToHighlight={'default'}
              />
            }

          </Typography>


          <div className="interactive_buttons">

            <FormControl component="fieldset">
              <RadioGroup row aria-label="pos" name="pos1" onChange={handlePOSSelection}>
                <label>
                  <OtherRadio value="NONE" labelPlacement="start" checked={highlighter === 'none'} />
                  None
                </label>
                <label>
                  <OtherRadio value="NOUNS" labelPlacement="start" checked={highlighter === 'nouns'} />
                  Nouns
                </label>
                <label>
                  <OtherRadio value="VERBS" labelPlacement="start" checked={highlighter === 'verbs'} />
                  Verbs
                </label>
                <label>
                  <OtherRadio value="ADJ" labelPlacement="start" checked={highlighter === 'adj'} />
                  Adjectives
                </label>
                <label>
                  <GreenRadio value="POSITIVE" labelPlacement="start" checked={highlighter === 'pos'} />
                  Positive entities
                </label>
                <label>
                  <RedRadio value="NEGATIVE" labelPlacement="start" checked={highlighter === 'neg'} />
                  Negative entities
                </label>
              </RadioGroup>
            </FormControl>

            <IconButton aria-label="delete" onClick={() => handleItemDelete(element.timeKey)}>
              <DeleteIcon />
            </IconButton>
          </div>

        </ExpansionPanelDetails>
      </ExpansionPanel>
    </div>
  );
}

export default Item;


