import axios from "axios";


export const getPrograms = async (url: string) => {
    try {
      const response = await axios.get(`${url}`);
      return response.data;
    } catch (error) {
      return error;
    }
}

export const getProgramOne = async (url: string, id: string | number) => {
  try {
    const response = await axios.get(`${url}/${id}`);
    return response.data;
  } catch (error) {
    return error;
  }
}

export const getCustomUsers = async (url: string, page: string | null) => {
  try {
    let response: any = ""
    if (page) { response = await axios.get(`${url}?page=${page}`); }
    else { response = await axios.get(`${url}`); }
    
    return response.data;
  } catch (error) {
    return error;
  }
}

export const getCustomUsersOne = async (url: string, id: string | number) => {
  try {
    const response = await axios.get(`${url}/${id}`);
    return response.data;
  } catch (error) {
    return error;
  }
}

