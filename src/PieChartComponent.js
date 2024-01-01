import { Button, Flex, Icon, Text, View } from "@aws-amplify/ui-react";
import { listExpenses } from './graphql/queries';
import { useEffect, useState, useRef } from 'react';
import { generateClient } from 'aws-amplify/api';
import Chart from 'chart.js/auto'
import { Pie } from 'react-chartjs-2';

export const PieChartComponent  = ({selectedTimePeriod}) => {
    const [titleDisplay, setTitleDisplay] = useState(`Spending in the last ${selectedTimePeriod}`);
    const [totalAmount, setTotalAmount] = useState(0);
    const [pieChartOptions, setPieChartOptions] = useState({
        plugins: {
            title: {
                display: true,
                text: `Spending in the last ${selectedTimePeriod}`
            },
            legend: {
                position: 'bottom'
            },
        }
    })

    const [pieChartData, setPieChartData] = useState({
        labels: [],
        datasets: [
          {
            data: [],
            backgroundColor: [],
          },
        ],
    });
    // Pie Chart Variables
    const chartRef = useRef(null);

    // Connect with GraphQL API
    const client = generateClient();

    useEffect(() => {
        displayPieChart(selectedTimePeriod);
    }, [selectedTimePeriod])



    //On the page load, call useEffect to displayPieChart(selectedTimePeriod)
    //Everytime selectedTimePeriod changes, then the piechart will display
    // In displayPieChart:
    // 1) get the expenses sorted by the time period DONE
    // 2) get those expenses grouped by their category
    // 3) display them in the pie chart

    // Read expenses
    async function getExpenses(selectedTimePeriod){
        let total = 0;
        if(selectedTimePeriod === "Total"){
            const expenses = await client.graphql({query:listExpenses});
            total = expenses.data.listExpenses.items.reduce((accumulator, item) => accumulator + item.amount, 0);
            setTotalAmount(total);
            console.log(expenses)
            return expenses.data.listExpenses.items;
        }
        // Filter by the selectedTimePeriod
        const filter = await getFilter(selectedTimePeriod);
        const expenses = await getExpensesFilteredByTime(filter);
        total = expenses.data.listExpenses.items.reduce((accumulator, item) => accumulator + item.amount, 0);
        setTotalAmount(total);
        return expenses.data.listExpenses.items;
    }

    async function getFilter(selectedTimePeriod){
        let filter = 0;
        if(selectedTimePeriod === "3 months"){
            filter = 3;
        }
        if(selectedTimePeriod === "6 months"){
            filter = 6;
        }
        if(selectedTimePeriod === "12 months"){
            filter = 12;
        }
        return filter;
    }

    // Filter with GraphQL backend
    async function getExpensesFilteredByTime(months){
        const monthsAgo = new Date();
        monthsAgo.setMonth(monthsAgo.getMonth() - months);
        const formattedDate = monthsAgo.toISOString().split('T')[0];

        const expenses = await client.graphql({
            query: listExpenses,
            variables: {
                filter: {
                    date: {
                        ge: formattedDate
                    }
                }
            }});
        return expenses;
    }

    async function getExpensesGroupedByCategory(selectedTimePeriod){
        try {
        const expenses = await getExpenses(selectedTimePeriod);
        const groupedExpenses = expenses.reduce((result, item) => {
            const category = item.category;
            if (!result[category]) {
              result[category] = [];
            }
            result[category].push(item);
            return result;
          }, {});
          console.log(groupedExpenses);
          return groupedExpenses;
        } catch (e) {
            console.error("Error fetching expenses", e)
        }
    }

    async function displayPieChart(selectedTimePeriod){
        // {Category: [expense1, expense2], Category: [expense1, expense2, expense3]}
        const expensesByCategory = await getExpensesGroupedByCategory(selectedTimePeriod);

        const pieChartData = {
            labels: [],
            datasets: [{
                data: [],
                backgroundColor: getChartColors(Object.keys(expensesByCategory).length),
            }],
        };

        for (const category in expensesByCategory) {
            const totalExpense = expensesByCategory[category].reduce((total, expense) => total + expense.amount, 0);
            pieChartData.labels.push(category);
            pieChartData.datasets[0].data.push(totalExpense);
        }

        let titleDisplay = `Spending in the last ${selectedTimePeriod}`
        if(selectedTimePeriod === "Total"){
            titleDisplay = "Total Spending"
        }
        setTitleDisplay(titleDisplay);
        const pieChartOptions = {
            plugins: {
                title: {
                    display: false,
                    text: titleDisplay + ": $" + totalAmount
                },
                legend: {
                    position: 'bottom'
                },
            
            }
        }

        setPieChartData(pieChartData);
        setPieChartOptions(pieChartOptions);
    }

    function getChartColors(numColors) {
        // Function to generate random colors for the chart
        const colors = [];
        for (let i = 0; i < numColors; i++) {
            colors.push(getRandomColor());
        }
        return colors;
    }

    function getRandomColor() {
        // Function to generate a random hex color
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }


    const underlineStyle = {
        textDecoration: 'underline',
        textUnderlineOffset: '.4em'
      };
    return (
        <View>
            <Text textAlign="center" style={{fontWeight: 'bold', fontSize: 'medium'}}>
                {titleDisplay}:<Text style={{ ...underlineStyle, display: 'inline' }}> ${totalAmount}</Text>
            </Text>
            <View
        padding="10px 15px 10px 15px" // top, right, bottom, left
        height="345px" // 540px is the full 100%
      >
        <Flex
          direction="column"
          justifyContent="center"
          alignItems="center"
          height="100%" // Set the height to 100% to take the full height of the parent
        >
          <Pie
            data={pieChartData}
            options={pieChartOptions}
          />
        </Flex>
      </View>   

            
        </View>
    );
}