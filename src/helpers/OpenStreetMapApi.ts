import axios from 'axios';

export async function validateAddress(address: string): Promise<boolean> {
    const encodedAddress = encodeURIComponent(address);
    const url = `https://nominatim.openstreetmap.org/search?q=${encodedAddress}&format=json&limit=1`;
    try {
        const response = await axios.get(url);
        const data = response.data;
        return data.length > 0;
    } catch (error) {
        console.error('Error:', error);
        return false;
    }
}

export async function calculateDistance(address: string): Promise<number | undefined | string> {
    const fixedLocation = "1 washington Dc"; // Thay thế bằng vị trí cố định của bạn

    const url = "https://nominatim.openstreetmap.org/search";

    const params = {
      q: address,
      format: "json",
      limit: '1'
    };

    try {
      const response = await fetch(url + "?" + new URLSearchParams(params));
      const data = await response.json();

      if (data.length > 0) {
        const userLat = data[0].lat;
        const userLon = data[0].lon;

        // Tính toán khoảng cách dựa trên tọa độ địa lý
          return await calculateDistanceFromCoordinates(userLat, userLon, fixedLocation);
      } else {
          return undefined;
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function calculateDistanceFromCoordinates(lat1: string, lon1: string, address: string) {
    const url = "https://nominatim.openstreetmap.org/search";

    const params = {
      q: address,
      format: "json",
      limit: '1'
    };

    try {
      const response = await fetch(url + "?" + new URLSearchParams(params));
      const data = await response.json();

      if (data.length > 0) {
        const lat2 = data[0].lat;
        const lon2 = data[0].lon;

        // Tính toán khoảng cách giữa hai tọa độ địa lý
        const distance = await calculateDistanceBetweenCoordinates(lat1, lon1, lat2, lon2);
        return distance;
      } else {
        throw new Error("Không tìm thấy địa chỉ");
      }
    } catch (error) {
      console.log(error);
    }
  }

  function calculateDistanceBetweenCoordinates(lat1: string, lon1: string, lat2: string, lon2: string) {
    const R = 6371; // Bán kính Trái Đất trong kilômét

    const dLat = deg2rad(Number(lat2) - Number(lat1));
    const dLon = deg2rad(Number(lon2) - Number(lon1));

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(Number(lat1))) * Math.cos(deg2rad(Number(lat2))) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return distance.toFixed(2);
  }

  function deg2rad(deg: number) {
    return deg * (Math.PI / 180);
  }
