const BASE_URL = {
    DAPUR: "https://dapur-mbg-production.up.railway.app/api/dapur",
    MENU: "https://dapur-mbg-production.up.railway.app/api/menu",
    INVENTORY: "https://dapur-mbg-production.up.railway.app/api/inventory",
    SEKOLAH: "https://dapur-mbg-production.up.railway.app/api/sekolah",
    DISTRIBUSI: "https://dapur-mbg-production.up.railway.app/api/distribusi"
};

const API = {
    dapur: {
        getAll: () => axios.get(`${BASE_URL.DAPUR}/dapur`),
        create: (data) => axios.post(`${BASE_URL.DAPUR}/dapur`, data),
        delete: (id) => axios.delete(`${BASE_URL.DAPUR}/dapur/${id}`)
    },
    menu: {
        getAll: () => axios.get(`${BASE_URL.MENU}/menus`),
        create: (data) => axios.post(`${BASE_URL.MENU}/menus`, data),
        delete: (id) => axios.delete(`${BASE_URL.MENU}/menus/${id}`)
    },
    inventory: {
        getAll: () => axios.get(`${BASE_URL.INVENTORY}/inventories`),
        create: (data) => axios.post(`${BASE_URL.INVENTORY}/inventories`, data),
        delete: (id) => axios.delete(`${BASE_URL.INVENTORY}/inventories/${id}`)
    },
    sekolah: {
        getAll: () => axios.get(`${BASE_URL.SEKOLAH}/sekolah`),
        create: (data) => axios.post(`${BASE_URL.SEKOLAH}/sekolah`, data)
    },
    distribusi: {
        getAll: () => axios.get(`${BASE_URL.DISTRIBUSI}/distribusi`),
        create: (data) => axios.post(`${BASE_URL.DISTRIBUSI}/distribusi`, data),
        delete: (id) => axios.delete(`${BASE_URL.DISTRIBUSI}/distribusi/${id}`)
    }
};