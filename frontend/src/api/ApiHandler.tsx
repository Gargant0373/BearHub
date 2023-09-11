import axios from 'axios';
import { Beer, Person } from './DataTypes';

const server_path = ""
const api_path = "/api/v2"

async function getPersonsData(): Promise<Record<string, Person>> {
    try {
        const response = await axios.get(`${server_path}${api_path}/person`);
        return response.data as Record<string, Person>;
    } catch (error: any) {
        console.error(error.message);
        return {};
    }
}

async function getBeersData(): Promise<Record<string, Beer>> {
    try {
        const response = await axios.get(`${server_path}${api_path}/beer`);
        return response.data as Record<string, Beer>;
    } catch (error: any) {
        console.error(error.message);
        return {};
    }
}

async function incrementBeerData(name: string, type: string) {
    try {
        await axios.post(`${server_path}${api_path}/person/${name}/increment?type=${type}`);
    } catch (error: any) {
        console.error(error.message);
    }
}

async function payBeerData(name: string) {
    try {
        await axios.post(`${server_path}${api_path}/beer/${name}/pay`);
    } catch (error: any) {
        console.log(error.message);
    }
}

async function deleteBeerData(name: string) {
    try {
        await axios.delete(`${server_path}${api_path}/beer/${name}`);
    } catch (error: any) {
        console.error(error.message);
    }
}

export { getPersonsData, getBeersData, incrementBeerData, payBeerData, deleteBeerData };