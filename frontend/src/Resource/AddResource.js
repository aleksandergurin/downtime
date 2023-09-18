import {useState} from "react"
import {useNavigate} from "react-router-dom"
import {Button, Form, Input, Select} from "antd"
import {
    RESOURCES_PATH,
    CSRF_PATH,
    RESOURCE_SCHEME_HTTP,
    RESOURCE_SCHEME_HTTPS,
} from "../Constants"

const SCHEME_DEFAULT = RESOURCE_SCHEME_HTTP
const SCHEME_OPTIONS = [
    {
        value: RESOURCE_SCHEME_HTTP,
        label: RESOURCE_SCHEME_HTTP,
    },
    {
        value: RESOURCE_SCHEME_HTTPS,
        label: RESOURCE_SCHEME_HTTPS,
    },
]

// minutes
const POLLING_INTERVAL_DEFAULT = 1
const POLLING_INTERVAL_OPTIONS = [
    {value: POLLING_INTERVAL_DEFAULT, label: POLLING_INTERVAL_DEFAULT},
    {value: 5, label: 5},
    {value: 10, label: 10},
]


export const AddResource = () => {
    const navigate = useNavigate()

    const [url, setUrl] = useState('')
    const [scheme, setScheme] = useState(SCHEME_DEFAULT)
    const [pollingInterval, setPollingInterval] = useState(POLLING_INTERVAL_DEFAULT)

    const handleSubmit = (e) => {
        e.preventDefault()

        fetch(CSRF_PATH)
            .then(response => {
                fetch(RESOURCES_PATH, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "X-CSRFToken": response.headers.get('X-CSRFToken'),
                    },
                    body: JSON.stringify({url, scheme, polling_interval: pollingInterval}),
                })
                    .then(response => {
                        if (response.status === 201) {
                            navigate("/")
                        }
                        // TODO: process errors
                    })
            })
    }

    return (
        <>
            <Form layout="vertical" style={{maxWidth: '400px'}}>
                <Form.Item label="URL">
                    <Input
                        addonBefore={
                            <Select
                                defaultValue={SCHEME_DEFAULT}
                                style={{width: 80}}
                                onChange={setScheme}
                                options={SCHEME_OPTIONS}
                            />
                        }
                        placeholder="example.com"
                        onChange={(e) => setUrl(e.target.value)}
                    />
                </Form.Item>
                <Form.Item label="Polling interval">
                    <Select
                        defaultValue={POLLING_INTERVAL_DEFAULT}
                        style={{width: 50,}}
                        onChange={setPollingInterval}
                        options={POLLING_INTERVAL_OPTIONS}
                    />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" onClick={handleSubmit}>
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </>
    )
}
