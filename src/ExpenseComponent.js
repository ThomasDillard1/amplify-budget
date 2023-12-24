import { Button, Flex, Icon, Text, View } from "@aws-amplify/ui-react";
// Expenses Model
import { createExpense, updateExpense, deleteExpense } from './graphql/mutations';
import { listExpenses } from './graphql/queries';
import {
  ExpenseCreateForm 
 } from './ui-components';

// GraphQL API
import { generateClient } from 'aws-amplify/api';

import { useEffect, useState } from 'react';
//MUI Icons
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
//import DialogTitle from '@mui/material/DialogTitle';
//import Dialog from '@mui/material/Dialog';
// To connect with the GraphQL api
const client = generateClient();

export default function ExpenseComponent() {
    const [items, setItems] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [isCreateExpenseModalOpen, setCreateExpenseModalOpen] = useState(false);

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

    //Update expense
    async function editExpenseItem(id) {
      try {
        await client.graphql({
          query: updateExpense,
          variables: {
            input: {
              id : id,
              amount: 100.00,        // Replace with the actual amount
              category: 'Furniture', // Replace with the actual category
              description: 'Leather couch',
              date: '2023-03-01'     // Replace with the actual date
            }}
        })
        displayExpenses();
      } catch (e) {
        console.log(e);
      }
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

    return (
        <>        
        <h1>Expenses</h1>
        <Button
          size="small"
          variation="primary"
          onClick={() => {
            openCreateExpenseModal();
          }}
        >Create Expense</Button>

        {/*Create Expense Modal */}
        <Dialog fullWidth={true} open={isCreateExpenseModalOpen} onClose={closeCreateExpenseModal}>
          <DialogTitle>Create Expense</DialogTitle>
          <DialogContent>
            <ExpenseCreateForm onSuccess={() => {
              closeCreateExpenseModal();
              displayExpenses();
              }}/>
          </DialogContent>
        </Dialog>

      <table>
        <thead>
          <tr>
            <th onClick={() => handleSort('category')}>Category</th>
            <th onClick={() => handleSort('description')}>Description</th>
            <th onClick={() => handleSort('amount')}>Amount</th>
            <th onClick={() => handleSort('date')}>Date</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {sortedItems.map((item, index) => (
            <tr key={index}>
              <td>{item.category}</td>
              <td>{item.description}</td>
              <td>{item.amount}</td>
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
                  editExpenseItem(item.id);
                }}
              />

              </td>
            </tr>
          ))}
        </tbody>
      </table>
        </>
    );
}