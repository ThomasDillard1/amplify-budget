import { Button, Flex, Icon, Text, View } from "@aws-amplify/ui-react";
// Expenses Model
import { createExpense, updateExpense, deleteExpense } from './graphql/mutations';
import { listExpenses } from './graphql/queries';
import { ExpenseCreateForm, ExpenseUpdateForm } from './ui-components';

// GraphQL API
import { generateClient } from 'aws-amplify/api';

import { useEffect, useState } from 'react';
//MUI Icons
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import FilterListIcon from '@mui/icons-material/FilterList';
import SortIcon from '@mui/icons-material/Sort';

import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';


// To connect with the GraphQL api
const client = generateClient();

export default function ExpenseComponent() {
    const [items, setItems] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [isCreateExpenseModalOpen, setCreateExpenseModalOpen] = useState(false);
    const [isUpdateExpenseModalOpen, setUpdateExpenseModalOpen] = useState(false);
    const [updateExpenseId, setUpdateExpenseId] = useState(null);

    useEffect(() => {  
      displayExpenses();
    }, []);

    // Read expenses
    async function displayExpenses(){
      const expenses = await client.graphql({query:listExpenses});
      console.log(expenses);
      setItems(expenses.data.listExpenses.items);
    }

    // Create expense modal - <ExpenseCreateForm />
    const openCreateExpenseModal = () => {
      setCreateExpenseModalOpen(true);
    }

    const closeCreateExpenseModal = () => {
      setCreateExpenseModalOpen(false);
    }

    // Delete expense
    async function deleteExpenseItem(id) {
      try {
        await client.graphql({
          query: deleteExpense,
          variables: {
            input: { id },
          },
        });
        displayExpenses();
      } catch (e) {
        console.log(e);
      }
    }

    //Update expense modal - <ExpenseUpdateForm />
    const openUpdateExpenseModal = () => {
      setUpdateExpenseModalOpen(true);
    }

    const closeUpdateExpenseModal = () => {
      setUpdateExpenseModalOpen(false);
    }

    // Sorting functions
    const handleSort = (key) => {
      let direction = 'asc';
      if (sortConfig.key === key && sortConfig.direction === 'asc') {
        direction = 'desc';
      }
      setSortConfig({ key, direction });
    };
  
    const sortedItems = [...items].sort((a, b) => {
      if (sortConfig.direction === 'asc') {
        return a[sortConfig.key] > b[sortConfig.key] ? 1 : -1;
      } else {
        return a[sortConfig.key] < b[sortConfig.key] ? 1 : -1;
      }
    });

    /*
        <h1>Expenses</h1>
        <Button
          size="small"
          variation="primary"
          onClick={() => {
            openCreateExpenseModal();
          }}
        >Create Expense</Button>
    */

    const underlineStyle = {
      textDecoration: 'underline',
      textUnderlineOffset: '.4em'
    };

    const modalTitle = {
      justifyContent: 'center',
      alignItems: 'center',
      padding: '10px 0px 0px 0px'
    }

    const thStyle = { display: 'flex', alignItems: 'center' }

    return (
        <>        
    <View
      width="540px"
      margin="00px 0px 0px 0px" //top, right, bottom, left
      boxShadow="0px 4px 6px rgba(0.05098039284348488, 0.10196078568696976, 0.14901961386203766, 0.05000000074505806)"
      borderRadius="8px"
      backgroundColor="white"
    >
    <Flex
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        padding="10px 25px 10px 15px" //top, right, bottom, left
      >
        <Flex direction="row" alignItems="center">
          <Text
          fontSize="xl" 
          fontWeight="bold" 
          style={underlineStyle}
          >
            Expenses
          </Text>
          {/* Optional: You can add some space between the title and button */}
          {/* <div style={{ marginLeft: '8px' }}></div> */}
        </Flex>
        <Button
          size="small"
          variation="primary"
          onClick={() => {
            openCreateExpenseModal();
          }}
        >
          Create Expense
        </Button>
      </Flex>

      <Flex
        direction="column"
        padding="10px 0px 10px 10px"
      >
      <table>
        <thead>
          <tr>
            <th> <div style={thStyle} onClick={() => handleSort('category')}>Category<SortIcon fontSize="small" /></div></th>
            <th> <div style={thStyle} onClick={() => handleSort('description')}>Description<SortIcon fontSize="small" /></div></th>
            <th> <div style={thStyle} onClick={() => handleSort('amount')}>Amount<SortIcon fontSize="small" /></div></th>
            <th> <div style={thStyle} onClick={() => handleSort('date')}>Date<SortIcon fontSize="small" /></div></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {sortedItems.map((item, index) => (
            <tr key={index}>
              <td>{item.category}</td>
              <td>{item.description}</td>
              <td>${item.amount}</td>
              <td>{item.date}</td>
              <td>
                <DeleteIcon 
                sx={{ color:  'hsl(0, 50%, 50%)', cursor: 'pointer' }}
                onClick={() => {
                  deleteExpenseItem(item.id);
                }}
              />
              <EditIcon
                sx={{ color: 'hsl(190, 50%, 50%)', cursor: 'pointer'}}
                onClick={() => {
                  setUpdateExpenseId(item.id);
                  openUpdateExpenseModal();
                }}
              />

              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </Flex>
      </View>


        {/*Create Expense Modal */}
        <Dialog fullWidth={true} open={isCreateExpenseModalOpen} onClose={closeCreateExpenseModal}>
          <Flex style={modalTitle}>
            <DialogTitle>Create Expense</DialogTitle>
          </Flex>
          <DialogContent>
            <ExpenseCreateForm onSuccess={() => {
              closeCreateExpenseModal();
              displayExpenses();
              }}/>
          </DialogContent>
        </Dialog>

        {/*Update Expense Modal */}
        <Dialog fullWidth={true} open={isUpdateExpenseModalOpen} onClose={closeUpdateExpenseModal}>
          <Flex style={modalTitle}>
              <DialogTitle>Edit Expense</DialogTitle>
          </Flex>
          <DialogContent>
            <ExpenseUpdateForm id={updateExpenseId} onSuccess={() => {
              closeUpdateExpenseModal();
              displayExpenses();
              }}/>
          </DialogContent>
        </Dialog>
        </>
    );
}