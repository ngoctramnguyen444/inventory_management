'use client'
import Image from "next/image";
import { useState, useEffect } from "react";
import { firestore } from "@/firebase";
import { Box, Button, Modal, Stack, TextField, Typography } from "@mui/material";
import { collection, doc, deleteDoc, getDocs, query, getDoc, setDoc} from "firebase/firestore";

export default function Home() {
  const [inventory, setInventory] = useState([]);

  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      })
    });
    setInventory(inventoryList)
  }

  const addItem = async(item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await(getDoc(docRef));

    if (docSnap.exists()){
      const {quantity} = docSnap.data();
      await setDoc(docRef, {quantity: quantity+1}, {merge:true});
    }
    else {
      await setDoc(docRef, {quantity: 1})
    }
    
    await updateInventory();
  }


  const removeItem = async(item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await(getDoc(docRef))

    if (docSnap.exists()){
      const {quantity} = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } 
      else {
        await setDoc(docRef, {quantity: quantity-1});
      }
    }
    
    await updateInventory();
  }


  useEffect(() => {
    updateInventory()
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
      <Box 
        width="100vw" 
        height="100vh" 
        display="flex" 
        justifyContent="center" 
        alignItems="center"
        flexDirection="column"
        gap={3}
        padding={3}
        bgcolor="#D1E9F6"
      >
        <Typography variant="h1" color="#3C3D37" border="6px solid #3C3D37" padding={2} >INVENTORY TRACKER</Typography>
        <Typography variant="h4" color="#3C3D37" >Manage your stock with ease</Typography>

        <TextField
          label="Search Item"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          fullWidth
          style={{ margin: '20px 0', width: '800px' }}  
          InputProps={{
            style: {
              background: "#F6EACB"
            }
          }}
        />

        <Button
          variant="contained"
          onClick={handleOpen}
          style={{ marginTop: 2, background: "#EECAD5", color:"#000"}}
        >
          Add New Item
        </Button>
    
        <Modal open={open} onClose={handleClose}>
          <Box 
            position="absolute"
            top="50%"
            left="50%"
            width={400}
            bgcolor="#F6EACB"
            border="2px solid #000"
            boxShadow={24}
            p={4}
            display="flex"
            flexDirection="column"
            gap={3}
            sx={{transform: "translate(-50%,-50%)"}}
          >
            <Typography variant="h6">Add Item</Typography>
            <Stack width="100%" direction="row" spacing={2}>
              <TextField 
                variant="outlined"
                fullWidth
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
              />
              <Button variant="outlined" onClick={() => {
                addItem(itemName)
                setItemName('')
                handleClose()
              }}>Add</Button>
            </Stack>
          </Box>
        </Modal>
    
        <Box border="1px solid #3C3D37">
          <Box 
            width="800px" 
            height="100px" 
            bgcolor="#F6EACB" 
            display="flex" 
            alignItems="center" 
            justifyContent="center"
          >
            <Typography variant="h3">Inventory List</Typography>
          </Box>
          <Stack width="800px" height="300px" spacing={2} overflow="auto" bgcolor="#F6EACB">
            {inventory.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase())).map(({name, quantity}) => (
              <Box key={name}
                width="100%"
                minHeight="150px"
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                bgcolor="white"
                padding={4}
              >
                <Typography variant="h4" color="#3C3D37" textAlign="center">
                  {name.charAt(0).toUpperCase() + name.slice(1)}
                </Typography>
                <Typography variant="h4" color="#3C3D37" textAlign="center">
                  Count: {quantity}
                </Typography>
                <Stack direction="row" spacing={2}>
                  <Button variant="contained" style={{ marginTop: 2, background: "#EECAD5", color:"#000"}} onClick={() => addItem(name)}>Add</Button>
                  <Button variant="contained" style={{ marginTop: 2, background: "#EECAD5", color:"#000"}} onClick={() => removeItem(name)}>Remove</Button>
                </Stack>
              </Box>
            ))}
          </Stack>
        </Box>
      </Box>
    )
}
