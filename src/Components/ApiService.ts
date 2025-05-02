// const token = localStorage.getItem('token');
// const headers = {
//   'Content-Type': 'application/json',
//   Authorization: `Bearer ${token}`,
// };

// const ApiService = {
//   // GET request
//   async get<T>(url: string): Promise<T> {
//     const response = await fetch(url, {
//       method: 'GET',
//       headers,
//     });
//     if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
//     return await response.json();
//   },

//   async post<T>(url: string, data: any): Promise<T> {
//     const token = localStorage.getItem('token');
//     const headers = {
//       'Content-Type': 'application/json',
//       Authorization: `Bearer ${token}`, // Asegúrate de incluir el token en el formato correcto
//     };

//     const response = await fetch(url, {
//       method: 'POST',
//       headers,
//       body: JSON.stringify(data),
//     });

//     if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
//     return await response.json();
//   },

//   // PUT request
//   async put<T>(url: string, data: any): Promise<T> {
//     const response = await fetch(url, {
//       method: 'PUT',
//       headers,
//       body: JSON.stringify(data),
//     });
//     if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
//     return await response.json();
//   },

//   // DELETE request
//   async delete(url: string): Promise<void> {
//     const response = await fetch(url, {
//       method: 'DELETE',
//       headers,
//     });
//     if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
//   },
// };

// export default ApiService;
const ApiService = {
  async get<T>(url: string): Promise<T> {
    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };

    const response = await fetch(url, {
      method: 'GET',
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw { status: response.status, data };
    }

    return data;
  },

  async post<T>(url: string, bodyData: any): Promise<T> {
    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(bodyData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw { status: response.status, data };
    }

    return data;
  },

  async put<T>(url: string, bodyData: any): Promise<T> {
    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };

    const response = await fetch(url, {
      method: 'PUT',
      headers,
      body: JSON.stringify(bodyData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw { status: response.status, data };
    }

    return data;
  },

  async delete(url: string): Promise<void> {
    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };

    const response = await fetch(url, {
      method: 'DELETE',
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw { status: response.status, data };
    }
  },
};

export default ApiService;
