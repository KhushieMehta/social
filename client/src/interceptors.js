import axios from 'axios'


export default function interceptors(history) {
    axios.defaults.baseURL = window.location.href.includes('localhost') ? 'http://localhost:4000' : `https://geek-overflow-backend.herokuapp.com`

    axios.interceptors.request.use(function(req) {
        // Do something before request is sent
        let access_Token = window.localStorage.getItem('access_Token')

        if (access_Token) {
            req.headers['authorization'] = `Bearer ${access_Token}`
        } else {
            console.log('Token not found!')
        }

        return req;
    }, function(error) {
        // Do something with request error
        return Promise.reject(error);
    });

    axios.interceptors.response.use(function(response) {
        // Any status code that lie within the range of 2xx cause this function to trigger
        // Do something with response data
        return response;
    }, async function(error) {
        // Any status codes that falls outside the range of 2xx cause this function to trigger
        // Do something with response error
        let { status } = error.response
        let originalRequest = error.config
        if (status === 403) {
            await refreshAccessToken()
            return axios(originalRequest)
        } else if (status === 401) {
            history.replace('/login')
        }
        return Promise.reject(error);
    });
}

async function refreshAccessToken() {
    let response = await fetch(axios.defaults.baseURL + '/auth/token', {
        method: 'POST',
        body: JSON.stringify({
            token: window.localStorage.getItem('refresh_Token'),
        }),
        headers: {
            'content-type': 'application/json'
        }
    })
    let data = await response.json()
    if (response.status === 200) {
        window.localStorage.setItem('access_Token', data.access_Token)
    }
}