import axios from 'axios';
import { Beer, Person, Stat } from './DataTypes';

const server_path = ""
const api_path = "/api/v2"

async function getPersonsData(handler: string, password: string | null): Promise<Record<string, Person>> {
    try {
        const response = await axios.get(`${server_path}${api_path}/person?handler=${handler}&password=${password}`);
        return response.data as Record<string, Person>;
    } catch (error: any) {
        console.error(error.message);
        return {};
    }
}

async function getPersonData(name: string): Promise<Person> {
    try {
        const response = await axios.get(`${server_path}${api_path}/person/${name}`);
        return response.data as Person;
    } catch (error: any) {
        console.error(error.message);
        return {} as Person;
    }
}

async function getBeersData(handler: string, password: string | null): Promise<Record<string, Beer>> {
    try {
        const response = await axios.get(`${server_path}${api_path}/beer?handler=${handler}&password=${password}`);
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

async function payBeerData(name: string, handler: string) {
    try {
        await axios.post(`${server_path}${api_path}/beer/${name}/pay?handler=${handler}`);
    } catch (error: any) {
        console.log(error.message);
    }
}

async function deleteBeerData(name: string, handler: string) {
    try {
        await axios.delete(`${server_path}${api_path}/beer/${name}?handler=${handler}`);
    } catch (error: any) {
        console.error(error.message);
    }
}

async function checkPassword(name: string, password: string): Promise<boolean> {
    try {
        const response = await axios.get(`${server_path}${api_path}/person/${name}/password?password=${password}`);
        return response.data as boolean;
    } catch (error: any) {
        console.error(error.message);
        return false;
    }
}

async function setPassword(name: string, password: string, passwordOld: string) {
    try {
        await axios.post(`${server_path}${api_path}/person/${name}/password?password=${password}&passwordOld=${passwordOld}`);
    } catch (error: any) {
        console.error(error.message);
    }
}

async function getStatData(key: number, handler: string, password: string | null): Promise<Stat> {
    try {
        const response = await axios.get(`${server_path}${api_path}/stat/${key}?handler=${handler}&password=${password}`);
        return response.data as Stat;
    } catch (error: any) {
        console.error(error.message);
        return { small_beers: 0, big_beers: 0, beef_jerky: 0 };
    }
}

async function getMeter(): Promise<number> {
    try {
        const response = await axios.get(`${server_path}${api_path}/stat/meter`);
        return response.data as number;
    } catch (error: any) {
        console.error(error.message);
        return 0;
    }
}

async function getProductPrices(): Promise<{small_beer: number, big_beer: number, beef_jerky: number}> {
    try {
        const response = await axios.get(`${server_path}${api_path}/customize/prices`);
        return response.data as {small_beer: number, big_beer: number, beef_jerky: number};
    } catch(error: any) {
        console.error(error.message);
        return {small_beer: -1, big_beer: -1, beef_jerky: -1};
    }
}

async function setProductPrices(password: string | null, prices: { small_beer: number, big_beer: number, beef_jerky: number }) {
    try {
        await axios.post(`${server_path}${api_path}/customize/prices?password=${password}&small_beer=${prices.small_beer}&big_beer=${prices.big_beer}&beef_jerky=${prices.beef_jerky}`);
    } catch(error: any) {
        console.error(error.message);
    }
}

export { getPersonsData, getPersonData, getBeersData, incrementBeerData, payBeerData, deleteBeerData, checkPassword, setPassword, getStatData, getMeter, getProductPrices as getPrices, setProductPrices as setPrices };