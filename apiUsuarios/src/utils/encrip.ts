import * as CryptoJS from 'crypto-js';


const key = CryptoJS.enc.Utf8.parse('4512631236589784');
const iv = CryptoJS.enc.Utf8.parse('4512631236589784');

export function encryptUsingAES256(value:string) {
    var encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(value), key, {
        keySize: 128 / 8,
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
    return encrypted.toString();
}


export function decryptUsingAES256(decString:string) {
    var decrypted = CryptoJS.AES.decrypt(decString, key, {
        keySize: 128 / 8,
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
    return decrypted.toString(CryptoJS.enc.Utf8);
}

export function getRandomPassword() {
    return (Math.random()* (9999 - 1111) + 1111).toFixed(0);
}
