import { useEffect, useState } from 'react'
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import moment from 'moment'
import './App.css'

function App() {
  const formatOptions = [
    'hh:mm',
    'HH:mm',
    'hh:mm:ss',
    'HH:mm:ss'
  ]
  const [format, setFormat] = useState('HH:mm')
  const [timezoneOptions, setTimezoneOptions] = useState([])
  const [timezone, setTimezone] = useState('America/Recife')
  const [datetime, setdatetime] = useState()
  const [loading, setLoading] = useState(true)

  // Get timezone options
  useEffect(() => {
    fetch('http://worldtimeapi.org/api/timezone')
      .then(res => res.json())
      .then(data => setTimezoneOptions(data))
  }, [])

  // Get datetime of timezone
  useEffect(() => {
    if (timezone) {
      fetch('http://worldtimeapi.org/api/timezone/' + timezone)
        .then(res => res.json())
        .then((data) => {
          setdatetime(data.datetime)
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(true)
    }
  }, [timezone])

  // Update datetime
  useEffect(() => {
    setInterval(() => {
      fetch('http://worldtimeapi.org/api/timezone/' + timezone)
      .then(res => res.json())
      .then((data) => {
        setdatetime(data.datetime)
      })
    }, 1000)
  }, [])

  return (
    <div className="App">
      <div id="configs">
        <Autocomplete
          disablePortal
          value={timezone}
          onChange={(event, newValue) => {
            setTimezone(newValue);
          }}
          isOptionEqualToValue={(option, value) => option === value}
          id="select-timezone"
          options={timezoneOptions}
          sx={{ width: 300 }}
          renderInput={(params) => <TextField {...params} label="Timezone" />}
        />

        <Autocomplete
          disablePortal
          value={format}
          onChange={(event, newValue) => {
            setFormat(newValue);
          }}
          id="select-format"
          options={formatOptions}
          sx={{ width: 300 }}
          renderInput={(params) => <TextField {...params} label="Formato" />}
        />
      </div>

      <div id="clock">
        {
          loading ? <CircularProgress /> : <h1>{moment(datetime).format(format)}</h1>
        }

      </div>

      <div id="theme">

      </div>
    </div>
  )
}

export default App
