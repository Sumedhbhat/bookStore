import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { Center, Spinner, Text } from "@chakra-ui/react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "./firebase";
import { AnimatePresence } from "framer-motion";
import { doc, getDoc } from "firebase/firestore";

import Navbar from "./Components/Navbar/Navbar";
import BooksPage from "./Components/BooksPage/BooksPage";
import BooksInfo from "./Components/AdminPage/BooksInfo";
import Book from "./Components/Book/Book";
import LoginPage from "./Components/LoginPage/LoginPage";
import ThankYouPage from "./Components/ThankYouPage/ThankYouPage";
import PurchasedBooks from "./Components/PurchasedBooks/PurchasedBooks";
import Landing from "./Components/Landing/Landing";
import SearchPage from "./Components/SearchPage/SearchPage";

const App = () => {
  const [user, setUser] = useState("");
  const [admin, setAdmin] = useState(null);
  useEffect(() => {
    onAuthStateChanged(auth, (data) => {
      console.log(data);
      setUser(data);
      if (data) {
        getDoc(doc(db, "users", data.uid)).then((data) => {
          setAdmin(data.data().role === "admin");
        });
      }
    });
  }, []);

  // if (user === "") {
  //   return (
  //     <Routes>
  //       <Route
  //         path='*'
  //         element={
  //           <Center>
  //             <Spinner
  //               thickness='4px'
  //               speed='0.65s'
  //               emptyColor='gray.200'
  //               color='blue.500'
  //               size='xl'
  //             />
  //           </Center>
  //         }
  //       />
  //     </Routes>
  //   );
  // } else {
  //   return (
  //     <>
  //       <Navbar user={user} admin={admin} />
  //       <Routes>
  //         <Route path='/' element={<Landing />} />
  //         <Route
  //           path='/dashboard'
  //           element={admin ? <BooksInfo /> : <BooksPage />}
  //         />
  //         <Route path='book' element={<Book />} />
  //         <Route path='/thankyou' element={<ThankYouPage />} />
  //         <Route path='/purchasedBooks' element={<PurchasedBooks />} />
  //         <Route path='/login' element={<LoginPage />} />
  //         <Route path='/search' element={<SearchPage />} />
  //         <Route path='*' element={<Text>404</Text>} />
  //       </Routes>
  //     </>
  //   );
  // }
  if (user === "") {
    console.log(user);
    return (
      <Center>
        <Spinner size={"xl"} />;
      </Center>
    );
  } else {
    if (user === null) {
      console.log(user);
      return (
        <>
          <Navbar admin={admin} user={user} />
          <Routes>
            <Route path='/' element={<Landing />} />
            <Route path='/login' element={<LoginPage user={user} />} />
            <Route
              path='*'
              element={
                <Center>
                  <Text fontSize={"5xl"}>Not Found</Text>
                </Center>
              }
            />
          </Routes>
        </>
      );
    } else if (admin === true) {
      console.log(user);
      return (
        <>
          <Navbar admin={admin} user={user} />
          <Routes>
            <Route path='/' element={<BooksInfo user={user} />} />
            <Route path='/login' element={<LoginPage user={user} />} />
            <Route
              path='*'
              element={
                <Center>
                  <Text fontSize={"5xl"}>Not Found</Text>
                </Center>
              }
            />
          </Routes>
        </>
      );
    } else if (admin === false) {
      console.log(user);
      return (
        <>
          <Navbar admin={admin} user={user} />
          <Routes>
            <Route path='/' exact element={<BooksPage user={user} />} />
            <Route path='/book' exact element={<Book user={user} />} />
            <Route path='/login' element={<LoginPage user={user} />} />
            <Route path='/thankyou' element={<ThankYouPage />} />
            <Route path='/purchasedBooks' element={<PurchasedBooks />} />
            <Route path='/search' element={<SearchPage />} />
            <Route
              path='*'
              element={
                <Center>
                  <Text fontSize={"5xl"}>Not Found</Text>
                </Center>
              }
            />
          </Routes>
        </>
      );
    } else {
      return (
        <Center>
          <Spinner size={"xl"} />;
        </Center>
      );
    }
  }
};

export default App;
