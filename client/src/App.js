import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Center, Text } from "@chakra-ui/react";
import Navbar from "./Components/Navbar/Navbar";
import BooksPage from "./Components/BooksPage/BooksPage";
import BooksInfo from "./Components/AdminPage/BooksInfo";
import Book from "./Components/Book/Book";
const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path='/books' element={<BooksPage />} />
        <Route path='/admin/books' element={<BooksInfo />} />
        <Route path='/book' element={<Book />} />
        <Route
          path='*'
          element={
            <Center>
              <Text fontSize={"5xl"}>Not Found</Text>
            </Center>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
