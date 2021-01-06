import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { ApiConfig } from '../config/ApiConfig';

export default function api(path: string, method: 'get' | 'post' | 'put' | 'patch' | 'delete', body: any | undefined){

    return new Promise<ApiResponse>((resolve) => {
        
        const requestData: AxiosRequestConfig = {
            method: method,
            url: path,
            baseURL: ApiConfig.API_URL,
            data: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': getToken()            }
        };

        axios(requestData)
        .then(res => responseHandler(res, resolve))
        .catch(async err => {
   
            console.log(requestData.data);

            const response: ApiResponse = {
                status: 'error',
                data: err
            };

            return resolve(response);
        });
    });
    
}

function getToken(): string{
    const token = localStorage.getItem('api_token');
    return 'Berer ' + token;
}

export function saveToken(token: string): void{
    localStorage.setItem('api_token', token)
}

function getRefreshtoken(): string{
    const token = localStorage.getItem('api_refresh_token');
    return token + '';
}

export function saveRefreshToken(token: string): void{
    localStorage.setItem('api_refresh_token', token)
}

async function responseHandler(res: AxiosResponse<any>, resolve: (value: ApiResponse) => void){

    if(res.status < 200 || res.status >= 300){

        const response: ApiResponse = {
            status: 'error',
            data: res.data
        };

        return resolve(response);
    }
    
    if(res.data.statusCode < 0){
        const response: ApiResponse = {
            status: 'ok',
            data: res.data
        };

        return resolve(response);
    }

    const response: ApiResponse = {
        status: 'ok',
        data: res.data
    };

    return resolve(response)
}

export interface ApiResponse{
    status: 'ok' | 'error' | 'login';
    data: any;
}

async function refreshToken(): Promise<string | null>{

    const path = 'auth/user/refresh';
    const data = {
        token: getRefreshtoken()
    };

    const refreshTokenRequestData: AxiosRequestConfig = {

        method: 'post',
        url: path,
        baseURL: ApiConfig.API_URL,
        data: JSON.stringify(data),
        headers: {
            'Content-Type': 'aplication/json'
        }
    }

    const refreshTokenResponse: {data: {token: string | undefined } } = await axios(refreshTokenRequestData);

    if(!refreshTokenResponse.data.token){
        return null;
    }

    return refreshTokenResponse.data.token;

}

async function repeatRequest(requestData: AxiosRequestConfig, resolve: (value: ApiResponse) => void){

    axios(requestData).then(res =>{
        if(res.status === 401){
            const response: ApiResponse = {
                status: 'login',
                data: null
            }
            return resolve(response);
        }

        const response: ApiResponse = {
            status: 'ok',
            data: res
        }

        return resolve(response);
    }).catch(err => {
        const response: ApiResponse = {
            status: 'error',
            data: err
        }
        return resolve(response);
    })
}