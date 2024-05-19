import axios, { AxiosError, AxiosResponse} from "axios";
import { toast } from "react-toastify";
import { router } from "../router/Routes";

const sleep = () => new Promise(resolve => setTimeout(resolve, 500));


axios.defaults.baseURL = 'http://170.64.205.145:5000/api/';

const responseBody = (response: AxiosResponse) => response.data; // use arrow functions as more concise  

// function responseBodyFn(response: AxopsResponse) {
//     return response.data;
// } 

axios.interceptors.response.use(async response => {
    await sleep();
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

const request = {
    get: (url: string) => axios.get(url).then(responseBody),
    post: (url: string, body: object) => axios.post(url, body).then(responseBody),
    put: (url: string, body: object) => axios.put(url, body).then(responseBody),
    delete: (url: string) => axios.delete(url).then(responseBody)
}

const Catalog = {
    list: () => request.get('products'),
    details: (id: number) => request.get(`products/${id}`)
}

const TestErrors = {
    get400Error: () => request.get('buggy/bad-request'), 
    get401Error: () => request.get('buggy/unauthorised'), 
    get404Error: () => request.get('buggy/not-found'), 
    get500Error: () => request.get('buggy/server-error'), 
    getValidationError: () => request.get('buggy/validation-error'),
}

const agent = {
    Catalog,
    TestErrors
}

export default agent;