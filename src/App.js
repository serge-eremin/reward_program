import './App.css'
import { useEffect, useState } from 'react'

function getData() {
  return Promise.resolve([
    { customerId: 10, name: 'Ann', amount: 150, date: '07-12-2022' },
    { customerId: 11, name: 'Pete', amount: 90, date: '07-10-2022' },
    { customerId: 10, name: 'Ann', amount: 8, date: '06-12-2022' },
    { customerId: 10, name: 'Ann', amount: 395, date: '06-10-2022' },
    { customerId: 11, name: 'Pete', amount: 150, date: '05-22-2022' },
    { customerId: 10, name: 'Ann', amount: 70, date: '05-10-2022' },
  ])
}

function App() {
  const [customerData, setCustomerData] = useState(null)

  useEffect(() => {
    getData().then(res => {
      setCustomerData(res)
    }).catch(err => console.log(err))
  }, [])

  const customerPoints = (price) => {
    if (price >= 50 && price < 100) {
      return price - 50
    } else if (price > 100) {
      return (2 * (price - 100) + 50)
    }
    return 0
  }

  const getCustomerRewards = () => {
    const result = customerData?.map(item => {
      const points = customerPoints(item.amount)
      const timeDate = new Date(item.date).getTime()
      return { ...item, points, timeDate }
    })
    return result
  }

  const list = getCustomerRewards()

  const getLast3MonthsList = () => {
    const today = new Date()
    const threeMonthsBefore = today.setMonth(today.getMonth() - 3)
    const filteredList = list?.filter(trans => trans.timeDate > threeMonthsBefore)
    const filtered = filteredList?.sort((a, b) => b.timeDate - a.timeDate)
    return filtered
  }

  const last3MonthsList = getLast3MonthsList()

  const getTotalRewards = () => {
    return last3MonthsList?.length ? last3MonthsList?.reduce((accum, curr) => curr.points + accum, 0) : 0
  }
  const total = getTotalRewards()

  const groupByName = (list, name) => {
    return list.reduce((accum, current) => {
      const key = current[name]
      accum[key] ??= []
      accum[key].push(current)
      return accum
    }, {})
  }

  const rewardPointsByName = groupByName(last3MonthsList ? last3MonthsList : [], 'name')
  console.log('rewardPointsByName', rewardPointsByName)

  const getRewardPerMonth = (arr) => {
    const last3MonthRewardsInDesc = []
    for (let i = 0; i < 3; i++) {
      const filteredList = arr?.filter(trans => new Date(trans.timeDate).getMonth() === (new Date).getMonth() - i)
      last3MonthRewardsInDesc[i] = filteredList?.reduce((accum, curr) => accum + curr.points, 0)
    }
    return last3MonthRewardsInDesc
  }

  const getByCustomerByMonth = () => {
    const array = []
    for (let key in rewardPointsByName) {
      const arr = rewardPointsByName[key]
      array.push(
        { name: key, arr: getRewardPerMonth(arr) }
      )
    }
    return array
  }
  const customerByMonth = getByCustomerByMonth()


  return (
    <div className="App">
      <header className="App-header">
        {customerByMonth?.map((item) =>
          <div key={item.name} style={{ display: 'flex', flexDirection: 'row' }}>
            {item.name}
            {item?.arr.map((points, index) =>
              <div key={index}>
                - {points}
              </div>
            )}
          </div>
        )}
        ---------------- <br/>
        Total: {total}
      </header>
    </div>
  )
}

export default App
