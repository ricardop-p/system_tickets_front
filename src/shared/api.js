import axios from 'axios'

const api = axios.create({
  // baseURL: 'http://localhost:8007/api', local host
  baseURL: 'https://system-tickets.kobrax.art/api', // iamport api
  headers: {
    'Content-Type': 'application/json'
  }
})

export default api
