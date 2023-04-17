import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
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
  Stat,
  StatLabel,
  StatNumber,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import MainTemplate from "../components/maintemplate";
import { useRouter } from "next/router";
import {
  Testimonial,
  TestimonialContent,
  TestimonialHeading,
  TestimonialText,
} from "../homepage";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import AddTranjection from "../components/AddTranjection";
import UpdateTransactions from "../components/UpdateTrans";
import { dataState } from "../../../context";

const account = () => {
  const [shareList, setShareList] = useState();
  const [transData, setTransData] = useState();
  const [text, setText] = useState("");
  const [isShareModal, setIsShareModal] = useState(false);
  const [amount, setAmount] = useState();
  // const [isUpdatedTrans, setIsUpdatedTrans] = useState(false);
  const [transfer, setTransfer] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const {user}= dataState();
  const [sampleAccData, setSampleAccData] = useState();
  const [transId, setTransId] = useState();
  // const [updateTransData, setUpdateTransData] = useState({});
  const [intLoading, setIntLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();

  const { id } = router.query;


  const fetchAccData = () => {
    const user = localStorage.getItem("userInfo");
    const { token } = JSON.parse(user);
    const options = {
      method: "GET",
      url: `http://localhost:1337/editAccount/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    axios
      .request(options)
      .then((response) => {
        console.log(response.data.data);
        setSampleAccData(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }
  const fetchSignleAcc = () => {
    const user = localStorage.getItem("userInfo");
    const { token } = JSON.parse(user);
    const options = {
      method: "GET",
      url: `http://localhost:1337/viewTransaction/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    axios
      .request(options)
      .then((response) => {
        console.log(response.data);
        setTransData(response.data);
        setIntLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handleShareAcc = () => {
    setIsShareModal(true);
    onOpen();
    const user = localStorage.getItem("userInfo");
    const { token } = JSON.parse(user);
    const options = {
      method: "GET",
      url: `http://localhost:1337/share/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    axios
      .request(options)
      .then((response) => {
        console.log(response);
        setShareList(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handleShareToUser = () => {
    console.log("email to send---> ", email);
    const user = localStorage.getItem("userInfo");
    const { token } = JSON.parse(user);
    const options = {
      method: "POST",
      url: `http://localhost:1337/account/share/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        email: email,
      },
    };
    axios
      .request(options)
      .then((response) => {
        console.log(response);
        if (response.status == 200) {
          onClose();
          fetchSignleAcc();
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const deleteTrans = (tId) => {
    const user = localStorage.getItem("userInfo");
    const { token } = JSON.parse(user);
    const options = {
      method: "DELETE",
      url: `http://localhost:1337/rmTransaction/${tId}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    axios
      .request(options)
      .then((response) => {
        if (response.status == 200) {
          fetchSignleAcc();
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    fetchSignleAcc();
    fetchAccData();
  }, []);

  return intLoading == true ? (
    <p>...loading</p>
  ) : (
    <MainTemplate>
      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />

        <ModalContent>
          <ModalHeader textTransform={"capitalize"}>
            {isShareModal == true
              ? "Share to following user"
              : "add transactions"}
          </ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            {loading == false && (
              <Select
                placeholder="select user to share account"
                size="md"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              >
                {shareList.users.map((user) => (
                  <option value={user.email}>{user.name}</option>
                ))}
              </Select>
            )}
          </ModalBody>
          <ModalFooter>
            <Stack direction={"row"}>
              <Button onClick={onClose}>Close</Button>
              <Button onClick={handleShareToUser}>Share</Button>
            </Stack>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Flex p={4} direction={"column"} gap={5}>
        <Stack
          direction={"row"}
          w={"100%"}
          alignItems={"center"}
          justifyContent={"space-between"}
        > 
        {console.log(sampleAccData.owner == user.user.id)}
          {sampleAccData.owner == user.user.id && (
            <Button onClick={handleShareAcc} colorScheme="blackAlpha">
              Share Account
            </Button>
          )}
          <AddTranjection accId={id} fetchSignleAcc={fetchSignleAcc} />
        </Stack>
        <Stack direction={"row"} my={3} justifyContent={"space-evenly"}>
          <Testimonial>
            <TestimonialContent>
              <Heading textAlign="center" size={"lg"} color={"green"}>
                {transData.income}
              </Heading>
              <TestimonialText>Income</TestimonialText>
            </TestimonialContent>
          </Testimonial>
          <Testimonial>
            <TestimonialContent>
              <Heading textAlign="center" size={"lg"} color={"red"}>
                {transData.expenses}
              </Heading>
              <TestimonialText>Expense</TestimonialText>
            </TestimonialContent>
          </Testimonial>
        </Stack>

        <TableContainer my={2}>
          <Heading size={"lg"} my={2}>
            Recent transactions
          </Heading>
          <Table variant="striped" textAlign={"center"}>
            <Thead>
              <Tr>
                <Th>#</Th>
                <Th>Text</Th>
                <Th>Transfer</Th>
                <Th>category</Th>
                <Th isNumeric>Amount</Th>
                <Th width={"-moz-fit-content"} colSpan={2} textAlign={"center"}>
                  Action
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {transData.data.length > 0 ? (
                transData.data.map((trans, i) => {
                  return (
                    <Tr key={trans.id}>
                      <Td>{i + 1}</Td>
                      <Td>{trans.text}</Td>
                      <Td>{trans.transfer}</Td>
                      <Td>{trans.category}</Td>
                      <Td color={trans.amount < 0 ? "red" : "green"}>
                        {trans.amount}
                      </Td>
                      <Td width={"-moz-fit-content"}>
                        <UpdateTransactions
                          transId={trans.id}
                          fetchSignleAcc={fetchSignleAcc}
                        />
                      </Td>
                      <Td width={"-moz-fit-content"}>
                        <DeleteIcon
                          onClick={() => deleteTrans(trans.id)}
                          color={"red.400"}
                        />
                      </Td>
                    </Tr>
                  );
                })
              ) : (
                <Tr>
                  <Td colSpan={5}>No data</Td>
                </Tr>
              )}
            </Tbody>
          </Table>
        </TableContainer>

        {/* <Stack direction={"column"}>
          {transData.data.length > 0 ? (
            transData.data.map((trans) => {
              return (
                <Stat
                  px={{ base: 4, md: 8 }}
                  py={"5"}
                  shadow={"xl"}
                  border={"1px solid"}
                  borderColor={useColorModeValue("gray.800", "gray.500")}
                  rounded={"lg"}
                >
                  <Stack
                    direction={"row"}
                    alignItems={"center"}
                    justifyContent={"space-between"}
                    spacing={"6"}
                  >
                    <StatLabel fontWeight={"medium"} isTruncated>
                      {trans.text}
                    </StatLabel>
                    <StatNumber
                      fontSize={"2xl"}
                      fontWeight={"medium"}
                      color={trans.amount < 0 ? "red" : "green"}
                    >
                      {trans.amount}
                    </StatNumber>
                    <Stack direction={"row"} spacing={"6"} my={1}>
                      <Button colorScheme="facebook">edit transaction</Button>
                      <Button colorScheme="red">delete transaction</Button>
                    </Stack>
                  </Stack>
                </Stat>
              );
            })
          ) : (
            <Stat
              px={{ base: 4, md: 8 }}
              py={"5"}
              shadow={"xl"}
              border={"1px solid"}
              borderColor={useColorModeValue("gray.800", "gray.500")}
              rounded={"lg"}
            >
              No transaction
            </Stat>
          )}
        </Stack> */}
      </Flex>
    </MainTemplate>
  );
};

export default account;
