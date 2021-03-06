/*
This is the container component for the entire application. It is rendered
in App.js. All children presentational components of the hierarchy will be
rendered from ExpensesApp.

This component is what connects React to Redux; therefore, the only passage that
the presentational components have to the state tree and to Redux is through
AsyncApp. All state changes are both dispatched and received by AsyncApp and
then passed down to all children presentational components.
*/

import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import ExpenseList from '../components/ExpenseList.js'
import Total from '../components/Total.js'
import Chart from '../components/Chart.js'
import Spin from '../components/Spin'
import DatePicker from '../components/DatePicker'

import '../css/expensesApp.css'

import { fetchExpenses, updateCategories, updateAccounts, updateDates, receiveExpenses } from '../actions/expensesActions'

export default class ExpensesApp extends Component {
  constructor(props){
    super(props)
    console.log('this.props in constructor in ExpensesApp', this.props);
    console.log('this.state in constructor in ExpensesApp', this.state);

    this.state = {
      total: 0,
    }
  }

  componentWillMount(){
    this.props.fetchExpenses()
    // this.props.receiveExpenses()
  }

  // componentDidMount() {
  //   console.log('ExpensesApp componentWillReceiveProps: ', this.props.startDate)
  //   this.props.startDate.setData(this.props.startDate);
  // }

  parseCategoriesForChart() {
    function filterByCategory(obj) {
      if ('category' in obj && typeof(obj.category) === 'string' && obj.category !== null) {
        return true;
      } else {
        return false;
      }
    }

    let dataSum = 0;
    let arrByCategory = this.props.expenses.filter(filterByCategory);
    let reduced = arrByCategory.reduce((p,c) => {
      if (c.category != 'Other') {
        p[c.category] ? p[c.category] += c.amount : p[c.category] = c.amount;
        dataSum += c.amount;
      }
      return p;
    }, {});

    let result = [];
    for (let key in reduced) {
      if (key != 'Other') {
        result.push({name: key, y: Math.round((reduced[key] / dataSum) * 100)});
      }
    };
    return result;
  }

  render(){
    var expenses = this.props.expenses;
    if (!expenses.length > 0) {
      return (
        <Spin/>
      )
    } else {
      return (
        <div className="expenseApp-container">
          <div className="expense-list-container">
            <ExpenseList
              expenses={expenses}
              updateCategories={this.props.updateCategories.bind(this)}
              updateAccounts={this.props.updateAccounts.bind(this)}
              total={this.props.total}
            />
          </div>

          <div className="chart-container">
            <Total
                total={this.props.total}
            />
            <Chart
              data={this.parseCategoriesForChart()}
            />
          </div>

        </div>
      )
    }
  }
}

ExpensesApp.PropTypes = {
  // Injected by Redux
  expenses: PropTypes.array.isRequired,
  total: PropTypes.number.isRequired,
  fetchExpenses: PropTypes.func.isRequired,
  allExpenses: PropTypes.array.isRequired,
  receiveExpenses: PropTypes.func.isRequired
}

/*
function that describes how to transform the current Redux store state into the
props you want to pass to a child presentational component you are wrapping
  @param = state object
  @return = object of transformed store state
*/
function mapStateToProps(state){
  console.log('ExpensesApp in mapStateToProps state is: ', state)
  const { expenses, isFetching, total, startDate, endDate, allExpenses } = state.expensesReducer
  console.log('Expenses in mapStateToProps in ExpensesApp: ', expenses );
  console.log('ExpensesApp mapStateToProps startDate is: ', startDate);
  console.log('ExpensesApp mapStateToProps endDate is: ', endDate);

  return {
    expenses: expenses,
    allExpenses: allExpenses,
    isFetching: isFetching,
    total: total,
    startDate: startDate,
    endDate: endDate,
  }
}

//function that connects React component to Redux store
export default connect(
  mapStateToProps,
  {
    fetchExpenses: fetchExpenses,
    updateCategories: updateCategories,
    updateAccounts: updateAccounts,
    updateDates: updateDates,
    receiveExpenses: receiveExpenses
  }
)(ExpensesApp)
