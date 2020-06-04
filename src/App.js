import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/icons/Send';

import AnalysedList from './components/AnalysedList/list';
import ApiClient from './services/google-api-client';
import { getFromStorage, setStorage } from './utilities/localStorage';

import './App.css';

/* STYLES FOR MATERIAL UI FORM ELEMENTS */
const useStyles = makeStyles((theme) => ({
  rootItem: {
    '& .MuiTextField-root': {
      backgroundColor: '#4f4f4f',
      fontFamily: 'Avenir',
    },
    '& .MuiFormLabel-root': {
      color: '#a3a3a3',
      fontFamily: 'Avenir',
      marginLeft: '10px',
      marginTop: '5px',
      textTransform: 'uppercase',
      fontSize: '16px',
      fontWeight: '500'
    },
    '& .MuiFormHelperText-root': {
      color: '#a3a3a3',
      fontFamily: 'Avenir',
      marginLeft: '10px',
      fontSize: '12px'
    }
  },
  button: {
    textTransform: 'uppercase',
    fontSize: '15px',
    fontWeight: '600'
  },
  multilineColor: {
    width: '98%',
    alignSelf: 'center',
    color: 'white',
    fontFamily: 'Avenir',
    fontSize: '14px'
  }
}));


function App () {

  const [ text, setText ] = useState('');
  const [ analysis, setSentimentAnalysis ] = useState([]);

  useEffect(() => {
    /* LOAD FROM LOCAL BROWSER IF AVAILABLE */
    const ana_ = getFromStorage('analysis');
    if (ana_ !== null) {
      setSentimentAnalysis(ana_);
    }
  }, [])

  function callAnalysisService (text) {
    ApiClient.getSentiment(text)
      .then(res => {
        if (res === null || res === undefined) {
          return alert('ERROR : API response not operating correctly. Check APIKey and Response Headers')
        }

        const posTemp = {};
        res.tokens.forEach((wrd) => {
          let speechTag = wrd.partOfSpeech.tag;
          if (posTemp[ speechTag ]) {
            posTemp[ speechTag ].push(wrd.lemma);
          } else {
            posTemp[ speechTag ] = [ wrd.lemma ];
          }
        })

        const entitySentiment = [], entityPos = [], entityNeg = [];
        res.entities.forEach((entity) => {
          entitySentiment.push(
            {
              entity: entity.name,
              salience: entity.salience,
              sentiment: entity.sentiment.score,
              magnitude: entity.sentiment.magnitude,
              sentimentDir: (entity.sentiment.score > 0) ? 'pos' : (entity.sentiment.score === 0 ? 'neu' : 'neg')
            }
          )
          if (entity.sentiment.score > 0 && (!entityPos.includes(entity.name))) {
            entityPos.push(entity.name)
          }
          if (entity.sentiment.score < 0 && (!entityNeg.includes(entity.name))) {
            entityNeg.push(entity.name)
          }
        })
        const dataObj = [ ...analysis, {
          timeKey: Date.now(),
          partOfSpeech: posTemp,
          entitySentiment: {
            posEntityList: entityPos,
            negEntityList: entityNeg,
            detailed: entitySentiment
          },
          docSentiment: { magnitude: res.documentSentiment.magnitude, score: res.documentSentiment.score },
          text: text
        } ];

        setSentimentAnalysis(dataObj);
        setStorage(JSON.stringify(dataObj), 'analysis');
      })
      .then(() => setText(''));
  }

  function handleSubmit (event) {
    event.preventDefault();
    if (text.length < 10) {
      return;
    } else if (text.length < 50) {
      alert('ERROR: Input text must be atleast 50 characters.')
      return;
    }
    callAnalysisService(text);
  }

  function handleChange ({ target }) {
    setText(target.value);
  }

  function handleItemDelete (itemKey) {
    const removedItem = analysis.filter(item => item.timeKey !== itemKey);
    setSentimentAnalysis(removedItem);
    setStorage(JSON.stringify(removedItem), 'analysis');
  }

  const classes = useStyles();

  return (
    <div className="app">

      <div className='app_inputs'>
        <form className={classes.rootItem} onClick={handleSubmit} autoComplete="off">
          <TextField
            id="standard-multiline-static"
            label="Add your text"
            multiline
            rows={5}
            color="secondary"
            name="input_text"
            value={text}
            onChange={handleChange}
            helperText="Type or copy a paragraph of text above and press the analyse button."
            InputProps={{
              className: classes.multilineColor
            }}
            fullWidth
          />
          <p>
            <Button
              className={classes.button}
              type="submit"
              variant="contained"
              color="secondary"
              endIcon={<Icon>Analyse</Icon>}>
              Analyse
            </Button>
          </p>
        </form>
      </div>
      <AnalysedList analysis={analysis} handleItemDelete={handleItemDelete} />
    </div>
  );
}

export default App;
