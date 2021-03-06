import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Center,
  Flex,
  Text,
  Image,
  Button,
  Stack,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Spinner,
} from "@chakra-ui/react";
import { auth, db } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { updateDoc, doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { fetchBooks } from "../Store/reducers/books";

const Book = ({ user }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [book, setBook] = useState(undefined);
  const [isOpen, setIsOpen] = useState(false);
  // const [user, setUser] = useState("");
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const [bookId, setBookId] = useState(params.get("bookId").toString());
  const [loggedIn, setLoggedIn] = useState(user !== null);
  const [bought, setBought] = useState(false);
  const loading = useSelector((state) => state.books.loading);

  // useEffect(() => {
  //   onAuthStateChanged(auth, (data) => {
  //     console.log(data);
  //     setUser(data);
  //     if (data) {
  //       setLoggedIn(true);
  //     } else {
  //       setLoggedIn(false);
  //     }
  //   });
  // }, []);

  const onClose = () => {
    setIsOpen(false);
  };

  const books = useSelector((state) => state.books.books);
  useEffect(() => {
    setBookId(params.get("bookId").toString());
    console.log(bookId);
    console.log(user);
    dispatch(fetchBooks()).then(() => {
      setBook(books.find((book) => book.id === bookId));
      getDoc(doc(db, "users", user.uid)).then((result) => {
        const purchasedBooks = result.data().purchasedBooks;
        console.log(result);
        if (purchasedBooks.includes(bookId)) {
          setBought(true);
        }
      });
    });
  }, []);

  const handlePurchase = async () => {
    if (loggedIn) {
      console.log(user.uid);
      const result = await getDoc(doc(db, "users", user.uid));
      console.log(result.data().purchasedBooks);
      await updateDoc(doc(db, "users", user.uid), {
        purchasedBooks: [...result.data().purchasedBooks, bookId],
      });
      navigate(`/thankyou?bookId=${bookId}`);
    } else {
      setIsOpen(true);
    }
  };
  if (user === "") {
    return <Spinner size={"xl"} />;
  } else {
    if (loading === true) {
      return (
        <Center>
          <Spinner size='xl' />
        </Center>
      );
    } else {
      if (book !== undefined) {
        return (
          <>
            <Stack p={10} spacing={25} maxW={"1600px"} mx='auto'>
              <Stack
                direction={["column", "column", "column", "row"]}
                spacing={10}
              >
                <Flex alignItems='center' flex='0.3' justifyContent={"center"}>
                  <Image
                    src={book.ImageUrl}
                    width={["100%", "80%", "40%", "100%"]}
                  />
                </Flex>
                <Box flex='0.6'>
                  <Text fontSize={"5xl"}>{book.Title}</Text>
                  <Text fontSize={"xl"}>{book.Author}</Text>
                  <Text fontSize={"lg"}>Rating: {book.Rating}</Text>
                  <Text fontSize={"lg"}>{book.Description}</Text>
                  <Center>
                    <Text
                      fontSize={"3xl"}
                      align='center'
                      as='b'
                      color='purple.800'
                    >
                      Price: {book.Price}
                    </Text>
                  </Center>
                </Box>
              </Stack>
              {!bought ? (
                <Button colorScheme={"blue"} size='lg' onClick={handlePurchase}>
                  Purchase Book
                </Button>
              ) : (
                <Button colorScheme={"green"} size='lg'>
                  Book Purchased
                </Button>
              )}
            </Stack>
            <AlertDialog isOpen={isOpen} onClose={onClose}>
              <AlertDialogOverlay>
                <AlertDialogContent>
                  <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                    Sign In to continue
                  </AlertDialogHeader>

                  <AlertDialogBody>
                    You need to sign in to purchase this book.
                  </AlertDialogBody>

                  <AlertDialogFooter>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button
                      colorScheme='blue'
                      onClick={() => {
                        navigate("/login");
                      }}
                      ml={3}
                    >
                      Sign in
                    </Button>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialogOverlay>
            </AlertDialog>
          </>
        );
      } else {
        return (
          <Center>
            <Text fontSize={"5xl"} color='gray.500'>
              No book found
            </Text>
          </Center>
        );
      }
    }
  }
};

export default Book;
