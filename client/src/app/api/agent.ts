import axios, { AxiosError, AxiosResponse} from "axios";
import { toast } from "react-toastify";
import { router } from "../router/Routes";
import { PaginatedResponse } from "../models/pagination";
import { store } from "../store/configureStore";

const sleep = () => new Promise(resolve => setTimeout(resolve, 500));


axios.defaults.baseURL = 'http://localhost:5000/api/';
axios.defaults.withCredentials = true;

const responseBody = (response: AxiosResponse) => response.data; // use arrow functions as more concise  

// function responseBodyFn(response: AxopsResponse) {
//     return response.data;
// } 

axios.interceptors.request.use(config => {
    const token = store.getState().account.user?.token;
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
})

axios.interceptors.response.use(async response => {
    await sleep();
    // console.log(response);
    const pagination = response.headers['pagination']; // axios only works with lower case 
    if (pagination) {
        response.data = new PaginatedResponse(response.data, JSON.parse(pagination));
        console.log(response);
        return response;
    }
    return response
}, (error: AxiosError) => {
    // The destructuring assignment { data, status } = error.response extracts the data and status properties from error.response into separate variables data and status.
    const {data, status} = error.response as AxiosResponse; // Type Assertion tells the TypeScript compiler to treat error.response as if it were of type AxiosResponse.
    switch (status) { 
        case 400:
            if (data.errors) {
                const modelStateErrors: string[] = [];
                for (const key in data.errors) {
                    if (data.errors[key]) {
                        modelStateErrors.push(data.errors[key])
                    }
                }
                throw modelStateErrors.flat();
            }
            toast.error(data.title);
            break;
        case 401:
            toast.error(data.title);
            break;
        case 404:
            toast.error(data.title);
            break;
        case 500:
            router.navigate('/server-error', {state: {error: data}});
            // toast.error(data.title);
            break;
        default:
            break;
    }

    return Promise.reject(error.response);
})

const requests = {
    get: (url: string, params?: URLSearchParams) => axios.get(url, {params}).then(responseBody),
    post: (url: string, body: object) => axios.post(url, body).then(responseBody),
    put: (url: string, body: object) => axios.put(url, body).then(responseBody),
    delete: (url: string) => axios.delete(url).then(responseBody)
}

const Catalog = {
    list: (params: URLSearchParams) => requests.get('products', params),
    details: (id: number) => requests.get(`products/${id}`),
    fetchFilters: () => requests.get(`products/filters`)
}

const TestErrors = {
    get400Error: () => requests.get('buggy/bad-request'), 
    get401Error: () => requests.get('buggy/unauthorised'), 
    get404Error: () => requests.get('buggy/not-found'), 
    get500Error: () => requests.get('buggy/server-error'), 
    getValidationError: () => requests.get('buggy/validation-error'),
}


const Basket = {
    get: () => requests.get('basket'),
    // even though we're not sending any data in the body because we're 
    // using query strings, we still need an empty object to go with this 
    addItem: (productId: number, quantity = 1) => requests.post(`basket?productId=${productId}&quantity=${quantity}`, {}),
    removeItem: (productId: number, quantity = 1) => requests.delete(`basket?productId=${productId}&quantity=${quantity}`)
}

const Account = {
    login: (values: any) => requests.post('account/login', values),
    register: (values: any) => requests.post('account/register', values),
    currentUser: () => requests.get('account/currentUser'),
}


const agent = {
    Catalog,
    TestErrors,
    Basket, 
    Account
}

export default agent;