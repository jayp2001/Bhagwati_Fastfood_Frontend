import CryptoJS from "crypto-js";

export const getUserRole = () => {
    try {
        const key = process.env.REACT_APP_AES_KEY;
        const user = JSON.parse(localStorage.getItem("userInfo"));
        if (!user || !user.userRights) return null;

        const bytes = CryptoJS.AES.decrypt(user.userRights, key);
        const decryptedRole = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        return decryptedRole;
    } catch (error) {
        console.error("Error decrypting user role:", error);
        return null;
    }
};
