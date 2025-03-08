import { useState } from 'react'

const Button = (props) => {
  return (
    <button onClick={props.onClick}>
      {props.text}
    </button>
  )
}

const Statistics = (props) => {
  if (props.total === 0) {
    return (
      <div>
        No feedback given
      </div>
    )
  }
  return (
    <table>
      <tbody>
      <StatisticLine text='good' value={props.good}/>
      <StatisticLine text='neutral' value={props.neutral}/>
      <StatisticLine text='bad' value={props.bad}/>
      <StatisticLine text='total' value={props.total}/>
      <StatisticLine text='average' value={props.average}/>
      <StatisticLine text='percentage' value={props.percentage}/>
      </tbody>
    </table>
  )
} 

const StatisticLine = (props) => {
    return (
      <tr>
        <td>{props.text}</td> <td>{props.value}{props.text === 'percentage' ? '%' : ''}</td>
      </tr>
    )
}

const App = () => {

  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [total, setTotal] = useState(0)
  const [average, setAverage] = useState(0)
  const [percentage, setPercentage] = useState(0)

  const handleGood = () => {
    const updatedGood = good + 1
    setGood(updatedGood)
    const updatedTotal = total + 1
    setTotal(updatedTotal)
    setAverage(((updatedGood - bad) / updatedTotal).toFixed(1))
    setPercentage((updatedGood / updatedTotal * 100).toFixed(1))
  }

  const handleNeutral = () => {
    const updatedNeutral = neutral + 1
    setNeutral(updatedNeutral)
    const updatedTotal = total + 1
    setTotal(updatedTotal)
    setAverage(((good - bad) / updatedTotal).toFixed(1))
    setPercentage((good / updatedTotal * 100).toFixed(1)) 
  }

  const handleBad = () => {
    const updatedBad = bad + 1
    setBad(updatedBad)
    const updatedTotal = total + 1
    setTotal(updatedTotal)
    setAverage(((good - updatedBad) / updatedTotal).toFixed(1))
    setPercentage((good / updatedTotal * 100).toFixed(1))
  }


  return (
    <div>
      <h1>Give feedback</h1>
      <Button onClick={handleGood} text='good'/>
      <Button onClick={handleNeutral} text='neutral'/>
      <Button onClick={handleBad} text='bad'/>
      <h1>Statistics</h1>
      <Statistics good={good} neutral={neutral} bad={bad} total={total} average={average} percentage={percentage}/>
    </div>
  )
}

export default App
