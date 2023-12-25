import { Button, Flex, Icon, Text, View } from "@aws-amplify/ui-react";
import { CategoryTimeDropdown } from "./CategoryTimeDropdown";
// Expenses Model
import { listExpenses } from './graphql/queries';
import { useEffect, useState } from 'react';

// GraphQL API
import { generateClient } from 'aws-amplify/api';

// To connect with the GraphQL api
const client = generateClient();

export default function CategoryComponent(){
    const [selectedTimePeriod, setSelectedTimePeriod] = useState('Total');
    const handleTimePeriodChange = (selectedPeriod) => {
        //display the pie chart based on the change in the time period selection
        setSelectedTimePeriod(selectedPeriod);

    }

    const underlineStyle = {
        textDecoration: 'underline',
        textUnderlineOffset: '.4em'
    };    
    return (
        <>        
    <View
      width="540px"
      margin="50px 0px 0px 50px"
      boxShadow="0px 4px 6px rgba(0.05098039284348488, 0.10196078568696976, 0.14901961386203766, 0.05000000074505806)"
      borderRadius="8px"
      backgroundColor="white"
    >
    <Flex
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        padding="10px 25px 10px 15px" //top, right, bottom, left
        borderBottom="1px solid #ccc" // You can customize the border style
      >
        <Flex direction="row" alignItems="center">
          <Text
          fontSize="xl" 
          fontWeight="bold" 
          style={underlineStyle}
          >
            Category Breakdown
          </Text>
        </Flex>
        <CategoryTimeDropdown onTimePeriodChange={handleTimePeriodChange}/>
        {/* This will be the dropdown component */}
      </Flex>

      <Flex
        direction="column"
        padding="10px 0px 10px 10px"
      >
        <Text>{selectedTimePeriod}</Text>
      </Flex>
      </View>
        </>
    );


}