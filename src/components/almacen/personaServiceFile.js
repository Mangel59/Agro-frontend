// import axios from 'axios';
import axios from "../axiosConfig";

const API_URL = 'http://172.16.78.255:8082';

// Función para obtener todas las personas
export const getAllPersonas = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/v1/personas/all`);    
    return response.data;
  } catch (error) {
    console.error('Error fetching personas:', error);
    return [];
  }
};

// Función para crear una nueva persona
export const createPersona = async (persona) => {
  try {
    const response = await axios.post(`${API_URL}/api/v1/personas/add`, persona);
    console.log('Persona creada:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating persona:', error);
    throw error;
  }
};

// Función para actualizar una persona existente
export const updatePersona = async (id, persona) => {
  try {
    await axios.put(`${API_URL}/api/v1/personas/update/${id}`, persona);
  } catch (error) {
    console.error('Error updating persona:', error);
  }
};

//elimiar persona

export const deletePersona = async (id) => {
  try {
    await axios.delete(`${API_URL}/api/v1/personas/delete/${id}`);
  } catch (error) {
    console.error('Error deleting persona:', error);
  }
};

