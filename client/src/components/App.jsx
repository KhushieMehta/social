import { BrowserRouter as Router, Route, Switch, Redirect, useHistory } from "react-router-dom"
import Feed from "./Feed"
import Login from "./Login"
import SignUp from "./SignUp"
import interceptors from "../interceptors"
import Profile from "./Profile"
import AppBar from "./AppBar"

export default function App() {
    const history = useHistory()
    interceptors(history)
    return (
        <Router>
            <Switch>
                <Route exact path='/'>
                    <Redirect to='/login' />
                </Route>
                <Route exact path='/login'>
                    {
                        window.localStorage.getItem('access_Token') ?
                            <Redirect to='/feed' />
                            :
                            <Login />
                    }
                </Route>
                <Route exact path='/signup'>
                    <SignUp />
                </Route>
                <div>
                    <AppBar />
                    <PrivateRoute exact path='/feed'>
                        <Feed />
                    </PrivateRoute>
                    <PrivateRoute exact path='/profile'>
                        <Profile />
                    </PrivateRoute>
                    <PrivateRoute path='/profile/:id'>
                        <Profile />
                    </PrivateRoute>
                </div>
            </Switch>
        </Router>
    )
}

function PrivateRoute({ children, ...rest }) {

    return (
        <Route
            {...rest}
            render={({ location }) =>
                window.localStorage.getItem('access_Token') ? (
                    children
                ) : (
                    <Redirect
                        to={{
                            pathname: "/login",
                            state: { from: location }
                        }}
                    />
                )
            }
        />
    );
}