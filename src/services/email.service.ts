import IStudent from "@/modules/solicitud-nuevo/interfaces/student.interface";


export default class EmailService 
{
    public static async sendEmailUbicacion(email:string, codigo:string) {
        const body = JSON.stringify({
            type: 'UBICACION',
            email: email,
            user: codigo
        })
        this.sendEmail(body)
    }
    public static async sendEmailCertificado(email:string, codigo:string) {
        const body = JSON.stringify({
            type: 'CERTIFICADO',
            email: email,
            user: codigo
        })
        this.sendEmail(body)
    }
    public static async sendEmailBeca(email:string, codigo:string) {
        const body = JSON.stringify({
            type: 'BECA',
            email: email,
            user: codigo
        })
        this.sendEmail(body)
    }
    public static async sendEmailRandom(email:string, random:number) {
        const body = JSON.stringify({
            type: 'RANDOM',
            email: email,
            number: random
        })
        this.sendEmail(body)
    }
    public static async sendEmailRegister(student:IStudent) {
        const body = JSON.stringify({ 
            type: 'REGISTER', 
            email: student.Email, 
            user: student.Numero_identificacion 
        })
        this.sendEmail(body)
        
    }
     /**
     * Returns the verification number stored in localStorage if it exists and has not expired.
     * If the number has expired, it is removed from localStorage.
     * @returns {string} The verification number if it exists and has not expired, otherwise an empty string.
     */
    public static getVerificationNumber():string {
        const storedData = localStorage.getItem('verificationNumber');
        if (storedData) {
            const { randomNumber, expirationTime } = JSON.parse(storedData);
            const currentTime = new Date().getTime();
            
            // verify if number has expired
            if (currentTime < expirationTime) {
                return randomNumber; // valid number
            } else {
                localStorage.removeItem('verificationNumber'); // Borrar el dato si ha expirado
            }
        }
        return ''; // if it does not exist or has expired
    }
    private static async sendEmail(body:string) 
    {
        try{
            const response =  await fetch('/api/email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-cache'
                },
                body: body
            })
            if (response.ok) {
                console.log('Email registration sent successfully');
            } else {
                console.error('Failed to send registration email');
            }
        }catch(error){
            console.error('An error occurred while sending the email:', error);
        }
    }
}