import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Stack,
  useColorModeValue,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { color } from "framer-motion";

function AddTranjection({ accId, fetchSignleAcc }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [text, setText] = useState("");
  const [amount, setAmount] = useState();
  const [transfer, setTransfer] = useState("");
  const [category, setCategory] = useState("");
  const [catlist, setCatlist] = useState();
  const toast = useToast();
  const handleCreateTrans = () => {
    const user = localStorage.getItem("userInfo");
    const { token } = JSON.parse(user);
    const options = {
      method: "POST",
      url: `https://expenss-api-sample.onrender.com/addTransaction/${accId}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        text: text,
        amount: amount,
        transfer: transfer,
        category: category,
      },
    };
    axios
      .request(options)
      .then((response) => {
        fetchSignleAcc();
        if (response.status == 201) {
          fetchSignleAcc();
          toast({
            title: "Transaction created successfully",
            status: "success",
            duration: 1000,
            isClosable: true,
          });
          onClose();
        }
      })
      .catch((error) => {
        console.log(error);
        toast({
          title: `${error.response.data.message}`,
          status: "error",
          duration: 1000,
        });
      });
  };

  useEffect(() => {
    axios
      .get(`https://expenss-api-sample.onrender.com/category`)
      .then((res) => {
        setCatlist(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <>
      <Button backgroundColor={useColorModeValue("#0dff6e", "#1B1B1B")} _hover={{
        backgroundColor: useColorModeValue("#00c24e", "#00e85d"),
        color: useColorModeValue("black", "black")
      }} onClick={onOpen}>
        {" "}
        + new transaction
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create new Transaction</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack direction={"column"}>
              <FormControl isRequired>
                <FormLabel>transaction text</FormLabel>
                <Input
                  required
                  placeholder="enter transaction text"
                  onChange={(e) => setText(e.target.value)}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Amount</FormLabel>
                <Input
                  required
                  placeholder="enter amount in digit"
                  onChange={(e) => setAmount(e.target.value)}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>transfer</FormLabel>
                <Input
                  placeholder="enter name where tranfer"
                  onChange={(e) => setTransfer(e.target.value)}
                  required
                />
              </FormControl>
              <FormControl isRequired>
              <FormLabel>category</FormLabel>

                <Select
                  placeholder="category"
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {catlist &&
                    catlist.map((v) => {
                      return <option value={v.id}>{v.name}</option>;
                    })}
                </Select>
              </FormControl>
            </Stack>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button onClick={handleCreateTrans}>Create</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default AddTranjection;
