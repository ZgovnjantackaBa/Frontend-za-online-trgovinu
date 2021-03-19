import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { ApiConfig } from '../config/ApiConfig';

export default function api(path: string, method: 'get' | 'post' | 'put' | 'patch' | 'delete', body: any | undefined, role: 'user' | 'administrator' = 'user'){

    return new Promise<ApiResponse>((resolve) => {
        
        const requestData: AxiosRequestConfig = {
            method: method,
            url: path,
            baseURL: ApiConfig.API_URL,
            data: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': getToken(role)            }
        };

        axios(requestData)
        .then(res => responseHandler(res, resolve))
        .catch(async err => {
   
            const response: ApiResponse = {
                status: 'error',
                data: err
            };

            return resolve(response);
        });
    });
    
}

function getToken(role: 'user' | 'administrator'): string{
    const token = localStorage.getItem('api_token' + role);
    return 'Berer ' + token;
}

export function saveToken(token: string, role: 'user' | 'administrator'): void{
    localStorage.setItem('api_token' + role, token)
}

function getRefreshtoken(role: 'user' | 'administrator'): string{
    const token = localStorage.getItem('api_refresh_token' + role);
    return token + '';
}

export function saveRefreshToken(token: string, role: 'user' | 'administrator'): void{
    localStorage.setItem('api_refresh_token' + role, token)
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

async function refreshToken(role: 'user' | 'administrator'): Promise<string | null>{

    const path = 'auth/' + role + '/refresh';
    const data = {
        token: getRefreshtoken(role)
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

export function saveIdentity(identity: string, role: "user" | "administrator"){
    localStorage.setItem('api_identity' + role, identity);
}

export function getIdentity(role: "user" | "administrator"): string{
    const item = localStorage.getItem('api_identity' + role);

    return item + '';
}

export function saveId(iDAsString: string, role: "user" | "administrator"){
    localStorage.setItem('api_id' + role, iDAsString);
}

export function getId(role: "user" | "administrator"): string{
    const item = localStorage.getItem('api_id' + role);

    return item + '';
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