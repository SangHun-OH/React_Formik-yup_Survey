import { Route, Switch } from "react-router-dom";
import Survey from "./pages/Survey";

const App = () => {
  return(
    <>
      <Switch>
        <Route path="/" component={Survey}/>
      </Switch>
    </>
  )
}

export default App;
