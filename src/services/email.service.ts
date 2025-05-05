import IStudent from "@/modules/solicitud-nuevo/interfaces/student.interface";


export default class EmailService 
{
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