import { HashRouter as Router, Switch, Route } from "react-router-dom";
import Header from "./Compoenents/Header";
import Home from "./Routes/Home";
import Search from "./Routes/Search";
import Tv from "./Routes/Tv";
import Wantto from "./Routes/Wantto";

function App() {
  return (
    <Router>
      <Header />
      <Switch>
        <Route path={["/tv","/tv/:category/:movieId"]}>
          <Tv />
        </Route>
        <Route path={["/search","/search/:movieId"]}>
          <Search />
        </Route>
        <Route path={["/", "/movies/:category/:movieId"]}>
          <Home />
        </Route>
        <Route path={["/wantto","/wantto/:movieId"]}>
          <Wantto />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
