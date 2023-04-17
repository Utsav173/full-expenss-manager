import {
  Box,
  Flex,
  Heading,
  Text,
  Stack,
  Container,
  Avatar,
  useColorModeValue,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { dataState } from "../../context";
import MainTemplate from "./components/maintemplate";
import axios from "axios";
import Link from "next/link";
import UpdateAcc from "./components/UpdateAcc";
import { DeleteIcon } from "@chakra-ui/icons";

export const Testimonial = ({ children }) => {
  return <Box>{children}</Box>;
};

export const TestimonialContent = ({ children }) => {
  return (
    <Stack
      bg={useColorModeValue("white", "gray.800")}
      boxShadow={"lg"}
      p={8}
      rounded={"xl"}
      align={"center"}
      pos={"relative"}
      _after={{
        content: `""`,
        w: 0,
        h: 0,
        borderLeft: "solid transparent",
        borderLeftWidth: 16,
        borderRight: "solid transparent",
        borderRightWidth: 16,
        borderTop: "solid",
        borderTopWidth: 16,
        borderTopColor: useColorModeValue("white", "gray.800"),
        pos: "absolute",
        bottom: "-16px",
        left: "50%",
        transform: "translateX(-50%)",
      }}
    >
      {children}
    </Stack>
  );
};

export const TestimonialHeading = ({ children }) => {
  return (
    <Heading as={"h3"} fontSize={"xl"}>
      {children}
    </Heading>
  );
};

export const TestimonialText = ({ children }) => {
  return (
    <Text
      textAlign={"center"}
      color={useColorModeValue("gray.600", "gray.400")}
      fontSize={"sm"}
    >
      {children}
    </Text>
  );
};

const Homepage = () => {
  const { fetchHomepageData, loading, data, refresh, setRefresh } = dataState();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [accname, setAccname] = useState("");

  const handleCreateAccount = async () => {
    const user = localStorage.getItem("userInfo");
    const { token } = JSON.parse(user);

    const options = {
      method: "POST",
      url: "http://localhost:1337/addAccount",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        name: accname,
      },
    };
    await axios
      .request(options)
      .then((response) => {
        console.log(response);
        if (response.status == 201) {
          setRefresh(!refresh);
        } else {
          return console.log("error");
        }
      })
      .catch((error) => {
        return console.log(error);
      });
    if (isOpen) {
      return onClose();
    }
  };

  const handleDeleteAcc = async (accID) => {
    console.log("acc id -->", accID);
    const user = localStorage.getItem("userInfo");
    const { token } = JSON.parse(user);
    const options = {
      method: "DELETE",
      url: `http://localhost:1337/delAccount/${accID}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    await axios
      .request(options)
      .then((response) => {
        console.log(response.data.data);
        if (response.status == 200) {
          return setRefresh(!refresh);
        } else {
          return console.log("error");
        }
      })
      .catch((error) => {
        return console.log(error);
      });
  };

  useEffect(() => {
    fetchHomepageData();
  }, [refresh]);

  return loading == true ? (
    <p>Loading...</p>
  ) : (
    <MainTemplate>
      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />

        <ModalContent>
          <ModalHeader>create new account</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              placeholder="account name"
              value={accname}
              onChange={(e) => setAccname(e.target.value)}
            />
          </ModalBody>
          <ModalFooter>
            <Stack direction={"row"}>
              <Button onClick={onClose}>Close</Button>
              <Button onClick={handleCreateAccount}>Create</Button>
            </Stack>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Box bg={useColorModeValue("gray.100", "gray.700")}>
        <Container maxW={"7xl"} py={16} as={Stack} spacing={12}>
          <Stack spacing={0} align={"center"}>
            <Heading>Yout accounts</Heading>
            <Button onClick={onOpen}>+ new account</Button>
          </Stack>

          <Stack
            direction={{ base: "column", md: "row" }}
            spacing={{ base: 10, md: 4, lg: 10 }}
          >
            {data.accData.length ? (
              data.accData.map((v, i) => {
                return (
                  <Testimonial key={i}>
                    <TestimonialContent key={i + 1}>
                      <Link href={`/account/${v.id}`}>
                        <TestimonialHeading textAlign="center">
                          {v.name}
                        </TestimonialHeading>
                        <TestimonialText>{v.id}</TestimonialText>
                      </Link>
                      <Stack direction={"row"} justifyContent={"space-between"} w={"50%"} px={5}>
                        <DeleteIcon
                          color="red"
                          onClick={() => handleDeleteAcc(v.id)}
                        />
                        <UpdateAcc accId={v.id} />
                      </Stack>
                    </TestimonialContent>
                  </Testimonial>
                );
              })
            ) : (
              <>...loading</>
            )}
          </Stack>
        </Container>
      </Box>
    </MainTemplate>
  );
};

export default Homepage;
