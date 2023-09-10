import axios from 'axios';

const server_path = "localhost:4999"
const api_path = "/api/v2"

let getBeersData = async () => {
    try {
        const response = await axios.get(`${server_path}${api_path}/person`);
        return response.data;
    } catch (error: any) {
        console.error(error.message);
    }
}

let getBeerData = async (name: string) => {
    try {
        const response = await axios.get(`${server_path}${api_path}/person/${name}`);
        return response.data;
    } catch (error: any) {
        console.error(error.message);
    }
}

let incrementBeerData = async (name: string, type: string) => {
    try {
        await axios.post(`${server_path}${api_path}/person/${name}`, {
            type: type
        });
    } catch (error: any) {
        console.error(error.message);
    }
}

let deleteBeerData = async (name: string) => {
    try {
        await axios.delete(`${server_path}${api_path}/person/${name}/delete`);
    } catch (error: any) {
        console.error(error.message);
    }
}