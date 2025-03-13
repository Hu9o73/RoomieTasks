import axios from 'axios';

const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://localhost:3000';

export async function getUserInfo(userId: number, token: string) {
  try {
    const response = await axios.get(`${USER_SERVICE_URL}/user/${userId}/info`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user info:', error);
    return null;
  }
}

export async function getUsersInfo(userIds: number[], token: string) {
    try {
      // Remove "Bearer " prefix if it exists in the token
      const cleanToken = token.replace('Bearer ', '');
      
      const response = await axios.post(
        `${USER_SERVICE_URL}/users/info`, 
        { userIds },
        { 
          headers: {
            'Authorization': `Bearer ${cleanToken}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching users info:', error);
      return [];
    }
  }