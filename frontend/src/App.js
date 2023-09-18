import {useEffect, useState} from "react"
import {BrowserRouter, Route, Routes} from "react-router-dom"

import "./App.css"
import {LOGIN_PATH, WHOAMI_PATH} from "./Constants"
import {ResourcesList} from "./Resource/ResourcesList"
import {AddResource} from "./Resource/AddResource"
import {ResourceDetails} from "./Resource/ResourceDetails"
import {NoPage} from "./NoPage"


const App = () => {
    const [username, setUsername] = useState(null)

    useEffect(() => {
        fetch(WHOAMI_PATH)
            .then(response => {
                if (response.status === 200) {
                    return response.json()
                } else if ([401, 403].includes(response.status)) {
                    // Go to login page.
                    window.location = `${LOGIN_PATH}?next=/`
                }
            })
            .then(data => {
                if (data.isAuthenticated) {
                    setUsername(data.username)
                }
            })
    }, [])

    return (
        <div className="App">
            {
                username &&
                    <BrowserRouter>
                        <Routes>
                            <Route path="/" element={<ResourcesList />} />
                            <Route path="/add" element={<AddResource />} />
                            <Route path="/resource/:resourceId" element={<ResourceDetails />} />
                            <Route path="*" element={<NoPage />} />
                        </Routes>
                    </BrowserRouter>
            }
        </div>
    )
}

export default App
