// Add this APIManager class to the top of your main.js
class APIManager {
    static apiKey = null;

    static setApiKey(key) {
        this.apiKey = key;
        localStorage.setItem('gemini_api_key', key);
    }

    static getApiKey() {
        if (!this.apiKey) {
            this.apiKey = localStorage.getItem('AIzaSyDyREJYm8yNbodJwHIkvDbbIq4R5ms2gKo');
        }
        return this.apiKey;
    }

    static hasValidKey() {
        return !!this.getApiKey();
    }

    static async analyzeImage(base64Image) {
        // This will call your backend server
        const formData = new FormData();
        const blob = this.base64ToBlob(base64Image);
        formData.append('image', blob, 'image.jpg');

        const response = await fetch('/api/analyze', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }

        const result = await response.json();
        return result.analysis;
    }

    static base64ToBlob(base64) {
        const byteCharacters = atob(base64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        return new Blob([byteArray], { type: 'image/jpeg' });
    }
}